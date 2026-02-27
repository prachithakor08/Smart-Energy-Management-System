import json
import random
from pathlib import Path

FEATURE_COLS = [
    "Active Power Total",
    "Apparent Power Total",
    "Reactive Power Total",
    "Power Factor Total",
    "Current A",
    "Current B",
    "Current C",
    "Current Avg",
    "Voltage A-B",
    "Voltage B-C",
    "Voltage C-A",
    "Voltage L-L Avg",
    "Frequency",
    "THD Current A",
    "THD Current B",
    "THD Current C",
    "THD Voltage A-B",
    "THD Voltage B-C",
    "THD Voltage C-A",
]

FALLBACK_PROFILE = {
    "Active Power Total": {"low": 0.04, "high": 0.16, "center": 0.10, "step": 0.01},
    "Apparent Power Total": {"low": 0.06, "high": 0.22, "center": 0.14, "step": 0.01},
    "Reactive Power Total": {"low": 0.02, "high": 0.15, "center": 0.08, "step": 0.01},
    "Power Factor Total": {"low": 0.70, "high": 0.95, "center": 0.85, "step": 0.005},
    "Current A": {"low": 0.0, "high": 0.0, "center": 0.0, "step": 0.0},
    "Current B": {"low": 0.05, "high": 0.65, "center": 0.20, "step": 0.02},
    "Current C": {"low": 0.05, "high": 0.25, "center": 0.12, "step": 0.01},
    "Current Avg": {"low": 0.05, "high": 0.30, "center": 0.13, "step": 0.01},
    "Voltage A-B": {"low": 425.0, "high": 455.0, "center": 440.0, "step": 0.8},
    "Voltage B-C": {"low": 423.0, "high": 453.0, "center": 438.0, "step": 0.8},
    "Voltage C-A": {"low": 424.0, "high": 454.0, "center": 439.0, "step": 0.8},
    "Voltage L-L Avg": {"low": 424.0, "high": 454.0, "center": 439.0, "step": 0.8},
    "Frequency": {"low": 49.8, "high": 50.1, "center": 49.95, "step": 0.01},
    "THD Current A": {"low": 0.0, "high": 0.0, "center": 0.0, "step": 0.0},
    "THD Current B": {"low": 1.0, "high": 12.0, "center": 6.0, "step": 0.25},
    "THD Current C": {"low": 28.0, "high": 40.0, "center": 34.0, "step": 0.4},
    "THD Voltage A-B": {"low": 1.3, "high": 2.1, "center": 1.7, "step": 0.04},
    "THD Voltage B-C": {"low": 1.3, "high": 2.1, "center": 1.7, "step": 0.04},
    "THD Voltage C-A": {"low": 1.3, "high": 2.1, "center": 1.7, "step": 0.04},
}


def _load_stream_profile():
    profile_path = Path(__file__).resolve().parent / "models" / "stream_profile.json"
    if not profile_path.exists():
        return FALLBACK_PROFILE

    try:
        custom_profile = json.loads(profile_path.read_text())
    except Exception:
        return FALLBACK_PROFILE

    profile = {}
    for feature in FEATURE_COLS:
        cfg = custom_profile.get(feature, FALLBACK_PROFILE[feature])
        low = float(cfg.get("low", FALLBACK_PROFILE[feature]["low"]))
        high = float(cfg.get("high", FALLBACK_PROFILE[feature]["high"]))
        center = float(cfg.get("center", (low + high) / 2))
        step = float(cfg.get("step", max((high - low) * 0.05, 1e-4)))

        if high < low:
            low, high = high, low

        center = max(low, min(high, center))
        profile[feature] = {
            "low": low,
            "high": high,
            "center": center,
            "step": max(step, 0.0),
        }

    return profile

PROFILE = _load_stream_profile()
SUBSTATION_STATE = {}


def _next_value(substation_id, feature_name):
    cfg = PROFILE.get(feature_name, FALLBACK_PROFILE[feature_name])

    if cfg["low"] == cfg["high"]:
        return cfg["center"]

    state = SUBSTATION_STATE.setdefault(substation_id, {})
    prev = state.get(feature_name, random.uniform(cfg["low"], cfg["high"]))

    candidate = prev + random.gauss(0, cfg["step"])
    candidate = (0.9 * candidate) + (0.1 * cfg["center"])
    candidate = max(cfg["low"], min(cfg["high"], candidate))

    state[feature_name] = candidate
    return candidate


def generate_substation(id):
    payload = {feature: round(_next_value(id, feature), 3) for feature in FEATURE_COLS}
    return {"id": id, "name": f"Substation {id}", "payload": payload}