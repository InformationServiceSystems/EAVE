# EAVE ― Energy Analytics for Cost-effective and Sustainable Operations

![EAVE](escade.jpg)

## Introduction

Deploying AI models at scale brings real-world costs—especially in terms of energy use and environmental impact. While there are many efforts to make machine learning more efficient, most of them focus on just one layer of the stack: optimizing a model, tweaking the hardware, or shifting workloads to different locations. These isolated fixes often miss the bigger picture.

**EAVE** (Energy Analytics for Cost-effective and Sustainable Operations) is an open-source framework designed to bring those pieces together. It supports multi-layer optimization across tasks, models, hardware configurations, and deployment strategies. EAVE helps practitioners explore trade-offs between cost, performance, and carbon impact—and make informed decisions at each step.

The framework combines task profiling, model compression techniques (like distillation and quantization), hardware-aware planning, and spatial-temporal deployment analysis. It uses a mix of causal inference, Bayesian modeling, and PUE-based energy analytics to recommend more sustainable and cost-effective AI deployment strategies.

Evaluated on MLPerf workloads, EAVE provides actionable insights for both machine learning engineers and data center operators—without sacrificing model accuracy.

## Results

EAVE was evaluated for its predictive accuracy, causal reasoning capabilities, and multi-objective optimization performance.

### Predictive Performance

Using a Bayesian Neural Network (BNN), EAVE predicts energy metrics with high reliability. On a held-out test set, BNN outperforms classical baselines in MAE, MSE, RMSE, and R². Posterior predictive checks (below) further validate the model’s adequacy, showing strong alignment between simulated and observed distributions.

![Posterior Predictive Check](figures/posterior_predictive_check.png)

### Causal Inference

EAVE estimates Average Treatment Effects (ATE) with Bayesian uncertainty over key energy drivers. Results show that IT energy, cooling energy, and PUE are more sensitive to infrastructure and facility-level attributes (e.g., total energy, weather, cooling systems) than to model or hardware configurations. Placebo tests confirm the robustness of these inferences.

![ATE Estimates](figures/ate_estimates.png)

### Optimization Trade-offs

By leveraging multi-objective optimization, EAVE identifies Pareto-optimal configurations balancing performance, cost, and carbon footprint. For instance, compressing the LLaMA 3.3 70B model to 8B via distillation reduced energy and CO₂ by 37.23% with only a 14.34% drop in accuracy.

![Pareto Front](figures/pareto_front.png)


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
