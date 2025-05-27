# EAVE ― Energy Analytics for Cost-effective and Sustainable Operations

## Introduction
**EAVE** is an multi-layer optimisation framework that helps decision makers and AI practitioners analyse and reduce the **energy, cost, and carbon footprint** of machine-learning workloads.  
The tool unifies three modules:

* **Measure** – energy, costs, and CO2-emmisions accounting,
* **Predict** – CausalBNN–based spatio-temporal deployment recommendations, and  
* **Optimize** – model-level compression (knowledge-distillation, post-training quantisation, offline NAS) with Pareto frontier visualisation.

Under the hood, EAVE uses

* a **FastAPI** back-end (Python 3.9),  
* a **React** single-page front-end, and   

The reference dataset is derived from **MLPerf Inference** runs and enriched with location-specific energy-mix and environmental data. The complete system is described in our demo paper “AI Without Excess: Multi-Layer Optimisation for Cost-effective and Sustainable Operations” \[ref\].

---

# Installation Guide

## Backend Setup (FastAPI)

### Prerequisites

* Install [Conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/)
* Install Python 3.9+

### Installation Steps

1.  **Navigate to the backend directory**
    ```bash
    cd escade-project/EAVE-dashboard/eave-api
    ```

2.  **Create and activate a Conda environment**
    ```bash
    conda create --name eave-backend python=3.9 -y
    conda activate eave-backend
    ```

3.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the FastAPI server**
    ```bash
    uvicorn main:app --reload
    ```

## Frontend Setup (React)

### Prerequisites

* Install [Node.js](https://nodejs.org/)
* Install npm (usually comes with Node.js)

### Installation Steps

1.  **Navigate to the frontend directory**
    ```bash
    cd escade-project/EAVE-dashboard/eave-ui
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

## Accessing the Application

Once both the backend and frontend servers are running:

Open your browser and go to: [http://localhost:5173](http://localhost:5173)

## Troubleshooting

* Ensure that both the frontend and backend are running simultaneously for full functionality.
* Use `conda deactivate` to exit the backend environment when done.
* If any packages are missing, install them by `pip install [missing-package]`


# Project Structure

EAVE-dashboard/
├── eave-api/          # FastAPI back-end
│   ├── app/
│   │   ├── measure/   # energy + causal analysis
│   │   ├── predict/   # Random-Forest inference
│   │   └── optimize/  # compression + Pareto
|   └── data/          # benchmark input
│   └── requirements.txt    # for backend API dependencies
└── eave-ui/           # React front-end

