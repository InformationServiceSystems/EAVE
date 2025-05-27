import os
from datetime import date
import numpy as np
import joblib

from .energy import calculate_energy_values
from .environment import get_env_data
from .casual_model import CausalBNN  # your BNN definition, used only for training

import torch

# ─── Module‐level setup ────────────────────────────────────────────────────────
_model_dir = os.path.dirname(__file__)

# Load pre‐fitted scaler and TorchScript model
_scaler = joblib.load(os.path.join(_model_dir, "scaler.pkl"))
_traced_bnn = torch.jit.load(os.path.join(_model_dir, "bnn_point_predictor.pt"))
_traced_bnn.eval()


def get_PUE_prediction(
    system_name: str,
    processor: str,
    accelerator: str,
    num_nodes: int,
    num_accelerator: int,
    model_mlc: str,
    cooling_efficiency: float,
    date: date,
):
    """
    Returns:
      environment_data (dict),
      energy_data      (dict),
      pue_prediction   (float)
    """
    # 1) Fetch environment & energy data
    environment_data = get_env_data(date_input=date)
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
    X = _scaler.transform(raw)
    X_tensor = torch.tensor(X, dtype=torch.float32)

    # 4) Forward pass through TorchScripted BNN
    with torch.no_grad():
        mean_pue = _traced_bnn(X_tensor).item()

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

    env_data, ener_data, predicted_pue = get_PUE_prediction(
        system_name=system_name,
        processor=processor,
        accelerator=accelerator,
        num_nodes=num_nodes,
        num_accelerator=num_accelerator,
        model_mlc=model_mlc,
        cooling_efficiency=cooling_eff,
        date=current_date,
    )

    print(f"The predicted PUE for the system is: {predicted_pue:.4f}")
