# ⚡ AI-Powered Smart Energy Management System (Smart EMS)

An intelligent, AI-driven platform for monitoring electrical substations, detecting technical power losses caused by poor power factor, and generating real-time alerts using deep learning models trained on SCADA (Supervisory Control and Data Acquisition) data.

---
## ⚡ Problem Motivation & Sustainability Impact

In real-world power distribution systems, consumers receive electricity from utility providers based on contracted energy units. For example, a large industrial consumer may receive **80 units of electrical energy** from the utility supply. However, during transmission and internal distribution across electrical substations and industrial infrastructure, **technical power losses** occur.

These losses are primarily caused by factors such as:
- Poor power factor
- Inefficient energy utilization
- Reactive power flow
- Substation-level inefficiencies

As a result, although 80 units of energy are supplied, a significant portion is **lost before being effectively utilized**. This leads to:
- **Wastage of electrical energy**
- **Higher electricity bills for energy that is not actually used**
- **Reduced utilization of supplied power**
- **Negative impact on sustainability and energy efficiency**
- **Increased operational costs for industries**

In large-scale industrial environments, such inefficiencies often remain unnoticed due to the absence of intelligent monitoring systems that can identify *when*, *where*, and *why* the losses occurred.

### Project Objective in This Context

The primary objective of this project is to **detect technical power losses at the electrical substation level**, with a strong focus on **power factor–dependent losses**. By continuously monitoring SCADA data and analyzing parameters such as voltage, current, power factor, and transformer temperature, the system identifies periods during which abnormal losses occur.

Once power loss is detected:
- Operators can identify the **exact time period** when losses occurred
- Analyze operational conditions responsible for the loss
- Take **preventive or corrective actions** such as power factor correction, load balancing, or equipment optimization
- Prevent recurrence of the same inefficient operating conditions

### Impact on Energy Efficiency & Sustainability

By detecting and analyzing power loss patterns, the system enables industries to:
- Utilize electricity closer to its **full potential**
- Reduce unnecessary energy wastage
- Lower electricity costs
- Improve sustainability and environmental responsibility
- Support smarter and more efficient power distribution systems

This AI-driven approach transforms substations from passive distribution units into **intelligent energy monitoring systems**, contributing to sustainable industrial energy management.

## 📌 Project Purpose

The purpose of this project is to design and develop an **AI-powered Smart Energy Management System** that continuously monitors electrical substation data and detects **technical power losses**. The system focuses on **real-time loss detection and alert generation**, enabling grid operators to take timely corrective actions.

By integrating **Artificial Intelligence with SCADA data**, the project aims to transform conventional substations into **intelligent, self-monitoring systems** capable of identifying efficiency degradation without relying on manual inspection or static threshold-based analysis.

---

## 🖥️ Features 

### 🔐 Admin Authentication
- Secure admin login
- Logout functionality for session management

### 📊 Dashboard Overview
- **Total Substations Count**
- **Total Active Alerts - Alerts which are to be resolved**
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
- Alerts which get resolved are moved to alert history
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

## 🧑‍💻 How to Run (Basic)

```bash
# Frontend
cd smart_ems_dashboard
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
python app.py

```
---
## 📸 Dashboard Screenshots

### Admin Dashboard Overview
Displays total substations, active alerts, and alert severity summary with visualization

![Dashboard Overview](screenshots/dashboard-overview.png)

---

### Grid Topology Visualization
Visual representation of substation connectivity with color-coded operational status.

- 🟢 Normal Operation  
- 🔴 Critical Power Loss Detected  

![Grid Topology](screenshots/grid-topology.png)

---

### Alerts 
Active alerts are logged here providing admin to manage it by acknowledgement or resolution

![Alert](screenshots/alert-history.png)

---
### Alert History
Historical log of detected alerts for analysis and decision support.

![Alert History](screenshots/alert-history.png)

---
### Csv Upload
Admins can check alerts using CSV file uploads.

![CSV Upload](screenshots/alert-history.png)
