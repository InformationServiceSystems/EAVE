'''
tdp_mapping:
    mapping of accelerator models to their TDP values in watts

    accelerator name -> tdp
'''
tdp_mapping = {
    "AMD Instinct MI300X-NPS1-SPX-192GB-750W": 750,
    "NVIDIA H100-NVL-94GB": 400,
    "NVIDIA H100-PCIe-80GB": 375,  # Averaging 350-400W
    "NVIDIA H100-SXM-80GB": 700,
    "NVIDIA L40S": 350,
    "NVIDIA H200-SXM-141GB": 700,
    "AMD MI300X-NPS1-SPX-192GB-750W": 750,
    "TPU v5e": 170,
    "NVIDIA GH200 Grace Hopper Superchip 144GB": 500,
    "NVIDIA H200-SXM-141GB-CTS": 700,
    "NVIDIA GH200 Grace Hopper Superchip 96GB": 500,
    "UntetherAI speedAI240 Slim": 75,
    "TPU v6": 170,
    "NVIDIA B200-SXM-180GB": 1100,  # Averaging 1200W liquid cooling and 1000W air cooling
    "UntetherAI speedAI240 Preview": 75,
    "CPU-only": 1,
    "V100-16GB" : 300,
}

'''
proc_tdp_mapp:
    mapping of processor models to their TDP values in watts

    processor name -> tdp
'''
proc_tdp_mapp = {
'INTEL(R) XEON(R) PLATINUM 8592+' : 350,
    'Intel(R) Xeon(R) Platinum 8592+':350,
 'INTEL(R) XEON(R) 6980P': 500,
    '2xAMD EPYC 9374F' :640,
    'AMD EPYC 9654 96-Core Processor': 360,
 'AMD EPYC 9374F 32-Core Processor' : 320 ,
'INTEL(R) XEON(R) PLATINUM 8592+': 350 ,
 'Intel Xeon Gold 6448H' : 250 ,
'AMD EPYC 9684X 96-Core Processor': 400,
 'INTEL(R) XEON(R) PLATINUM 8562Y+' : 300,
'INTEL(R) XEON(R) PLATINUM 8580': 350,
 'Intel(R) Xeon(R) Platinum 8480+': 350,
 'Intel(R) Xeon(R) Gold 6338 CPU @ 2.00GHz': 205,
 'Intel(R) Xeon(R) Platinum 8468' : 350,
'Intel(R) Xeon(R) Platinum 8470': 350,
 'Intel(R) Xeon(R) Platinum 8460Y+' : 300,
'Intel(R) Xeon(R) Gold 6454S': 270,
 'Intel(R) Xeon(R) Platinum 8481C' : 350,
'AMD EPYC 7B13': 240,
 'INTEL(R) XEON(R) GOLD 6530': 270,
'Intel(R) Xeon(R) Platinum 8580': 350,
 'AMD EPYC 7763 64-Core Processor' : 280,
'AMD EPYC 9454': 290 ,
 'Intel(R) Xeon(R) Platinum 8568Y+' : 350,
'Intel(R) Xeon(R) Gold 6438N': 205,
 'AMD EPYC 9634 84-Core Processor': 290,
'Intel(R) Xeon(R) Platinum 8480C': 350,
 'NVIDIA Grace CPU' : 500,
'AMD EPYC 9254 24-Core Processor': 200,
 'Intel(R) Xeon(R) Platinum 8592+': 350,
'Intel(R) Xeon(R) Platinum 8458P': 350,
 'Intel(R) Xeon(R) Platinum 8480CL' : 350,
'AMD EPYC 9654':360,
'AMD EPYC 9474F':360,
 'Intel(R) Xeon(R) Platinum 8570' :350,
'Intel(R) Xeon(R) Platinum 8462Y+':300,
 'Intel(R) Xeon(R) Gold 6448Y':225,
'2xAMD EPYC TURIN': 1000,
'AMD EPYC 9B14':400,
 'INTEL(R) XEON(R) 6980P': 500,
'Intel(R) Xeon(R) Silver 4410Y':150,
 'AMD EPYC 9124 16-Core Processor': 200,
 'Intel(R) Xeon(R) CPU E5-2698 v4 @ 2.20GHz' : 135,
 'Intel(R) Core(TM) i7-1065G7': 15
}

