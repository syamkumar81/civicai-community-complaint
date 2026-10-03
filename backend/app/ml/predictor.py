import os
from datetime import datetime

import joblib
import pandas as pd


# ============================================================
# MODEL PATH
# ============================================================

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    CURRENT_DIR,
    "community_priority_logistic_regression.pkl"
)


# ============================================================
# MODEL
# ============================================================

model = None


def load_model():
    """
    Load the ML model only when it is needed.
    """

    global model

    if model is not None:
        return model

    print("\n========================================")
    print("LOADING CIVICAI ML MODEL")
    print("========================================")
    print("Model path:")
    print(MODEL_PATH)

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"ML model file not found: {MODEL_PATH}"
        )

    try:

        model = joblib.load(MODEL_PATH)

        print("ML MODEL LOADED SUCCESSFULLY")
        print("Model type:", type(model))
        print("========================================\n")

        return model

    except Exception as e:

        print("\n========================================")
        print("ML MODEL LOAD ERROR")
        print("========================================")
        print(repr(e))
        print("========================================\n")

        raise RuntimeError(
            f"Could not load ML model: {str(e)}"
        )


# ============================================================
# MODEL FEATURES
# ============================================================

MODEL_COLUMNS = [
    "Complaint_Date",
    "State",
    "City",
    "Complaint_Type",
    "Location_Type",
    "Emergency",
    "Submission_Channel",
    "Severity_Score",
    "Safety_Risk_Score",
    "Affected_People",
    "Days_Pending",
    "Repeat_Complaints",
    "Estimated_Cost_INR",
]


# ============================================================
# PREDICT PRIORITY
# ============================================================

def predict_priority(complaint):

    try:

        # ----------------------------------------------------
        # Load model
        # ----------------------------------------------------

        ml_model = load_model()


        # ----------------------------------------------------
        # Convert complaint into dictionary
        # ----------------------------------------------------

        if hasattr(complaint, "model_dump"):

            data = complaint.model_dump()

        elif hasattr(complaint, "dict"):

            data = complaint.dict()

        elif isinstance(complaint, dict):

            data = complaint.copy()

        else:

            raise ValueError(
                "Unsupported complaint data format."
            )


        # ----------------------------------------------------
        # CATEGORICAL FEATURES
        # ----------------------------------------------------

        complaint_date = (
            data.get("complaint_date")
            or data.get("Complaint_Date")
            or datetime.now().strftime("%Y-%m-%d")
        )

        state = (
            data.get("state")
            or data.get("State")
            or "Unknown"
        )

        city = (
            data.get("city")
            or data.get("City")
            or data.get("district")
            or "Unknown"
        )

        complaint_type = (
            data.get("complaint_type")
            or data.get("Complaint_Type")
            or data.get("category")
            or "Other"
        )

        location_type = (
            data.get("location_type")
            or data.get("Location_Type")
            or "Urban"
        )

        emergency = (
            data.get("emergency")
            or data.get("Emergency")
            or "No"
        )

        submission_channel = (
            data.get("submission_channel")
            or data.get("Submission_Channel")
            or "Web"
        )


        # ----------------------------------------------------
        # NUMERICAL FEATURES
        # ----------------------------------------------------

        severity_score = (
            data.get("severity_score")
            if data.get("severity_score") is not None
            else data.get("Severity_Score", 5)
        )

        safety_risk_score = (
            data.get("safety_risk_score")
            if data.get("safety_risk_score") is not None
            else data.get("Safety_Risk_Score", 5)
        )

        affected_people = (
            data.get("affected_people")
            if data.get("affected_people") is not None
            else data.get("Affected_People", 1)
        )

        days_pending = (
            data.get("days_pending")
            if data.get("days_pending") is not None
            else data.get("Days_Pending", 0)
        )

        repeat_complaints = (
            data.get("repeat_complaints")
            if data.get("repeat_complaints") is not None
            else data.get("Repeat_Complaints", 0)
        )

        estimated_cost = (
            data.get("estimated_cost_inr")
            if data.get("estimated_cost_inr") is not None
            else data.get("Estimated_Cost_INR", 0)
        )


        # ----------------------------------------------------
        # SAFE NUMERIC CONVERSION
        # ----------------------------------------------------

        try:
            severity_score = float(severity_score)
        except:
            severity_score = 5.0

        try:
            safety_risk_score = float(safety_risk_score)
        except:
            safety_risk_score = 5.0

        try:
            affected_people = float(affected_people)
        except:
            affected_people = 1.0

        try:
            days_pending = float(days_pending)
        except:
            days_pending = 0.0

        try:
            repeat_complaints = float(repeat_complaints)
        except:
            repeat_complaints = 0.0

        try:
            estimated_cost = float(estimated_cost)
        except:
            estimated_cost = 0.0


        # ----------------------------------------------------
        # CREATE EXACT MODEL INPUT
        # ----------------------------------------------------

        input_data = {

            "Complaint_Date": [
                str(complaint_date)
            ],

            "State": [
                str(state)
            ],

            "City": [
                str(city)
            ],

            "Complaint_Type": [
                str(complaint_type)
            ],

            "Location_Type": [
                str(location_type)
            ],

            "Emergency": [
                str(emergency)
            ],

            "Submission_Channel": [
                str(submission_channel)
            ],

            "Severity_Score": [
                severity_score
            ],

            "Safety_Risk_Score": [
                safety_risk_score
            ],

            "Affected_People": [
                affected_people
            ],

            "Days_Pending": [
                days_pending
            ],

            "Repeat_Complaints": [
                repeat_complaints
            ],

            "Estimated_Cost_INR": [
                estimated_cost
            ],
        }


        # ----------------------------------------------------
        # DATAFRAME
        # ----------------------------------------------------

        df = pd.DataFrame(
            input_data,
            columns=MODEL_COLUMNS
        )


        print("\n========================================")
        print("ML PREDICTION INPUT")
        print("========================================")
        print(df.to_string(index=False))
        print("========================================")


        # ----------------------------------------------------
        # PREDICT
        # ----------------------------------------------------

        prediction = ml_model.predict(df)

        priority = str(prediction[0])


        print("\n========================================")
        print("ML PREDICTION:", priority)
        print("========================================\n")


        return priority


    except Exception as e:

        print("\n========================================")
        print("ML PREDICTION ERROR")
        print("========================================")
        print(repr(e))
        print("========================================\n")

        raise RuntimeError(
            f"ML prediction failed: {str(e)}"
        )