# ==========================================
# MHT-CET College Recommendation - Test Script
# ==========================================

import pandas as pd
import joblib
import os

# ========================
# Step 1: Load trained model
# ========================
output_folder = r"D:\CET-Prediction\ZIp\MODEL TRAIN"
  # folder where the model is saved
model_file = os.path.join(output_folder, 'xgb_cap_model.pkl')
model = joblib.load(model_file)

# ========================
# Step 2: Load processed dataset
# ========================
data_file = r"D:\CET-Prediction\ZIp\MODEL TRAIN\flattened data\flattened_CAP_data done.xlsx"
df = pd.read_excel(data_file)

# ========================
# Step 3: Function to classify R_score
# ========================
def rscore_to_class(r):
    if r >= 0.75:
        return 'Top'
    elif r >= 0.5:
        return 'Moderate'
    else:
        return 'Backup'

# ========================
# Step 4: Test Input
# ========================
test_percentile = 85.0
test_branch = 'Computer Engineering'  # must match branch_name in Excel

# ========================
# Step 5: Filter by branch
# ========================
df_branch = df[df['branch_name'] == test_branch].copy()

# ========================
# Step 6: Map Type to numeric weight
# ========================
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

df_branch['Type_Weight'] = df_branch['type'].map(type_weight_mapping)
df_branch['Type_Weight'].fillna(0.6, inplace=True)  # default if type not found

# ========================
# Step 7: Compute normalized closing percentile
# ========================
min_cutoff = df['closing_percentile'].min()
max_cutoff = df['closing_percentile'].max()
df_branch['C_normalized'] = (df_branch['closing_percentile'] - min_cutoff) / (max_cutoff - min_cutoff)

# ========================
# Step 8: Prepare features for prediction
# ========================
X_test = df_branch[['C_normalized', 'Type_Weight']]

# ========================
# Step 9: Predict closing percentile
# ========================
y_pred = model.predict(X_test)

# ========================
# Step 10: Compute R_score
# ========================
df_branch['R_score'] = (0.8 * ((y_pred - min_cutoff)/(max_cutoff - min_cutoff))) + (0.2 * df_branch['Type_Weight'])

# ========================
# Step 11: Classify colleges
# ========================
df_branch['Class'] = df_branch['R_score'].apply(rscore_to_class)

# ========================
# Step 12: Filter eligible colleges (percentile >= predicted closing percentile)
# ========================
df_branch = df_branch[df_branch['closing_percentile'] <= test_percentile]

# ========================
# Step 13: Sort by R_score descending
# ========================
df_branch = df_branch.sort_values(by='R_score', ascending=False)

# ========================
# Step 14: Display Top 10 Recommendations
# ========================
print("Top College Recommendations for Percentile =", test_percentile, "and Branch =", test_branch)
print(df_branch[['college_name', 'branch_name', 'city', 'type', 'closing_percentile', 'R_score', 'Class']].head(10))

# ========================
# Optional: Save recommendations to Excel
# ========================
output_file = os.path.join(output_folder, f'top_colleges_{test_branch.replace(" ","_")}.xlsx')
df_branch.to_excel(output_file, index=False)
print("Recommendations saved to:", output_file)
