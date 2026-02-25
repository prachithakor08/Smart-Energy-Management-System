import random

def generate_substation(id):

    payload = {
        "Active Power Total": round(random.uniform(0.04, 0.16), 2),
        "Apparent Power Total": round(random.uniform(0.06, 0.22), 2),
        "Reactive Power Total": round(random.uniform(0.02, 0.15), 2),
        "Power Factor Total": round(random.uniform(0.7, 0.95), 2),
        "Current A": 0,
        "Current B": round(random.uniform(0.05, 0.65), 2),
        "Current C": round(random.uniform(0.05, 0.25), 2),
        "Current Avg": round(random.uniform(0.05, 0.30), 2),
        "Voltage A-B": round(random.uniform(425, 455), 2),
        "Voltage B-C": round(random.uniform(423, 453), 2),
        "Voltage C-A": round(random.uniform(424, 454), 2),
        "Voltage L-L Avg": round(random.uniform(424, 454), 2),
        "Frequency": round(random.uniform(49.8, 50.1), 2),
        "THD Current A": 0,
        "THD Current B": round(random.uniform(1, 12), 2),
        "THD Current C": round(random.uniform(28, 40), 2),
        "THD Voltage A-B": round(random.uniform(1.3, 2.1), 2),
        "THD Voltage B-C": round(random.uniform(1.3, 2.1), 2),
        "THD Voltage C-A": round(random.uniform(1.3, 2.1), 2)
    }

    return {
        "id": id,
        "name": f"Substation {id}",
        "payload": payload
    }