'''
proc_cores_map:
    the number of cores in a single physical processor (CPU).

    processor name -> count
'''
proc_cores_map = {

    '2xAMD EPYC 9374F' :64,
    'AMD EPYC 9654 96-Core Processor': 96,
 'AMD EPYC 9374F 32-Core Processor' : 32 ,
'INTEL(R) XEON(R) PLATINUM 8592+': 64 ,
 'Intel Xeon Gold 6448H' : 32 ,
'AMD EPYC 9684X 96-Core Processor': 96,
 'INTEL(R) XEON(R) PLATINUM 8562Y+' : 32,
'INTEL(R) XEON(R) PLATINUM 8580': 60,
 'Intel(R) Xeon(R) Platinum 8480+': 56,
 'Intel(R) Xeon(R) Gold 6338 CPU @ 2.00GHz': 32,
 'Intel(R) Xeon(R) Platinum 8468' : 48,
'Intel(R) Xeon(R) Platinum 8470': 52,
 'Intel(R) Xeon(R) Platinum 8460Y+' : 40,
'Intel(R) Xeon(R) Gold 6454S': 32,
 'Intel(R) Xeon(R) Platinum 8481C' : 56,
'AMD EPYC 7B13': 64,
 'INTEL(R) XEON(R) GOLD 6530': 32,
'Intel(R) Xeon(R) Platinum 8580': 60,
 'AMD EPYC 7763 64-Core Processor' : 64,
'AMD EPYC 9454': 48 ,
 'Intel(R) Xeon(R) Platinum 8568Y+' : 48,
'Intel(R) Xeon(R) Gold 6438N': 32,
 'AMD EPYC 9634 84-Core Processor': 84,
'Intel(R) Xeon(R) Platinum 8480C': 56,
 'NVIDIA Grace CPU' : 72,
'AMD EPYC 9254 24-Core Processor': 24,
 'Intel(R) Xeon(R) Platinum 8592+': 64,
'Intel(R) Xeon(R) Platinum 8458P': 44,
 'Intel(R) Xeon(R) Platinum 8480CL' : 56,
'AMD EPYC 9654':96,
'AMD EPYC 9474F':48,
 'Intel(R) Xeon(R) Platinum 8570' :56,
'Intel(R) Xeon(R) Platinum 8462Y+':32,
 'Intel(R) Xeon(R) Gold 6448Y':32,
'2xAMD EPYC TURIN': 384,
'AMD EPYC 9B14':96,
 'INTEL(R) XEON(R) 6980P': 128,
'Intel(R) Xeon(R) Silver 4410Y':12,
 'AMD EPYC 9124 16-Core Processor': 16,
}

