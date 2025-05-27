from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import os
import numpy as np
import pandas as pd
import random
from datetime import datetime, timedelta

from api import get_PUE_prediction, get_env_data
from api.energy import get_avg_result
from api.costs import calculate_cost, calculate_co2_equivalents
from api.mappings import average_energy_prices, selected_countries, energy_mix, host_proc_core_count_mapping, proc_cores_map

random.seed(42)
np.random.seed(42)

app = FastAPI()

# Define the CORS middleware to allow the frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React's origin (adjust this as needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define Pydantic model to receive input data
class PredictInput(BaseModel):
    system_name: str
    processor: str
    accelerator: str
    num_nodes: int
    num_accelerator: int
    model_mlc: str
    cooling_efficiency: float
    date: str
    location: str
    task: str


# 🚀 API Endpoint: Receive POST request and perform calculations
@app.post("/api/measure")
async def calculate_measure_metrics(input_data: PredictInput):
    target_date = datetime.strptime(input_data.date, "%Y-%m-%d").date()
    environment_data, energy_data, pue = get_PUE_prediction(   
                                input_data.system_name,
                                input_data.processor,
                                input_data.accelerator,
                                input_data.num_nodes,
                                input_data.num_accelerator,
                                input_data.model_mlc,
                                input_data.cooling_efficiency,
                                target_date,)
    
    # Perform the calculations
    energy_consumption = energy_data['E_Total_Facility_kWh']
    cost = calculate_cost(energy_consumption, target_date, input_data.location)
    co2_equivalents, co2_consumption = calculate_co2_equivalents(energy_consumption, target_date, input_data.location)

    app.state.cost = cost
    app.state.pue = pue
    app.state.energy = energy_consumption
    app.state.co2 = co2_consumption
    app.state.measureDate = target_date
    app.state.co2_equivalents = co2_equivalents
    # global_cost = cost

    # Return the results as a response
    return {
      "cost": round(cost,2),
      "predictedPrice": None,
      "totalEnergy": round(energy_consumption/1000,2),
      "predicttotalEnergy": None,
      "pue": round(pue,2),
      "predictpue": None,
      "co2Consumption": round((co2_consumption/1000), 2),
      "predictco2Consumption": None,
      "co2_equivalents": round(app.state.co2_equivalents,2),
      "predictco2_equivalents": None,
      "predictlocation" : None,
      "energyPrice": average_energy_prices[f'{input_data.location.lower()}'],
      "measureDate" : target_date,
      "predictDate" : None,
      "energyMix": energy_mix[input_data.location.lower()],
    }

@app.post("/api/predict")
async def calculate_predict_metrics(input_data: PredictInput):
    target_date = datetime.strptime(input_data.date, "%Y-%m-%d").date()
    best_metric = 1e10
    for _ in range(4):      # loop through all 4 seasons
    # if target_date == app.state.measureDate:
        target_date = target_date + timedelta(days=90)  # Approximate 3 months later
        environment_data, energy_data, predictpue = get_PUE_prediction(   
                                    input_data.system_name,
                                    input_data.processor,
                                    input_data.accelerator,
                                    input_data.num_nodes,
                                    input_data.num_accelerator,
                                    input_data.model_mlc,
                                    input_data.cooling_efficiency,
                                    target_date)

        for location in list(selected_countries.keys()):
            # Perform the calculations
            energy_consumption = energy_data['E_Total_Facility_kWh']
            cost = calculate_cost(energy_consumption, target_date, location)
            co2_equivalents, co2_consumption = calculate_co2_equivalents(energy_consumption, target_date, location)

            # calculate metric
            new_metric = cost
            # check if the new metric is best, save outputs
            if new_metric<best_metric:
                # re-assign best_metric
                best_metric = new_metric
                # save outputs
                best_cost = cost
                best_energy_consumption = energy_consumption
                best_predictpue = predictpue
                best_co2_consumption = co2_consumption
                best_location = location
                best_target_date = target_date
                best_co2_equivalents = co2_equivalents

    # Return the results as a response
    return {
        "cost": round(app.state.cost,2),
      "predictedPrice": round(best_cost,2),
      "totalEnergy": round(app.state.energy/1000,2),
      "predicttotalEnergy": round(best_energy_consumption/1000,2),
      "pue": round(app.state.pue,2),
      "predictpue": round(best_predictpue,2),
      "co2Consumption": round((app.state.co2/1000), 2),
      "predictco2Consumption": round((best_co2_consumption/1000), 2),
      "co2_equivalents": round(app.state.co2_equivalents,2),
      "predictco2_equivalents": round(best_co2_equivalents,2),
      "predictlocation" : best_location,
      "energyPrice": average_energy_prices[f'{best_location.lower()}'],
      "measureDate": app.state.measureDate,
      "predictDate" : best_target_date,
      "energyMix": energy_mix[input_data.location.lower()],
    }


