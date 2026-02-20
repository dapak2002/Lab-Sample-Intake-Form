# Lab Sample Intake Application

A minimal one-page, two-step web app that validates a sample ID, confirms patient details, and records sample collection date and notes.

- **Backend:** Flask (Python), in-memory storage — `sample-service/`
- **Frontend:** Next.js (React), single-page two-step workflow — `sample-app/`

## Valid Sample IDs (for testing)

| Sample ID   | Patient Name | Date of Birth |
|------------|--------------|---------------|
| `SAMPLE-001` | Jane Smith   | 1985-03-15    |
| `SAMPLE-002` | John Doe     | 1990-07-22    |

Use either of these IDs in Step 1 to test the flow. Any other ID will return "Sample NOT Found".

## Setup and run on localhost

### 1. Backend (Flask)

From the project root:

```bash
cd sample-service
```

Using **Pipenv** (recommended):

```bash
pipenv install
pipenv run python app.py
```

Or using **venv**:

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

API runs at **http://localhost:5001** (port 5001 avoids conflict with macOS AirPlay on 5000).

### 2. Frontend (Next.js)

In a new terminal, from the project root:

```bash
cd sample-app
npm install
npm run dev
```

App runs at **http://localhost:3000**.

### 3. Use the app

1. Open http://localhost:3000 in your browser.
2. **Step 1:** Enter a sample ID (e.g. `SAMPLE-001`) and click **Lookup**. If found, patient name and date of birth are shown; click **Confirm** to continue.
3. **Step 2:** Enter **Sample Collection Date** (required) and optional **Notes**, then click **Submit**.

## API

- **GET** `/api/sample/<sample_id>` — Look up sample. Returns `200` with `{ "name", "date_of_birth" }` or `404` with "Sample NOT Found".
- **POST** `/api/sample/submit` — Submit collection data. Body: `{ "sample_id", "collection_date", "notes" }`. Returns `200` on success or `400` with error message on validation failure.

## Notes

- Data is stored in memory; nothing persists after restarting the backend.
- CORS is enabled so the Next.js dev server can call the Flask API.
