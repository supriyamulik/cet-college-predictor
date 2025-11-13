from predictor import CollegePredictor
import pandas as pd

if __name__ == "__main__":
    print("\n=== 🔍 RAW MODEL OUTPUT TEST ===")
    predictor = CollegePredictor()

    # Take first few rows of your data
    df = predictor.college_data.head(10).copy()

    # Prepare feature columns same as training
    df['Type_Weight'] = df['type'].map(predictor.type_weight_mapping).fillna(0.60)
    denom = (predictor.max_cutoff - predictor.min_cutoff) or 1.0
    df['C_normalized'] = (df['closing_percentile'] - predictor.min_cutoff) / denom

    X = df[['C_normalized', 'Type_Weight']].copy()

    # Run the model directly
    preds = predictor.model.predict(X)

    # Show results
    print("\n📊 === RAW MODEL PREDICTIONS (Next-Year Cutoff %) ===")
    for i, (college, branch, city, pred) in enumerate(zip(df['college_name'], df['branch_name'], df['city'], preds), 1):
        print(f"{i}. {college} ({branch}, {city}) → Predicted Cutoff: {round(pred, 2)}%")
