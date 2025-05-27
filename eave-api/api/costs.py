import pandas as pd
from datetime import date
import pickle
import numpy as np
import os
import joblib
from .mappings import selected_countries

# Function to predict future prices
def predict_energy_price(date, country: str):
    year = date.year
    month = date.month
    day = date.day
    
    if country=="Usa":  # capitalize the USA because the predict_energy_price function takes country as Country
        # Build the absolute path to the pickle file
        model_dir = os.path.dirname(__file__) 
        pickle_file_path = os.path.join(model_dir, "us_energy_price_model.pkl")

        model = joblib.load(pickle_file_path)
        input_data = np.array([[year, month]])
        return model.predict(input_data)[0]*10*0.93 # prediction is in cents; convert it to Eur (1 dollar -> 0.93 euro; 26-03-2025)

    else:
        # Build the absolute path to the pickle file
        model_dir = os.path.dirname(__file__) 
        pickle_file_path = os.path.join(model_dir, "daily_energy_price_model.pkl")

        # load the model
        with open(pickle_file_path, "rb") as f:
            model, encoder = pickle.load(f)

        country_encoded = encoder.transform([country])[0]
        
        input_data = np.array([[year, month, day, country_encoded]])
        predicted_price = model.predict(input_data)[0]
        
        return predicted_price

def predict_carbon_intensity(date, country):
    """Predicts carbon intensity given a date and country."""
    # Build the absolute path to the pickle file
    model_dir = os.path.dirname(__file__) 
    pickle_file_path = os.path.join(model_dir, "carbon_intensity_rf.pkl")

    with open(pickle_file_path, "rb") as f:
        model, encoder = pickle.load(f)
    
    # Convert date to features
    date = pd.to_datetime(date)
    features = pd.DataFrame({
        "Year": [date.year],
        "Month": [date.month],
        "Day": [date.day]
    })
    
    # Encode country
    encoded_country = encoder.transform([[country]])
    encoded_country_df = pd.DataFrame(encoded_country, columns=encoder.get_feature_names_out(["Country"]))
    
    # Combine all features
    final_features = pd.concat([features, encoded_country_df], axis=1)
    
    # Make prediction
    prediction = model.predict(final_features)
    return prediction[0]

# Calculate Cost
def calculate_cost(energy_consumption: float, target_date: date, location: str) -> float:
    target_date = pd.to_datetime(target_date)
    df = pd.read_csv('data/energy_price_daily.csv')
    df['Datum von'] = pd.to_datetime(df['Datum von'], format='%Y-%m-%d')
    if location.lower()=="usa":  # capitalize the USA because the predict_energy_price function takes country as Country
        # Build the absolute path to the pickle file
        model_dir = os.path.dirname(__file__) 
        pickle_file_path = os.path.join(model_dir, "us_energy_price_model.pkl")
        model = joblib.load(pickle_file_path)
        input_data = np.array([[target_date.year, target_date.month]])
        price_per_kwh = model.predict(input_data)[0]*10*0.93 # prediction is in cents; convert it to Eur (1 dollar -> 0.93 euro; 26-03-2025)
    else:
        row = df[df['Datum von']==target_date]
        if not row.empty:
            row_dict = row.iloc[0].to_dict()
            price_per_kwh = row_dict[selected_countries[location.lower()]]
        else:
            price_per_kwh = predict_energy_price(date=target_date, country=location.capitalize())
    return energy_consumption * price_per_kwh / 1000

# Calculate CO2 Equivalents (example formula, replace with real one)
def calculate_co2_equivalents(energy_consumption: float, target_date: date, location: str) -> float:
    target_date = pd.to_datetime(target_date)
    # load data and query
    # Load the dataset
    file_path = "data/merged_carbon_intensity.csv"
    df = pd.read_csv(file_path)
    # Keep only relevant columns
    df = df[["Datetime (UTC)", "Country", "Carbon Intensity gCO₂eq/kWh (direct)"]]

    # df = pd.read_csv('data/carbon_intensity_germany.csv')
    df['Datetime (UTC)'] = pd.to_datetime(df['Datetime (UTC)'])

    row = df[(df['Datetime (UTC)']==target_date) & (df['Country']==location)]
    if not row.empty:
        row_dict = row.iloc[0].to_dict()
        carbon_index = row_dict['Carbon Intensity gCO₂eq/kWh (direct)']
    else:
        carbon_index = predict_carbon_intensity(date=target_date, country=location)
    return carbon_index, energy_consumption * carbon_index
