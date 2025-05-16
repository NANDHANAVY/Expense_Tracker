import { useState } from "react";
import axios from "axios";

export default function AddExpenseForm({ onRecordAdded }) {
  const [formData, setFormData] = useState({
    recordType: "Expense",
    category: "",
    note: "",
    amount: "",
    time: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email_address"); // ✅ get email from localStorage
    const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

    if (!email) {
      alert("Email not found. Please login again.");
      return;
    }

    try {
      // ✅ Include email_address in payload
      const payload = { ...formData, email_address: email };

      console.log("Submitting record:", payload);

      const response = await axios.post(
        `${baseURL}/records/create/`,
        payload
      );

      if (response.data.alert) {
        alert(response.data.alert);
      } else {
        alert("Record added successfully");
        
      }
      setFormData({
        recordType: "Expense",
        category: "",
        note: "",
        amount: "",
        time: "",
        date: "",
      });
      // ✅ reset form
      onRecordAdded();
      
    } catch (error) {
      console.error("Add record error:", error.response?.data || error.message);
      const errData = error.response?.data;
      const msg =
        errData?.detail ||
        errData?.error ||
        JSON.stringify(errData) ||
        "Error adding record";
      
    }
  };

  return (
    <form className="card p-4 mb-4" onSubmit={handleSubmit}>
      <h4 className="mb-3">Add New Expense</h4>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <input
          type="text"
          className="form-control"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Note</label>
        <input
          type="text"
          className="form-control"
          name="note"
          value={formData.note}
          onChange={handleChange}
        />
      </div>

      <div className="row">
        <div className="col-md-12 mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Time</label>
          <input
            type="time"
            className="form-control"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Add Expense
      </button>
    </form>
  );
}
