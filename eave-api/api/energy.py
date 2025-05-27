import numpy as np
import pandas as pd
from datetime import date
from .mappings import tdp_mapping,proc_tdp_mapp,proc_cores_map,host_proc_core_count_mapping
import os

import random
random.seed(42)
np.random.seed(42)

def get_avg_result(system_name: str, processor: str, accelerator: str, num_nodes: int,num_accelerator: int, model_mlc: str,host_proc_core_count: int):
    # Get the directory of the current file (model.py)
    file_dir = os.path.dirname(__file__)
    PUE_CSV_filepath = os.path.join(file_dir, 'PUE_data.csv')
    df = pd.read_csv(PUE_CSV_filepath)  
    # Filter rows where column B equals value_b and column C equals value_c
    result = df[
        (df['System Name'] == system_name) & 
        (df['# of Nodes'] == num_nodes) & 
        (df['Processor'] == processor) & 
        (df['Accelerator'] == accelerator) & 
        (df['# of Accelerators'] == num_accelerator) & 
        (df['Host Processor Core Count'] == host_proc_core_count) &
        (df['Model MLC'] == model_mlc) 
        ]
    if not result.empty:
        print('Data Found!!!')
        avg_result = result['Avg. Result at System Name'].iloc[0]  # Taking the first matching row
        return avg_result
    else:
        print('Data NOT Found!!! Returning average')
        return 66869.50     # average value

# Function to calculate energy values
def calculate_energy_values(system_name: str, processor: str, accelerator: str, num_nodes: int, 
                            num_accelerator: int, model_mlc: str, cooling_efficiency_factor: float, environmental_impact_factor: float):
    # Constants
    total_tokens = 5e9 * 30 * 3     # avg. tokens per day (1e9) * days in a month * num. of months
    # total_tokens = 1e11 * 5  # Total tokens to be processed (example)

    # Get the processor TDP, cores per processor, and host processor core count from the mappings
    tdp_acc = tdp_mapping.get(accelerator, 457.25)  # Get accelerator TDP value
    tdp_proc = proc_tdp_mapp.get(processor, 342.69)  # Get processor TDP value
    cores_per_processor = proc_cores_map.get(processor, 62.56)  # Get cores per processor value
    host_proc_core_count = host_proc_core_count_mapping.get(system_name, 63.21)  # Get host processor core count

    average_result_at_system_name = get_avg_result(system_name, processor, accelerator, num_nodes, num_accelerator, model_mlc, host_proc_core_count)
    print(f'Model_mlc: {model_mlc}\tThroughput: {average_result_at_system_name}')
    # Compute runtime (in hours)
    runtime_hours = total_tokens / (average_result_at_system_name * 3600)  # Using model_mlc for tokens/sec

    # Compute number of processors per node
    no_of_processors = host_proc_core_count / cores_per_processor

    # Compute the energy consumption per node (in kWh)
    E_IT_per_node_kWh = (
        (tdp_proc * no_of_processors) + 
        (tdp_acc * num_accelerator)
    ) * runtime_hours / 1000  # Convert Wh to kWh

    # Scale by the number of nodes
    E_IT_Total_kWh = E_IT_per_node_kWh * num_nodes

    # Adjusted cooling efficiency
    adjusted_cooling_efficiency = cooling_efficiency_factor * environmental_impact_factor

    # Calculate cooling energy per node
    E_Cooling_per_node_kWh = E_IT_Total_kWh * adjusted_cooling_efficiency

    # Calculate cooling energy * number of nodes
    E_Cooling_total_kWh = E_Cooling_per_node_kWh * num_nodes

    # Generate random percentages for UPS and battery inefficiency
    UPS_and_battery_inefficiency = np.random.uniform(0.85, 0.90)

    # Calculate UPS inefficiency (as a percentage of the total energy)
    UPS_and_battery_inefficiency_kWh = E_IT_Total_kWh * (1 - UPS_and_battery_inefficiency)

    # Calculate total energy consumption for the facility (in kWh)
    E_Total_Facility_kWh = E_IT_Total_kWh + E_Cooling_per_node_kWh + UPS_and_battery_inefficiency_kWh

    # Return the calculated values as a dictionary
    return {
        "tdp_acc": tdp_acc,
        "tdp_proc": tdp_proc,
        "cores_per_processor": cores_per_processor,
        "host_proc_core_count": host_proc_core_count,
        "runtime_hours": runtime_hours,
        "average_result_at_system_name": average_result_at_system_name,
        "no_of_processors": no_of_processors,
        "E_IT_per_node_kWh": E_IT_per_node_kWh,
        "E_IT_Total_kWh": E_IT_Total_kWh,
        "adjusted_cooling_efficiency" : adjusted_cooling_efficiency,
        "E_Cooling_per_node_kWh": E_Cooling_per_node_kWh,
        "E_Cooling_total_kWh": E_Cooling_total_kWh,
        "UPS_and_battery_inefficiency": UPS_and_battery_inefficiency,
        "UPS_and_battery_inefficiency_kWh": UPS_and_battery_inefficiency_kWh,
        "E_Total_Facility_kWh": E_Total_Facility_kWh
    }

