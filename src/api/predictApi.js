export const predictAlert = async (substation) => {
  console.log("Sending to backend:", {
    id: substation.id,
    payload: substation.payload,
  });

  const res = await fetch("http://localhost:5000/predict-alert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: substation.id,
      payload: substation.payload,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Backend error:", err);
    throw new Error(err.error || "Prediction failed");
  }

  return res.json();
};
