import joblib
import os

model_path = os.path.join('model', 'xgb_cap_model.pkl')

# 1️⃣ Check if file exists
if not os.path.exists(model_path):
    print("❌ Model file not found at:", model_path)
else:
    print("✅ Model file found at:", model_path)

    # 2️⃣ Try to load it
    try:
        model = joblib.load(model_path)
        print("✅ Model loaded successfully!")
        print("🔹 Model type:", type(model))

        # 3️⃣ Optional: test prediction with dummy data if it’s an XGBoost model
        try:
            import numpy as np
            dummy = np.array([[85.0, 1]])  # e.g., percentile=85, branch=1
            pred = model.predict(dummy)
            print("✅ Prediction test successful, output:", pred)
        except Exception as e:
            print("⚠️ Model loaded, but prediction test failed:", e)

    except Exception as e:
        print("❌ Failed to load model:", e)
