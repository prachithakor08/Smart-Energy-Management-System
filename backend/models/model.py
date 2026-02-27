import torch
import joblib
import numpy as np
import pandas as pd
import torch.nn as nn

class GRUAE(nn.Module):
    def __init__(self, n_features, hidden=192, latent=32, layers=2, dropout=0.1):
        super().__init__()
        self.encoder = nn.GRU(
            n_features,
            hidden,
            layers,
            batch_first=True,
            dropout=dropout,
        )
        self.enc_fc = nn.Linear(hidden, latent)

        self.dec_fc = nn.Linear(latent, hidden)
        self.decoder = nn.GRU(
            hidden,
            hidden,
            layers,
            batch_first=True,
            dropout=dropout,
        )
        self.out = nn.Linear(hidden, n_features)
        self.act = nn.ReLU()
        self.layers = layers

    def forward(self, x):
        _, h = self.encoder(x)
        latent = self.act(self.enc_fc(h[-1]))
        dec_init = self.act(self.dec_fc(latent)).unsqueeze(0).repeat(self.layers, 1, 1)
        dec_input = dec_init[-1].unsqueeze(1).repeat(1, x.size(1), 1)
               
        dec_out, _ = self.decoder(dec_input, dec_init)
        return self.out(dec_out), latent

DEVICE = "cpu"

# Load metadata
meta = joblib.load("models/gruae_metadata_v2.pkl")

scaler = meta["scaler"]
RECON_THRESHOLD = meta["recon_threshold"]
CRITICAL_THRESHOLD = meta.get("critical_threshold",RECON_THRESHOLD* 1.25)
WINDOW = meta["window"]
FEATURE_COLS = meta["feature_cols"]

# Load model
model = GRUAE(n_features=len(FEATURE_COLS))
model.load_state_dict(torch.load("models/gruae_model_v2.pt", map_location=DEVICE))
model.eval()

def predict_alert(df: pd.DataFrame):
    data = scaler.transform(df[FEATURE_COLS].values)

    if len(data) < WINDOW:
        return False, 0.0

    windows = np.stack([data[i : i + WINDOW] for i in range(len(data) - WINDOW + 1)])
    windows = torch.tensor(windows, dtype=torch.float32)

    with torch.no_grad():
        recon, _ = model(windows)
        errors = torch.mean((recon - windows) ** 2, dim=(1, 2))

    max_error = errors.max().item()
    is_alert = max_error > RECON_THRESHOLD

    return is_alert, max_error

def classify_alert_severity(recon_error: float) -> str:
    if recon_error <= RECON_THRESHOLD:
        return "NORMAL"
    if recon_error >= CRITICAL_THRESHOLD:
        return "CRITICAL"
    return "WARNING"