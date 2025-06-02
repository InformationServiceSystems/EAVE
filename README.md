# EAVE ― Energy Analytics for Cost-effective and Sustainable Operations

![EAVE](escade.jpg)

## Introduction

Deploying AI models at scale often leads to high energy consumption and increased carbon emissions. As model accuracy improves, the environmental and financial costs can rise just as quickly.

Most current efforts to reduce these costs are fragmented—some focus on compressing models, others on rescheduling jobs, or relocating workloads to regions with better cooling or lower carbon intensity. However, these isolated solutions miss the opportunity for more integrated, system-level optimization.

**EAVE** (Energy Analytics for Cost-effective and Sustainable Operations) is an **open-source, multi-layer optimization framework** that brings these pieces together into one unified tool.

EAVE includes:

* **Task-level profiling** to find where time and energy are being used most.  
* **Model-level optimization** using techniques such as knowledge distillation, quantization, and offline neural architecture search (NAS).  
* **Hardware configuration matching** to choose the most energy-efficient setup.  
* **Spatiotemporal deployment analysis** to decide the best time and place to run workloads, using causal inference and regional PUE data.

By combining energy modeling based on Power Usage Effectiveness (PUE), Bayesian performance prediction, and custom Pareto optimization, EAVE produces recommendations that are **cost-efficient, performance-aware, and carbon-conscious**.

Evaluations on MLPerf workloads show that EAVE helps both data center operators and AI practitioners discover deployment strategies that are **cheaper, more sustainable, and maintain model accuracy**.
**cheaper and greener—without sacrificing accuracy**.

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
