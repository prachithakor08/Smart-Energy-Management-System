# ⚡ AI-Powered Smart Energy Management System (Smart EMS)

An intelligent, AI-driven platform for monitoring electrical substations, detecting technical power losses caused by poor power factor, and generating real-time alerts using deep learning models trained on SCADA data.

---

## 📌 Project Purpose

The purpose of this project is to design and develop an **AI-powered Smart Energy Management System** that continuously monitors electrical substation data and detects **technical power losses**. The system focuses on **real-time loss detection and alert generation**, enabling grid operators to take timely corrective actions.

By integrating **Artificial Intelligence with SCADA data**, the project aims to transform conventional substations into **intelligent, self-monitoring systems** capable of identifying efficiency degradation without relying on manual inspection or static threshold-based analysis.

---

## 🧠 Hypothesis

We hypothesize that an AI-powered smart energy management system utilizing SCADA data and a **hybrid GRU–Autoencoder deep learning model** can effectively detect technical power losses arising from **poor power factor and inefficient energy utilization** in electrical substations.

By learning temporal patterns in parameters such as:
- Voltage  
- Current  
- Power Factor  
- Transformer Temperature  

the system can identify deviations that indicate increased losses. This approach improves operational awareness, reduces dependency on manual monitoring, and enhances the efficiency and reliability of substations compared to conventional methods.

---

## 📄 Project Abstract

This project presents the development of an **AI-Powered Smart Energy Management System** for electrical substations using SCADA data and advanced deep learning techniques.

A **hybrid GRU–Autoencoder model** is employed to learn temporal patterns in electrical parameters such as voltage, current, power factor, and transformer temperature. Since each substation operates differently, the model is **trained separately for each substation** using its historical SCADA data. This **substation-specific training approach** enables accurate learning of normal operating behavior and precise detection of efficiency losses unique to each installation.

The system performs **real-time loss detection** and generates alerts when increased losses due to poor power factor are detected. An **interactive web dashboard** visualizes system status, alerts, and alert history, supporting informed operational decision-making.

The project aims to reduce technical losses, improve energy efficiency, and support smarter and more reliable power distribution systems.

---

## 🎯 Aims & Objectives

- Design and develop an AI-based system for monitoring electrical substations using SCADA data  
- Preprocess and analyze parameters such as voltage, current, power factor, and transformer temperature  
- Implement a hybrid **GRU–Autoencoder** model for anomaly and loss detection  
- Detect technical power losses caused by poor power factor  
- Generate real-time alerts when losses are detected  
- Maintain alert history for analysis and reporting  
- Provide a visual dashboard for monitoring system status and alerts  
- Evaluate system performance using metrics such as accuracy, MAE, and RMSE  

---

## 🖥️ Features (As Shown in Dashboard)

### 🔐 Admin Authentication
- Secure admin login
- Logout functionality for session management

### 📊 Dashboard Overview
- **Total Substations Count**
- **Total Active Alerts**
- **Critical Alerts Count**
- **Warning Alerts Count**

### 🧩 Grid Topology Visualization
- Visual representation of substation connectivity
- Color-coded nodes:
  - 🟢 Normal Operation
  - 🔴 Critical Loss Detected
- Helps operators quickly identify affected substations

### 🚨 Alert Management
- Real-time alert generation when power loss is detected
- Classification of alerts into:
  - Critical
  - Warning

### 🕒 Alert History
- Historical record of all detected alerts
- Supports trend analysis and operational review

### 📁 CSV Upload
- Upload SCADA data in CSV format
- Enables model inference and monitoring using real datasets

### 📈 Live Substation Status
- Displays current operational state of each substation
- Real-time visualization of health and loss conditions

---

## 🏗️ System Architecture & Technology Stack

### Frontend
- React (Vite)
- Chart libraries for visualization
- Responsive admin dashboard UI

### Backend
- Python
- Flask for API services

### Machine Learning
- Hybrid **GRU–Autoencoder**
- TensorFlow / Keras
- Substation-wise model training

### Data Processing
- Pandas
- NumPy
- SCADA data in CSV format

---

## 🔬 Methodology Overview

### Phase 1: System Design & Model Development
- Requirement analysis and architecture design
- Model development using historical SCADA data
- Frontend dashboard development
- Backend and ML integration

### Phase 2: Testing, Evaluation & Optimization
- Unit and system testing
- Performance evaluation using accuracy, MAE, RMSE
- Model tuning and dashboard refinement
- Documentation and deployment readiness

---

## 🚀 Scope for Future Enhancements

- Predictive loss forecasting
- Trend analysis and early warning system
- Advanced deep learning architectures
- Integration with real-time SCADA systems
- Scalability for large smart grid deployments

---

## 🧑‍💻 How to Run (Basic)

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
python app.py