'''
host_proc_core_count_mapping:
    the total number of processor cores available on the entire host system (server, machine, or computing node).

    system name -> core_count
'''
host_proc_core_count_mapping = {'1-node-2S-EMR-PyTorch': 64,
 '1-node-2S-GNR-PyTorch': 128,
 '2x8xH100-SXM-80GB': 112,
 '4x8xH100-SXM-80GB': 112,
 'AS-4125GS-TNHR2-LCC (8x H100-SXM-80GB TensorRT)': 96,
 'AS-8125GS-TNHR (8x H100-SXM-80GB TensorRT)': 48,
 'ASUSTeK ESC4000A-E12 (4xH100-NVL-94GB)': 96,
 'C240M7-1-node-2S-EMR-PyTorch': 64,
 'Cisco UCS C240 M7 (2x L40S TensorRT)': 32,
 'Cisco UCS C245 M8 (2x H100-PCIe-80GB TensorRT)': 96,
 'Cisco UCS C245 M8 (2x L40S TensorRT)': 96,
 'Cisco UCS X210c M7 (2x L40S TensorRT)': 32,
 'Crusoe Cloud L40S (8x L40S PCIe vLLM FP8)': 4,
 'D54U_3U_H100_PCIe_80GBx4_TRT': 52,
 'D54U_3U_L40S_PCIe_48GBx4_TRT': 44,
 'Dell PowerEdge R760': 64,
 'Dell PowerEdge R760 (2xH100_PCIe_80GB TensorRT)': 120,
 'Dell PowerEdge R760xa (4x H100-PCIe-80GB TensorRT)': 64,
 'Dell PowerEdge R760xa (4x L40S TensorRT)': 64,
 'Dell PowerEdge R760xa (4xH100 NVL TensorRT)': 120,
 'Dell PowerEdge R760xa (6x speedAI240 Slim)': 32,
 'Dell PowerEdge XE8640 (4x H100-SXM-80GB TensorRT)': 96,
 'Dell PowerEdge XE9640 (4x H100-SXM-80GB TensorRT)': 96,
 'Dell PowerEdge XE9680 (8x H100-SXM-80GB TensorRT)': 48,
 'Dell PowerEdge XE9680 (8x H200-SXM-141GB TensorRT)': 52,
 'Dell PowerEdge XE9680 (8x MI300X_192GB vLLM)': 40,
 'ESC-N8-E11 (8x H100-SXM-80GB TensorRT)': 64,
 'ESC8000A-E12 (8x H100-PCIe-80GB TensorRT)': 32,
 'GH200-GraceHopper-Superchip_GH200-96GB_aarch64x1_TRT': 72,
 'GIGABYTE G593-SD1': 56,
 'GX2560M7_H100_SXM_80GBx4 (4x H100-SXM-80GB TensorRT)': 48,
 'HPE Cray XD670 (8x H100-SXM-80GB TensorRT)': 48,
 'HPE ProLiant Compute DL384 Gen12 (1x GH200-144GB_aarch64 TensorRT)': 72,
 'HPE ProLiant DL380 Gen11': 64,
 'HPE ProLiant DL380a Gen11 (4x H100-NVL-94GB TensorRT)': 32,
 'HPE ProLiant DL380a Gen11 (4x L40S-PCIe-48GB TensorRT)': 60,
 'L40S-RedHat-OpenShift': 112,
 'NVIDIA B200 (1x B200-SXM-180GB TensorRT)': 12,
 'NVIDIA DGX H100 (8x H100-SXM-80GB TensorRT)': 56,
 'NVIDIA GH200 NVL2 Platform (1x GH200-144GB_aarch64 TensorRT)': 72,
 'NVIDIA GH200-GraceHopper-Superchip (1x GH200-96GB_aarch64 TensorRT)': 72,
 'NVIDIA H200 (1x H200-SXM-141GB TensorRT)': 56,
 'NVIDIA H200 (1x H200-SXM-141GB-CTS TensorRT)': 56,
 'NVIDIA H200 (8x H200-SXM-141GB TensorRT Triton)': 56,
 'NVIDIA H200 (8x H200-SXM-141GB TensorRT)': 56,
 'NVIDIA H200 (8x H200-SXM-141GB-CTS TensorRT)': 56,
 'PRIMERGY CDI (16x L40S TensorRT)': 32,
 'PRIMERGY CDI (8x L40S TensorRT)': 32,
 'SMC H100 (8x H100-SXM-80GB TensorRT)': 32,
 'SYS-421GE-TNHR2-LCC (8x H100-SXM-80GB TensorRT)': 56,
 'SYS-821GE-TNHR (8x H100-SXM-80GB TensorRT)': 48,
 'Supermicro AS-8125GS-TNMR2': 32,
 'Supermicro SuperServer H13 (1x speedAI240 Preview)': 16,
 'Supermicro SuperServer H13 (2x speedAI240 Preview)': 16,
 'ThinkSystem SR650 V3 (3x NVIDIA L40S TensorRT)': 32,
 'ThinkSystem SR675 V3 (8x H100-NVL-94GB TensorRT)': 84,
 'ThinkSystem SR680a V3 (8x H200-SXM-141GB TensorRT)': 48,
 'ThinkSystem SR685a V3(8x H200-SXM-141GB TensorRT)': 48,
 'X210M7-1-node-2S-EMR-PyTorch': 64,
 'tpu-v5e-4': 112,
 'tpu-v6-4': 180}


# Selecting relevant columns
selected_countries = {
    "germany": "DE/AT/LU [€/MWh] Berechnete Auflösungen",
    "poland": "Polen [€/MWh] Berechnete Auflösungen",
    "netherlands": "Niederlande [€/MWh] Berechnete Auflösungen",
    "italy": "Italien (Nord) [€/MWh] Berechnete Auflösungen",
    "austria": "Österreich [€/MWh] Berechnete Auflösungen",
    "france": "Frankreich [€/MWh] Berechnete Auflösungen",
    "usa": "USA"
}

'''
average energy prices
'''