class HardwareQuery(BaseModel):
    model_mlc: str

@app.post("/api/common/getHardware")
async def getHardware(input_data: HardwareQuery):
    # Load the CSV file
    file_dir = os.path.dirname(__file__)
    PUE_CSV_filepath = os.path.join(file_dir, 'api/PUE_data.csv')
    df = pd.read_csv(PUE_CSV_filepath) 

    # Filter based on the given model_mlc
    filtered_df = df[df["Model MLC"] == input_data.model_mlc]

    if filtered_df.empty:
        return {"processors": [], "accelerators": []}  # Return empty lists if no match found

    # Get unique values for processors and accelerators
    processors = filtered_df["Processor"].dropna().unique().tolist()
    accelerators = filtered_df["Accelerator"].dropna().unique().tolist()

    return {
        "processors": processors,
        "accelerators": accelerators
    }


class ProcessorQuery(BaseModel):
    model_mlc: str
    accelerator: str

@app.post("/api/common/getProcessors")
async def getProcessors(input_data: ProcessorQuery):
    # Load the CSV file
    file_dir = os.path.dirname(__file__)
    PUE_CSV_filepath = os.path.join(file_dir, 'api/PUE_data.csv')
    df = pd.read_csv(PUE_CSV_filepath) 
    
    # Filter based on model_mlc and accelerator
    filtered_df = df[
        (df["Model MLC"] == input_data.model_mlc) & 
        (df["Accelerator"] == input_data.accelerator)
    ]

    if filtered_df.empty:
        return {"processors": []}  # Return empty list if no match found

    # Get unique processors
    processors = filtered_df["Processor"].dropna().unique().tolist()

    return {"processors": processors}

class AcceleratorQuery(BaseModel):
    model_mlc: str
    processor: str

@app.post("/api/common/getAccelerators")
async def getAccelerators(input_data: AcceleratorQuery):
    # Load the CSV file
    file_dir = os.path.dirname(__file__)
    PUE_CSV_filepath = os.path.join(file_dir, 'api/PUE_data.csv')
    df = pd.read_csv(PUE_CSV_filepath) 
    
    # Filter based on model_mlc and accelerator
    filtered_df = df[
        (df["Model MLC"] == input_data.model_mlc) & 
        (df["Processor"] == input_data.processor)
    ]

    if filtered_df.empty:
        return {"accelerators": []}  # Return empty list if no match found

    # Get unique processors
    accelerators = filtered_df["Accelerator"].dropna().unique().tolist()

    return {"accelerators": accelerators}


class OptimizeBaselineQuery(BaseModel):
    system_name: str
    processor: str
    accelerator: str
    model_name: str
    compressionTech: str
    num_nodes: int
    num_accelerator: int
    date: str
    location: str
    cooling_efficiency: float

