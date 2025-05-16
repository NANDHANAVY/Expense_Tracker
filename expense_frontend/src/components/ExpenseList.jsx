import axios from "axios";
import { useEffect, useState } from "react";
import api from "../services/axios";

/**
 * Displays a list of expense records.
 * Handles fetching, deletion, and triggers edit via parent callback.
 */
export default function ExpenseList({ expenses, onEdit, onDelete }) {
   const [records, setRecords] = useState([]);
   const [refresh, setRefresh] = useState(false);
   const [refreshFlag, setRefreshFlag] = useState(false)
   
   /**
    * Triggers a refresh of the records list.
    */
   const triggerRefresh = () => setRefreshFlag(f => !f)

  /**
   * Handles deletion of a record after user confirmation.
   */
  const handleDelete = async (id) => {
    console.log("Deleting record with ID:", id);
    if (window.confirm('Are you sure you want to delete this expense?')) {

      try {
        refreshFlag // Used to trigger re-fetch
        await api.delete(`records/delete/`, {

          data: {
            email_address: localStorage.getItem("email_address"),
            id: id,
            
          },
        });
        alert('Expense deleted successfully')
        triggerRefresh()
      } catch (err) {
        console.error(err)
        
      }
    }
  }

  /**
   * Fetches all records for the logged-in user.
   */
  const fetchRecords = async () => {
    const email_address = localStorage.getItem("email_address");

    if (!email_address) {
      alert("Email not found. Please login again.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/records/list/`,
        { email_address }
      );
      console.log("Fetched Records:", response.data);
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error.response?.data || error.message);
      alert("Failed to fetch records");
    }
  };
  
  // Fetch records on mount and when refresh changes
  useEffect(() => {
    fetchRecords();
  }, [refresh]);


  // Render the expense records table
  return (
    <div className="mt-4">
      <h1 className="mb-3 text-center b-4 ">Expense Records</h1>
      {records.length === 0 ? (
        <div className="alert alert-warning">No records found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                {/* <th className="text-center">Key</th> */}
                <th>Category</th>
                <th>Note</th>
                <th>Amount</th>
                <th>Time</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id}>
                  {/* <td className="text-center">{rec.id}</td> */}
                  <td className="text-center">{rec.category}</td>
                  <td className="text-center">{rec.note}</td>
                  <td className="text-center">₹ {rec.amount}</td>
                  <td className="text-center">{rec.time}</td>
                  <td className="text-center">{rec.date}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm-12 btn-warning me-5  pl-4 pr-4 col-2"
                      onClick={() => onEdit(rec)}
                      
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm-12 btn-danger  ms-5 pl-4 pr-4 col-2"
                      onClick={() => handleDelete(rec.id) }
                      onChange={triggerRefresh}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


