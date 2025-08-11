import pandas as pd
import pickle


def predict_rain(input_df):
    # Load the model and feature names
    with open("rainfall_prediction_model.pkl", "rb") as file:
        model_data = pickle.load(file)

    model = model_data["model"]
    feature_names = model_data["feature_names"]

    # Ensure the input DataFrame has the correct columns
    input_df.columns = input_df.columns.str.strip()
    input_df = input_df[feature_names]

    # Predict class (0 or 1)
    predictions = model.predict(input_df)

    # Predict probabilities
    prediction_probs = model.predict_proba(input_df)

    # Show results
    for i, (pred, prob) in enumerate(zip(predictions, prediction_probs)):
        rain_chance = round(prob[1] * 100, 2)  # Probability of class 1 (Rain)
        if pred == 1:
            return rain_chance, "Rain expected"
        else:
            return rain_chance, "No Rain expected"


def predfall(input_data):
    input_data = input_data
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

    rain_chance, rain_status = predict_rain(input_df)
    return rain_status, rain_chance


# example usage
x, y = predfall([1015.9, 19.9, 95, 81, 0.0, 40.0, 13.7])
print(x, y)