@app.post("/api/optimize/baseline")
async def getOptimizeInfo(input_data: OptimizeBaselineQuery):
    target_date = datetime.strptime(input_data.date, "%Y-%m-%d").date()
    # Load the CSV file
    file_dir = os.path.dirname(__file__)
    compression_filepath = os.path.join(file_dir, 'data/compression_technique_data.csv')
    df = pd.read_csv(compression_filepath) 
    # Filter based on model_name and compressionTech
    row = df[
        (df["model_name"] == input_data.model_name) & 
        (df["compressionTech"] == input_data.compressionTech)
    ]
    # Save each column into a variable
    tdp_proc = row['tdp_proc'].to_numpy()[0]
    no_of_processors = row['no_of_processors'].to_numpy()[0]
    tdp_acc = row['tdp_acc'].to_numpy()[0]
    num_accelerator = row['num_accelerator'].to_numpy()[0]
    num_nodes = row['num_nodes'].to_numpy()[0]
    algorithm_performance = row['performance'].to_numpy()[0]
    num_parameters = row['params'].to_numpy()[0]
    cores_per_processor = proc_cores_map.get(input_data.processor, 62.56)  # Get cores per processor value
    host_proc_core_count = host_proc_core_count_mapping.get(input_data.system_name, 63.21)  # Get host processor core count
    throughput = row['throughput'].to_numpy()[0]

    no_of_processors = host_proc_core_count / cores_per_processor
    # if ((num_nodes==input_data.num_nodes) and (num_accelerator==input_data.num_accelerator)):
    # else:
    #     num_nodes=input_data.num_nodes
    #     num_accelerator=input_data.num_accelerator
    #     throughput = 66869.50   # use average value if the data is not in excel

    '''
    use the following formula to calculate Total Energy
    '''
    total_tokens = 5e9 * 30 * 3     # avg. tokens per day (1e9) * days in a month * num. of months
    runtime_hours = total_tokens / (throughput * 3600)    # runtime_hours = number of samples / throughput(per sec) * secs in hour
    E_IT_per_node_kWh = (
        (tdp_proc * no_of_processors) + 
        (tdp_acc * num_accelerator)
    ) * runtime_hours / 1000  # Convert Wh to kWh

    # Scale by the number of nodes
    E_IT_Total_kWh = E_IT_per_node_kWh * num_nodes

    # Adjusted cooling efficiency
    adjusted_cooling_efficiency = input_data.cooling_efficiency * get_env_data(target_date)["Environmental_Impact_Factor"]

    # Calculate cooling energy per node
    E_Cooling_per_node_kWh = E_IT_Total_kWh * adjusted_cooling_efficiency

    # Generate random percentages for UPS and battery inefficiency
    UPS_and_battery_inefficiency = np.random.uniform(0.85, 0.90)

    # Calculate UPS inefficiency (as a percentage of the total energy)
    UPS_and_battery_inefficiency_kWh = E_IT_Total_kWh * (1 - UPS_and_battery_inefficiency)

    # Calculate total energy consumption for the facility (in kWh)
    E_Total_Facility_kWh = E_IT_Total_kWh + E_Cooling_per_node_kWh + UPS_and_battery_inefficiency_kWh

    # calculate PUE
    pue = E_Total_Facility_kWh / E_IT_Total_kWh

    cost = calculate_cost(E_Total_Facility_kWh, target_date, input_data.location)
    co2_equivalents, co2_consumption = calculate_co2_equivalents(E_Total_Facility_kWh, target_date, input_data.location)

    return {
        "totalEnergy": round(E_Total_Facility_kWh/1000,2),
        "cost": round(cost,2),
        "co2Equivalent": round(co2_equivalents,2),
        "pue": round(pue,2),
        "performance": algorithm_performance,
        "params": int(num_parameters),
    }

class CompressionListQuery(BaseModel):
    model_name: str

@app.post("/api/optimize/getCompressionList")
async def getCompressionList(input_data: CompressionListQuery):
    # Load the CSV file
    file_dir = os.path.dirname(__file__)
    compression_filepath = os.path.join(file_dir, 'data/compression_technique_data.csv')
    df = pd.read_csv(compression_filepath) 
    compressionDF = df.groupby('model_name')['compressionTech'].apply(list).reset_index()
    compressionList = compressionDF.loc[compressionDF['model_name'] == input_data.model_name,'compressionTech'].values[0]
    # Remove 'original' from the list
    filtered_compressionList = [tech for tech in compressionList if tech.lower() != 'original']
    return {"compressionList": filtered_compressionList}

@app.post("/api/optimize/getBaselineList")
async def getBaselineList():
    # Load the CSV file
    file_dir = os.path.dirname(__file__)
    compression_filepath = os.path.join(file_dir, 'data/compression_technique_data.csv')
    df = pd.read_csv(compression_filepath) 
    baselineList = pd.unique(df['model_name'])
    return {"baselineList": baselineList.tolist()}