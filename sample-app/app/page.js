"use client";

import { useState } from "react";

// Base URL for backend API
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// States used to render efficienty in React
export default function Page() {
  const [step, setStep] = useState(1);
  const [sampleId, setSampleId] = useState("");
  const [patient, setPatient] = useState(null);
  const [collectionDate, setCollectionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState(null);

  // Lookup function to fetch patient data from the backend
  // Uses API Endpoint to retrieve patient data
  const lookup = async (e) => {
    e.preventDefault();
    setMsg(null);
    setPatient(null);
    const id = sampleId;
    // Check if ID state is set
    if (!id) return setMsg({ err: "Please enter a Sample ID." });

    // Fetch sample endpoint
    try {
      const res = await fetch(`${API}/api/sample/${encodeURIComponent(id)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        return setMsg({ err: data.error || "Sample NOT Found" });

      // Set patient data to the state
      setPatient({
        name: data.name,
        date_of_birth: data.data_of_birth
      });
    } catch {
      // Set error message to the state
      setMsg({ err: "Unable to reach the server. Please try again." });
    }
  };

  // Submit function to submit sample data to the backend
  // Uses API Endpoint to submit sample data
  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    // Check if sample collection date is set
    if (!collectionDate.trim())
      return setMsg({ err: "Sample Collection Date is required." });

    // Submit sample endpoint is called
    try {
      const res = await fetch(`${API}/api/sample/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sample_id: sampleId.trim(), 
          collection_date: 
          collectionDate.trim(), notes: notes.trim()
        }),
      });
      const data = await res.json().catch(() => ({}));
      // Check if submission was successful
      if (!res.ok) return setMsg({ err: data.error || "Submission failed." });
      // Set success message to the state
      setMsg({ ok: true });
    } catch {
      setMsg({ err: "Unable to reach the server. Please try again." });
    }
  };

  return (
    <main>
     {/* Page title, step indicator, and status messages */}
      <h1>Lab Sample Intake</h1>
      <p className="step-indicator">Step {step} of 2</p>

      {msg?.err && <p className="error">{msg.err}</p>}
      {msg?.ok && <p className="success">Submission recorded successfully.</p>}

      {/* Step 1: Lookup form */}
      {step === 1 && (
        <>
          {/* Lookup form */}
          <form onSubmit={lookup}>
            <label htmlFor="sample-id">Sample ID</label>
            <input id="sample-id" type="text" value={sampleId} onChange={(e) => setSampleId(e.target.value)} placeholder="ex.) SAMPLE-001" />
            <button type="submit">Lookup</button>
          </form>
          {/* If patient data is found, display it */}
          {patient && (
            <div className="patient-info">
              <p><strong>Patient Name:</strong> {patient.name}</p>
              <p><strong>Date of Birth:</strong> {patient.date_of_birth}</p>
              <button type="button" onClick={() => { setStep(2); setMsg(null); setCollectionDate(""); setNotes(""); }}>Confirm</button>
            </div>
          )}
        </>
      )}

      {/* Step 2: Submission form */}
      {step === 2 && (
        <>
          {/* Submission form */}
          <form onSubmit={submit}>
            <label htmlFor="collection-date">Sample Collection Date *</label>
            {/* Sample collection date input */}
            <input id="collection-date" type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} required />
            {/* Notes input */}
            <label htmlFor="notes">Notes (optional)</label>
            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </main>
  );
}
