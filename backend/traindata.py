# import numpy as np
# import pandas as pd
# from sklearn.utils import resample
# from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
# import pickle

# # loading the data
# data = pd.read_csv("./Rainfall.csv")

# # striping the all columns so that no space left
# data.columns = data.columns.str.strip()

# # we dont need day
# data = data.drop(columns=["day"])

# # handle missing values
# data["winddirection"] = data["winddirection"].fillna(data["winddirection"].mode()[0])
# data["windspeed"] = data["windspeed"].fillna(data["windspeed"].median())

# data["rainfall"] = data["rainfall"].map({"yes": 1, "no": 0})

# # drop highly correlated column
# data = data.drop(columns=["maxtemp", "temparature", "mintemp"])


# df_majority = data[data["rainfall"] == 1]
# df_minority = data[data["rainfall"] == 0]

# # downsample majority class to match minority count
# df_majority_downsampled = resample(
#     df_majority, replace=False, n_samples=len(df_minority), random_state=42
# )


# df_downsampled = pd.concat([df_majority_downsampled, df_minority])


# # shuffle the final dataframe
# df_downsampled = df_downsampled.sample(frac=1, random_state=42).reset_index(drop=True)


# # split features and target as X and y
# X = df_downsampled.drop(columns=["rainfall"])
# y = df_downsampled["rainfall"]

# # splitting the data into training data and test data
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42
# )


# rf_model = RandomForestClassifier(random_state=42)

# param_grid_rf = {
#     "n_estimators": [50, 100, 200],
#     "max_features": ["sqrt", "log2"],
#     "max_depth": [None, 10, 20, 30],
#     "min_samples_split": [2, 5, 10],
#     "min_samples_leaf": [1, 2, 4],
# }


# # Hypertuning using GridSearchCV
# grid_search_rf = GridSearchCV(
#     estimator=rf_model, param_grid=param_grid_rf, cv=5, n_jobs=-1, verbose=2
# )

# grid_search_rf.fit(X_train, y_train)


# best_rf_model = grid_search_rf.best_estimator_


# y_pred = best_rf_model.predict(X_test)


# input_data = (1015.9, 19.9, 95, 81, 0.0, 40.0, 13.7)

# input_df = pd.DataFrame(
#     [input_data],
#     columns=[
#         "pressure",
#         "dewpoint",
#         "humidity",
#         "cloud",
#         "sunshine",
#         "winddirection",
#         "windspeed",
#     ],
# )


# prediction = best_rf_model.predict(input_df)
# print("Prediction result:", "Rainfall" if prediction[0] == 1 else "No Rainfall")

# # save model and feature names to a pickle file
# model_data = {"model": best_rf_model, "feature_names": X.columns.tolist()}

# with open("rainfall_prediction_model.pkl", "wb") as file:
#     pickle.dump(model_data, file)


import numpy as np
import pandas as pd
from sklearn.utils import resample
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import pickle

# Load dataset
data = pd.read_csv("./Rainfall.csv")

# Clean column names
data.columns = data.columns.str.strip()

# Drop unneeded column
if "day" in data.columns:
    data = data.drop(columns=["day"])

# Fill missing values
data["winddirection"] = data["winddirection"].fillna(data["winddirection"].mode()[0])
data["windspeed"] = data["windspeed"].fillna(data["windspeed"].median())

# Encode target
data["rainfall"] = data["rainfall"].map({"yes": 1, "no": 0})

# Drop highly correlated columns
data = data.drop(columns=["maxtemp", "temparature", "mintemp"], errors="ignore")

# Balance the classes using downsampling
df_majority = data[data["rainfall"] == 1]
df_minority = data[data["rainfall"] == 0]
df_majority_downsampled = resample(
    df_majority, replace=False, n_samples=len(df_minority), random_state=42
)
df_downsampled = pd.concat([df_majority_downsampled, df_minority])

# Shuffle
df_downsampled = df_downsampled.sample(frac=1, random_state=42).reset_index(drop=True)

# Split X and y
X = df_downsampled.drop(columns=["rainfall"])
y = df_downsampled["rainfall"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Random Forest model
rf_model = RandomForestClassifier(random_state=42)

# Hyperparameter tuning
param_grid_rf = {
    "n_estimators": [50, 100],
    "max_features": ["sqrt", "log2"],
    "max_depth": [None, 10, 20],
    "min_samples_split": [2, 5],
    "min_samples_leaf": [1, 2],
}

grid_search_rf = GridSearchCV(
    estimator=rf_model, param_grid=param_grid_rf, cv=5, n_jobs=-1, verbose=2
)
grid_search_rf.fit(X_train, y_train)

# Best model
best_rf_model = grid_search_rf.best_estimator_

# Evaluate
y_pred = best_rf_model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Test prediction
input_data = (1015.9, 19.9, 95, 81, 0.0, 40.0, 13.7)
input_df = pd.DataFrame(
    [input_data],
    columns=[
        "pressure",
        "dewpoint",
        "humidity",
        "cloud",
        "sunshine",
        "winddirection",
        "windspeed",
    ],
)
prediction = best_rf_model.predict(input_df)
print("Prediction result:", "Rainfall" if prediction[0] == 1 else "No Rainfall")

# Save model + features
model_data = {
    "model": best_rf_model,
    "feature_names": X.columns.tolist(),  # For consistent prediction input
}
with open("rainfall_prediction_model.pkl", "wb") as file:
    pickle.dump(model_data, file)

print("✅ Model training completed and saved as 'rainfall_prediction_model.pkl'")
