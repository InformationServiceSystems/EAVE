import os
from datetime import date
import numpy as np
import joblib
import torch
import pandas as pd

import pyro
from pyro.infer import SVI, Trace_ELBO, Predictive
from pyro.optim import Adam

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from .energy import calculate_energy_values
from .environment import get_env_data
from .casual_model import CausalBNN  # your BNN definition, used only for training

##################################################################
'''
    Training the BNN model because loading saved probablistic model is not directly supported by pyro.
    See comments at the end of (causal_model.py) for a list of model-loading methods tried.
'''
file_dir = os.path.dirname(__file__)
PUE_CSV_filepath = os.path.join(file_dir, 'PUE_data.csv')
df = pd.read_csv(PUE_CSV_filepath)  

features = ['# of Nodes', '# of Accelerators', 'Host Processor Core Count',
       'Avg. Result at System Name', 'Temperature_C', 'Humidity_%',
       'Solar_Radiation_Wm2', 'Wind_Speed_mps', 'TDP_acc', 'TDP_proc',
       'Cooling_Efficiency_Factor', 'Cores per Processor', 'No_of_Processors',
       'runtime_hours', 'E_IT_Total_kWh', 'E_Cooling_total_kWh',
       'UPS_and_battery_inefficiency', 'UPS_and_battery_inefficiency_kWh',
       'E_Total_Facility_kWh']

target = 'PUE'

# Scale features
_scaler = StandardScaler()
df[features] = _scaler.fit_transform(df[features])

X = df[features]
y = df[target]

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train_tensor = torch.tensor(X_train.values, dtype=torch.float32)
y_train_tensor = torch.tensor(y_train.values, dtype=torch.float32)
X_test_tensor = torch.tensor(X_test.values, dtype=torch.float32)
y_test_tensor = torch.tensor(y_test.values, dtype=torch.float32)

# Train BNN
bnn = CausalBNN()
guide = pyro.infer.autoguide.AutoDiagonalNormal(bnn)
optimizer = Adam({"lr": 0.01})
svi = SVI(bnn, guide, optimizer, loss=Trace_ELBO())

pyro.clear_param_store()
for step in range(2000):
    loss = svi.step(X_train_tensor, y_train_tensor)
    # if step % 200 == 0:
    #     print(f"Step {step}: Loss = {loss:.2f}")

_predictive = Predictive(bnn, guide=guide, num_samples=100)
##################################################################

def get_PUE_prediction(
    system_name: str,
    processor: str,
    accelerator: str,
    num_nodes: int,
    num_accelerator: int,
    model_mlc: str,
    cooling_efficiency: float,
    date: date,
    location: str,
):
    """
    Returns:
      environment_data (dict),
      energy_data      (dict),
      pue_prediction   (float)
    """
    # 1) Fetch environment & energy data
    environment_data = get_env_data(date_input=date, location=location)
    energy_data = calculate_energy_values(
        system_name,
        processor,
        accelerator,
        num_nodes,
        num_accelerator,
        model_mlc,
        cooling_efficiency,
        environment_data["Environmental_Impact_Factor"],
    )

    # 2) Build raw feature vector matching the 19 trained features
    raw = np.array([
        num_nodes,                                     # # of Nodes
        num_accelerator,                               # # of Accelerators
        energy_data["host_proc_core_count"],          # Host Processor Core Count
        energy_data["average_result_at_system_name"], # Avg. Result at System Name
        environment_data["Temperature_C"],            # Temperature_C
        environment_data["Humidity_%"],               # Humidity_%
        environment_data["Solar_Radiation_Wm2"],      # Solar_Radiation_Wm2
        environment_data["Wind_Speed_mps"],           # Wind_Speed_mps
        energy_data["tdp_acc"],                       # TDP_acc
        energy_data["tdp_proc"],                      # TDP_proc
        cooling_efficiency,                             # Cooling_Efficiency_Factor
        energy_data["cores_per_processor"],           # Cores per Processor
        energy_data["no_of_processors"],              # No_of_Processors
        energy_data["runtime_hours"],                 # runtime_hours
        energy_data["E_IT_Total_kWh"],                # E_IT_Total_kWh
        energy_data["E_Cooling_total_kWh"],           # E_Cooling_total_kWh
        energy_data["UPS_and_battery_inefficiency"],  # UPS_and_battery_inefficiency
        energy_data["UPS_and_battery_inefficiency_kWh"], # UPS_and_battery_inefficiency_kWh
        energy_data["E_Total_Facility_kWh"],          # E_Total_Facility_kWh
    ]).reshape(1, -1)
    # 3) Scale & convert to tensor
    # X = _scaler.fit_transform(raw)
    print('RAW SAMPLE: ',raw)
    X = _scaler.transform(raw)
    print('X: ', X)
    X_tensor = torch.tensor(X, dtype=torch.float32)
    print('x_tensor: ', X_tensor)

    # 4) Forward pass through TorchScripted BNN
    # with torch.no_grad():
    #     mean_pue = _traced_bnn(X_tensor).item()
        # mean_pue = _bnn(X_tensor).item()

    samples = _predictive(X_tensor)
    print(samples)
    # y_samples = samples["obs"].detach().numpy()
    mean_pue = samples["obs"].mean(0).item()
    
    
    #####################################
    # # 3) Monte Carlo over the posterior
    # num_samples = 1
    # #    draw num_samples independent weight/bias samples
    # w1_samps = dist_w1.sample((num_samples,))  # (S,10,19)
    # b1_samps = dist_b1.sample((num_samples,))  # (S,10)
    # w2_samps = dist_w2.sample((num_samples,))  # (S,1,10)
    # b2_samps = dist_b2.sample((num_samples,))  # (S,1)

    # # 4) Forward pass for each sample
    # #    hidden = ReLU(w1·x + b1)
    # #    out    = (w2 · hidden) + b2
    # hidden_pre = torch.einsum("sij,j->si", w1_samps, x) + b1_samps    # (S,10)
    # hidden_act = torch.relu(hidden_pre)                              # (S,10)
    # # flatten w2 to (S,10)
    # w2_flat    = w2_samps.view(num_samples, 10)                      # (S,10)
    # out_pre    = (w2_flat * hidden_act).sum(dim=1) + b2_samps.view(-1)  # (S,)

    # # 5) Average the S forward‐passes → your posterior‐mean PUE
    # mean_pue = float(out_pre.mean().item())
    #####################################

    print('mean PUE: ',mean_pue)
    return environment_data, energy_data, mean_pue


if __name__ == "__main__":
    # Example usage keeping original signature
    system_name      = "SuperComputerX"
    processor        = "Intel Xeon"
    accelerator      = "NVIDIA Tesla A100"
    num_nodes        = 100
    num_accelerator  = 10
    model_mlc        = "MLC_Model_v1"
    cooling_eff      = 0.85
    current_date     = date(2025, 3, 11)
    location         = "germany"

    env_data, ener_data, predicted_pue = get_PUE_prediction(
        system_name=system_name,
        processor=processor,
        accelerator=accelerator,
        num_nodes=num_nodes,
        num_accelerator=num_accelerator,
        model_mlc=model_mlc,
        cooling_efficiency=cooling_eff,
        date=current_date,
        location=location,
    )

    print(f"The predicted PUE for the system is: {predicted_pue:.4f}")