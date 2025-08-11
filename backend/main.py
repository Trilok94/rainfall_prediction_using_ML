from flask import Flask, request, jsonify
import pandas as pd
import joblib
from pridrain import predfall
from flask_cors import CORS


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()  # <-- Yeh frontend se JSON data lega
        data = [values for values in data.values()]
        x, y = predfall(data)
        return jsonify({"rain_expectation": x, "percentage": y})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
