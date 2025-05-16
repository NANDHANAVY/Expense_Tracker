// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import api from '../services/axios'
import Navbar from '../components/Navbar'
import AddExpenseForm from '../components/AddExpenseForm'
import ExpenseList from '../components/ExpenseList'
import SetBudgetForm from '../components/SetBudgetForm'
import EditExpenseModal from '../components/EditExpenseModal'
import '../app.css'

/**
 * Displays a warning alert for budget-related messages.
 */
function BudgetAlert({ alert }) {
  return (
    <div className="alert alert-warning">
      {alert.message}
    </div>
  )
}

/**
 * Dashboard page for managing expenses and budgets.
 * Handles fetching, displaying, and updating expenses and budgets.
 */
export default function Dashboard() {
  // State variables for expenses, alerts, loading, errors, etc.
  const [expenses, setExpenses] = useState([])
  const [alertData, setAlertData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [lastBudget, setLastBudget] = useState(null)

  // Calculate total expenses for the current list
  const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)

  // Prepare budget comparison if lastBudget exists
  const budgetComparison = lastBudget
    ? {
        exceeded: totalSpent > lastBudget.budget,
        totalSpent,
        budgetLimit: lastBudget.budget,
        category: lastBudget.category,
      }
    : null

  // Get user email from localStorage
  const email = localStorage.getItem('email_address')

  // If no email is found, prompt user to log in
  if (!email) {
    return <div className="p-4 alert alert-warning">No email found. Please log in.</div>
  }

  /**
   * Fetches all expenses for the logged-in user.
   */
  const fetchExpenses = async () => {
    const res = await api.post('records/list/', { email_address: email })
    setExpenses(res.data)
  }

  /**
   * Fetches the most recently updated budget for the user.
   */
  const fetchLastBudget = () =>
    api
      .get('budgets/last-update/', { params: { email_address: email } })
      .then((r) => setLastBudget(r.data))
      .catch(() => setLastBudget(null))

  // Fetch expenses and budget on mount and when refreshFlag changes
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        await Promise.all([fetchExpenses(), fetchLastBudget()])
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [refreshFlag])

  /**
   * Triggers a refresh of expenses and budget data.
   */
  const triggerRefresh = () => setRefreshFlag((f) => !f)

  /**
   * Opens the edit modal for a selected expense.
   */
  const handleEditClick = (expense) => {
    setSelectedExpense(expense)
    setEditModalVisible(true)
  }

  /**
   * Handles deletion of an expense after user confirmation.
   */
  const handleDeleteClick = async (expenseId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this expense?')
    if (!confirmDelete) return
      triggerRefresh()
    try {
      await api.post('records/delete/', { id: expenseId, email_address: email })
      alert('Expense deleted successfully')
      triggerRefresh()
    } catch (err) {
      alert('Failed to delete expense')
      console.error(err)
    }

  }

  // Show loading or error states
  if (loading) return <div className="p-4">Loading…</div>
  if (error)
    return (
      <div className="p-4 alert alert-danger">
        <h5>Failed to load dashboard</h5>
        <pre>{error.message}</pre>
      </div>
    )

  // Main dashboard UI
  return (
    <div className="container my-4">
      <Navbar />
      {alertData && <BudgetAlert alert={alertData} />}

      <div className="mb-4 font-size-50">
        <h4>
          {lastBudget && (
            <div className="alert alert-info">
              Last Budget Updated :&nbsp;
              <strong></strong> ₹{lastBudget.budget}
              &nbsp;on&nbsp;
              {new Date(lastBudget.updated_at).toLocaleString()}
            </div>
          )}
        </h4>
      </div>

      {/* Budget comparison alert */}
      {budgetComparison && (
        <div
          className={`alert ${
            budgetComparison.exceeded ? `alert-danger ${(alert("budget exceeded"))}` : `alert-success`
          } text-center`}
        >
          {budgetComparison.exceeded
            ? `⚠ Exceeded  budget: ₹${budgetComparison.totalSpent} of ₹${budgetComparison.budgetLimit }`
            : `✅ Within  budget: ₹${budgetComparison.totalSpent} of ₹${budgetComparison.budgetLimit}`}
        </div>
      )}

      <div className="row ">
        <div className="row mb-4">
          <div className="col-md-6">
            {/* Form to add a new expense */}
            <AddExpenseForm onRecordAdded={triggerRefresh} />
          </div>
          <div className="col-md-6 mt-5">
            {/* Form to set a new budget */}
            <SetBudgetForm onBudgetAdded={triggerRefresh} />
          </div>
        </div>
        <div className="col-md-12">
          {/* List of all expenses */}
          <ExpenseList
            expenses={expenses}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* Modal for editing an expense */}
      <EditExpenseModal
        show={editModalVisible}
        expense={selectedExpense}
        onClose={() => setEditModalVisible(false)}
        onUpdate={triggerRefresh}
      />
    </div>
  )
}
