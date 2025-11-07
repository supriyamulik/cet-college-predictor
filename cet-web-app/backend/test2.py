# ==========================================
# MHT-CET College Recommendation - Test Script (Menu Driven)
# ==========================================

import pandas as pd
import joblib
import os

# ==========================================
# Load Model and Data
# ==========================================
model_path = r"D:\CET-Prediction\ZIp\MODEL TRAIN\model\xgb_cap_model.pkl"
data_path = r"D:\CET-Prediction\ZIp\MODEL TRAIN\flattened data\flattened_CAP_data done.xlsx"

model = joblib.load(model_path)
df = pd.read_excel(data_path)

# ==========================================
# Prepare Data (Type Weight + Normalization)
# ==========================================
type_weight_mapping = {
    "Government": 1.00,
    "Autonomous / Government": 0.95,
    "State Technological University": 0.90,
    "University Department": 0.85,
    "Autonomous / Aided": 0.80,
    "Autonomous / Private": 0.75,
    "Deemed University": 0.70,
    "State Private University": 0.65,
    "Private (Unaided)": 0.60,
    "Deemed University (Off-Campus)": 0.55
}

df['Type_Weight'] = df['type'].map(type_weight_mapping)
df['Type_Weight'].fillna(0.6, inplace=True)

min_cutoff = df['closing_percentile'].min()
max_cutoff = df['closing_percentile'].max()
df['C_normalized'] = (df['closing_percentile'] - min_cutoff) / (max_cutoff - min_cutoff)

# ==========================================
# Menu Input
# ==========================================
print("\n🎯 MHT-CET College Recommendation System")
print("------------------------------------------")
user_rank = float(input("Enter your CET Rank: "))
user_percentile = float(input("Enter your CET Percentile: "))

# Optional filters
apply_city = input("Do you want to filter by city? (y/n): ").strip().lower()
city_filter = input("Enter preferred city name: ").strip().title() if apply_city == 'y' else None

apply_branch = input("Do you want to filter by branch/department? (y/n): ").strip().lower()
branch_filter = input("Enter branch name keyword (like Computer, Mechanical): ").strip().title() if apply_branch == 'y' else None

apply_category = input("Do you want to filter by category? (y/n): ").strip().lower()
category_filter = input("Enter category (like OPEN, OBC, SC, ST, EWS): ").strip().upper() if apply_category == 'y' else None

# ==========================================
# Filtering Based on Optional Inputs
# ==========================================
filtered_df = df.copy()

if city_filter:
    filtered_df = filtered_df[filtered_df['city'].str.contains(city_filter, case=False, na=False)]

if branch_filter:
    filtered_df = filtered_df[filtered_df['branch_name'].str.contains(branch_filter, case=False, na=False)]

if category_filter:
    filtered_df = filtered_df[filtered_df['category'].str.contains(category_filter, case=False, na=False)]

# If no data found after filters, fallback
if filtered_df.empty:
    print("\n⚠️ No colleges found for given filters. Showing top recommendations overall.")
    filtered_df = df.copy()

# ==========================================
# Predict & Score
# ==========================================
X_test = filtered_df[['C_normalized', 'Type_Weight']]
filtered_df['Predicted_Percentile'] = model.predict(X_test)

# Normalize prediction to realistic range (0–100)
filtered_df['Predicted_Percentile'] = (
    (filtered_df['Predicted_Percentile'] - filtered_df['Predicted_Percentile'].min()) /
    (filtered_df['Predicted_Percentile'].max() - filtered_df['Predicted_Percentile'].min())
) * 100

# ==========================================
# 🎯 Apply Recommended Combo (Best Practice)
# ==========================================
recommendations = filtered_df[
    (filtered_df['Predicted_Percentile'] >= user_percentile - 10) &
    (filtered_df['Predicted_Percentile'] <= user_percentile + 10)
]

recommendations = (
    recommendations.sort_values(by='Predicted_Percentile', ascending=False)
                   .groupby('college_name')
                   .head(1)
                   .head(20)
)

# ==========================================
# Output
# ==========================================
if recommendations.empty:
    print("\n⚠️ No matches found near your percentile range. Showing top overall colleges instead.\n")
    recommendations = (
        filtered_df.sort_values(by='Predicted_Percentile', ascending=False)
                   .groupby('college_name')
                   .head(1)
                   .head(20)
    )

print("\n🎓 Recommended Colleges for You:")
print("----------------------------------------------------------")
for i, row in enumerate(recommendations.itertuples(), 1):
    print(f"{i}. {row.college_name} | {row.branch_name} | {row.city} | {row.type} | Predicted: {row.Predicted_Percentile:.2f}%")

# Save results
# output_path = os.path.join(os.getcwd(), "recommended_colleges.xlsx")
output_folder = r"C:\MODEL TRAIN\Results"
os.makedirs(output_folder, exist_ok=True)
output_path = os.path.join(output_folder, "recommended_colleges.xlsx")
recommendations.to_excel(output_path, index=False)
print(f"\n✅ Top {len(recommendations)} recommendations saved to {output_path}")
print("----------------------------------------------------------")
