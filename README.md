# EAVE ― Energy Analytics for Cost-effective and Sustainable Operations

## Introduction

Large-scale AI deployments come with a hidden price tag: **energy bills and carbon emissions can rise as fast as model accuracy**.  
Most “green-AI” efforts address the problem piecemeal—some prune models, others juggle GPU schedules, or shift workloads to cooler locations.  
**EAVE** (Energy Analytics for cost-effective and sustainable operations) unifies those fragments in one tool.

EAVE is an **open-source, multi-layer optimisation framework** that:

* **Profiles tasks** to pinpoint where compute time and energy are spent.  
* Performs **model-level compression** (knowledge distillation, quantisation, offline NAS).  
* Matches workloads with optimal **hardware configurations**.  
* Chooses the best **time & place** to run them, guided by causal-inference insights and regional PUE data.

By combining PUE-based energy modelling, BayesianNN prediction, and a custom Pareto optimiser, EAVE makes every recommendation **cost-aware, performance-aware, and carbon-aware**.  
Evaluations on MLPerf workloads show that EAVE helps data-centre operators and ML engineers discover deployment strategies that are simultaneously **cheaper and greener—without sacrificing accuracy**.

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
```
EAVE-dashboard/
├── eave-api/                  # FastAPI back-end
│   ├── app/
│   │   ├── main.py            # entry point for SPA
│   │   │   ├── measure/           # energy + causal analysis
│   │   │   ├── predict/           # CausalBNN inference
│   │   │   └── optimize/          # compression + Pareto
│   ├── data/                  # benchmark input
│   └── requirements.txt       # back-end dependencies
└── eave-ui/                   # React front-end
```