average_energy_prices = {
    'germany': [
        {"year": 2015, "price": 32.27},
        {"year": 2016, "price": 28.97},
        {"year": 2017, "price": 34.19},
        {"year": 2018, "price": 44.46},
        {"year": 2019, "price": 37.66},
        {"year": 2020, "price": 30.46},
        {"year": 2021, "price": 96.84},
        {"year": 2022, "price": 235.45},
        {"year": 2023, "price": 95.18},
        {"year": 2024, "price": 78.50},
        {"year": 2025, "price": 120.96},
    ],
    'france': [
        {"year": 2015, "price": 38.91},
        {"year": 2016, "price": 36.74},
        {"year": 2017, "price": 45.08},
        {"year": 2018, "price": 50.20},
        {"year": 2019, "price": 39.45},
        {"year": 2020, "price": 32.20},
        {"year": 2021, "price": 109.17},
        {"year": 2022, "price": 275.89},
        {"year": 2023, "price": 96.86},
        {"year": 2024, "price": 58.01},
        {"year": 2025, "price": 111.95},
    ],
    'netherlands': [
        {"year": 2015, "price": 40.46},
        {"year": 2016, "price": 32.24},
        {"year": 2017, "price": 39.31},
        {"year": 2018, "price": 52.53},
        {"year": 2019, "price": 41.20},
        {"year": 2020, "price": 32.24},
        {"year": 2021, "price": 102.96},
        {"year": 2022, "price": 241.93},
        {"year": 2023, "price": 95.82},
        {"year": 2024, "price": 77.28},
        {"year": 2025, "price": 121.00},
    ],
    'italy': [
        {"year": 2015, "price": 53.24},
        {"year": 2016, "price": 42.67},
        {"year": 2017, "price": 54.41},
        {"year": 2018, "price": 60.71},
        {"year": 2019, "price": 51.25},
        {"year": 2020, "price": 37.79},
        {"year": 2021, "price": 125.19},
        {"year": 2022, "price": 307.82},
        {"year": 2023, "price": 127.78},
        {"year": 2024, "price": 107.41},
        {"year": 2025, "price": 96.80},
    ],
    'poland': [
        {"year": 2015, "price": 91.01},
        {"year": 2016, "price": 73.38},
        {"year": 2017, "price": 90.00},
        {"year": 2018, "price": 95.19},
        {"year": 2019, "price": 89.68},
        {"year": 2020, "price": 46.65},
        {"year": 2021, "price": 87.03},
        {"year": 2022, "price": 166.72},
        {"year": 2023, "price": 111.65},
        {"year": 2024, "price": 96.25},
        {"year": 2025, "price": 123.44},
    ],
    'austria': [
        {"year": 2015, "price": 103.24},
        {"year": 2016, "price": 103.24},
        {"year": 2017, "price": 103.24},
        {"year": 2018, "price": 92.32},
        {"year": 2019, "price": 40.06},
        {"year": 2020, "price": 33.14},
        {"year": 2021, "price": 106.85},
        {"year": 2022, "price": 261.41},
        {"year": 2023, "price": 102.15},
        {"year": 2024, "price": 81.53},
        {"year": 2025, "price": 137.15},
    ],
    'usa': [
    {"year": 2015, "price": 10.27},
    {"year": 2016, "price": 10.48},
    {"year": 2017, "price": 10.53},
    {"year": 2018, "price": 10.54},
    {"year": 2019, "price": 10.59},
    {"year": 2020, "price": 11.1},
    {"year": 2021, "price": 12.36},
    {"year": 2022, "price": 12.68},
    {"year": 2023, "price": 12.99},
    {"year": 2024, "price": 13.10},
    {"year": 2025, "price": 13.29},
    ]
}

energy_mix = {
    "germany": {
        "oil": 4.9,
        "natural_gas": 13.8,
        "coal": 31.3,
        "renewable": 44,
        "nuclear": 6
    },
    "france": {
        "oil": 0.4,
        "natural_gas": 9.9,
        "coal": 0.7,
        "renewable": 26.3,
        "nuclear": 62.7
    },
    "netherlands": {
        "oil": 2.9,
        "natural_gas": 35.4,
        "coal": 8.5,
        "renewable": 50.4,
        "nuclear": 2.8
    },
    "italy": {
        "oil": 17.5,
        "natural_gas": 35.4,
        "coal": 3.2,
        "renewable": 43.9,
        "nuclear": 0
    },
    "poland": {
        "oil": 4.3,
        "natural_gas": 10.3,
        "coal": 56.4,
        "renewable": 29,
        "nuclear": 0
    },
    "austria": {
        "oil": 3.2,
        "natural_gas": 8.2,
        "coal": 3.2,
        "renewable": 85.4,
        "nuclear": 0
    },
    "usa": {
        "oil": 38,
        "natural_gas": 35,
        "coal": 9,
        "renewable": 9,
        "nuclear": 9
    }
}


