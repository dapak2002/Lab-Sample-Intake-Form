"""
Lab Sample Intake - Flask API
In-memory storage for samples and submissions.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In-memory sample registry (sample_id -> patient info)
SAMPLES = {
    "SAMPLE-001": {
        "name": "Jane Smith",
        "date_of_birth": "1985-03-15",
    },
    "SAMPLE-002": {
        "name": "John Doe",
        "date_of_birth": "1990-07-22",
    },
}

# In-memory submissions (list of submitted records)
SUBMISSIONS = []


@app.route("/api/sample/<sample_id>", methods=["GET"])
def get_sample(sample_id):
    """Look up a sample by sample_id. Returns 200 with name and data_of_birth or 404."""

    # Check if sample_id is in the SAMPLES dictionary
    if sample_id not in SAMPLES:
        return jsonify({"error": "Sample NOT Found"}), 404
    sample = SAMPLES[sample_id]

    # Return the sample data
    return jsonify({
        "name": sample["name"],
        "data_of_birth": sample["date_of_birth"],
    }), 200


@app.route("/api/sample/submit", methods=["POST"])
def submit_sample():
    """
    Submit sample collection data.
    Body: sample_id (required, must exist), collection_date (required), notes (optional).
    """
    # Get the data from the request
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    # Check if sample_id is in the SAMPLES dictionary
    sample_id = (data.get("sample_id") or "").strip()
    if not sample_id:
        return jsonify({"error": "sample_id is required"}), 400
    if sample_id not in SAMPLES:
        return jsonify({"error": "Sample NOT Found"}), 400

    # Check if collection_date is in the correct format
    collection_date = (data.get("collection_date") or "").strip()
    if not collection_date:
        return jsonify({"error": "collection_date is required"}), 400
    try:
        datetime.strptime(collection_date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "collection_date must be in YYYY-MM-DD format"}), 400

    # Get the notes from the request
    notes = data.get("notes") or ""

    # Create a new record
    record = {
        "sample_id": sample_id,
        "collection_date": collection_date,
        "notes": str(notes).strip() if notes else "",
    }

    # Add the record to the SUBMISSIONS list
    SUBMISSIONS.append(record)

    # Return the record
    return jsonify({"message": "Submission recorded", "data": record}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
