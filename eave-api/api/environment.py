import numpy as np
import pandas as pd
import random

random.seed(42)
np.random.seed(42)

# ASHRAE recommended ranges
ASHRAE_TEMP_MIN = 18  # °C
ASHRAE_TEMP_MAX = 27  # °C
ASHRAE_HUMIDITY_MIN = 30  # %
ASHRAE_HUMIDITY_MAX = 70  # %

def get_env_data(date_input):
    """Generate environmental data for a given date or timestamp.
    
    If only a date is provided, defaults to 12:00 PM (midday).
    """
    
    # Convert input to pandas Timestamp
    timestamp = pd.to_datetime(date_input)

    # If no specific time is given, set it to 12:00 PM (midday)
    if timestamp.hour == 0 and timestamp.minute == 0 and timestamp.second == 0:
        timestamp = timestamp.replace(hour=12)

    # Extract month and hour for seasonal and daily variations
    month = timestamp.month
    hour = timestamp.hour
    
    # Define seasonal temperature baselines
    if month in [12, 1, 2]:  # Winter
        avg_temp = 2
    elif month in [3, 4, 5]:  # Spring
        avg_temp = 10
    elif month in [6, 7, 8]:  # Summer
        avg_temp = 20
    else:  # Fall (Sep-Nov)
        avg_temp = 10

    # Daily variation (sinusoidal fluctuation)
    daily_variation = 5 * np.sin(2 * np.pi * hour / 24)
    
    # Random noise for real-world variability
    random_noise = np.random.normal(0, 2)
    
    # Compute temperature
    temperature = avg_temp + daily_variation + random_noise
    
    # Humidity (%) inversely related to temperature
    humidity = 75 - 0.4 * (temperature - avg_temp) + np.random.normal(0, 5)
    
    # Solar radiation (zero at night, peaks at midday)
    solar_radiation = max(
        0,
        800 * np.sin((hour / 24) * np.pi) * (1 + 0.3 * np.cos(2 * np.pi * (month - 1) / 12))
    )
    
    # Wind speed (normally distributed, average 4 m/s)
    wind_speed = np.random.normal(4, 1.5)
    
    # === ASHRAE IMPACT CALCULATIONS ===
    
    # Temperature impact
    temp_impact = (
        (temperature - ASHRAE_TEMP_MAX) * 0.02 if temperature > ASHRAE_TEMP_MAX else
        (ASHRAE_TEMP_MIN - temperature) * 0.01 if temperature < ASHRAE_TEMP_MIN else 0
    )
    
    # Humidity impact
    humidity_impact = (
        (humidity - ASHRAE_HUMIDITY_MAX) * 0.01 if humidity > ASHRAE_HUMIDITY_MAX else
        (ASHRAE_HUMIDITY_MIN - humidity) * 0.01 if humidity < ASHRAE_HUMIDITY_MIN else 0
    )
    
    # Solar radiation impact (higher solar radiation increases cooling load)
    solar_impact = solar_radiation * 0.0010  # 0.1% increase per W/m²
    
    # Wind speed impact (higher wind speeds aid cooling, reducing impact)
    wind_impact = (3 - wind_speed) * 0.02 if wind_speed > 3 else 0  # 2% decrease per m/s above baseline
    
    # Total environmental impact factor
    environmental_impact_factor = 1 + temp_impact + humidity_impact + solar_impact + wind_impact

    # Return the calculated values
    return {
        "Timestamp": timestamp,
        "Temperature_C": temperature,
        "Humidity_%": humidity,
        "Solar_Radiation_Wm2": solar_radiation,
        "Wind_Speed_mps": wind_speed,
        "Temp_Impact": temp_impact,
        "Humidity_Impact": humidity_impact,
        "Solar_Impact": solar_impact,
        "Wind_Impact": wind_impact,
        "Environmental_Impact_Factor": environmental_impact_factor,
    }



if __name__=="__main__":
    # Example usage:
    print(get_env_data("2023-06-15"))  # Only date
    print(get_env_data("2023-06-15 08:00:00"))  # Date with time

