import React, { useState, useEffect } from 'react'
import { Calendar, Eye, X, GripVertical } from 'lucide-react'
import api from '../../services/api'
import SelectionModeControls from '../../components/admin/SelectionModeControls'
import ActionsDropdown from '../../components/admin/ActionsDropdown'
import { useSelectionMode } from '../../hooks/useSelectionMode'

function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' })

  const {
    selectedItems,
    selectionMode,
    handleLongPressStart,
    handleLongPressEnd,
    handleRowClick,
    handleSelectAll: selectAll,
    handleClearSelection,
    toggleSelectionMode
  } = useSelectionMode()

  const handleView = (id, item) => {
    setSelectedAppointment(item)
    setStatusUpdate({ status: item.status || '', notes: item.notes || '' })
  }

  const handleSelectAll = () => {
    selectAll(appointments)
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await api.getAdminAppointments()
      setAppointments(response.data.results || response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId) => {
    if (!statusUpdate.status) {
      alert('Please select a status')
      return
    }

    try {
      await api.updateAppointmentStatus(appointmentId, statusUpdate.status, statusUpdate.notes)
      fetchAppointments()
      setSelectedAppointment(null)
      setStatusUpdate({ status: '', notes: '' })
    } catch (err) {
      alert('Failed to update: ' + err.message)
    }
  }

  if (loading) return <div className="loading">Loading appointments...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
        </div>

        <SelectionModeControls
          selectionMode={selectionMode}
          onToggle={toggleSelectionMode}
          onSelectAll={handleSelectAll}
          onClear={handleClearSelection}
          hasItems={appointments.length > 0}
        />

        {selectedItems.size > 0 && (
          <div className="admin-bulk-actions">
            <span>{selectedItems.size} item(s) selected</span>
            <ActionsDropdown
              onView={() => {
                const firstSelected = Array.from(selectedItems)[0]
                handleView(firstSelected, appointments.find(a => a.id === firstSelected))
              }}
              itemId={Array.from(selectedItems)[0]}
              item={appointments.find(a => a.id === Array.from(selectedItems)[0])}
            />
          </div>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '30px' }}></th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Matter Type</th>
                <th>Preferred Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map(appointment => (
                  <tr
                    key={appointment.id}
                    className={`admin-table-row ${selectedItems.has(appointment.id) ? 'row-selected' : ''} ${selectionMode ? 'selection-mode' : ''}`}
                    onMouseDown={() => handleLongPressStart(appointment.id)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart(appointment.id)}
                    onTouchEnd={handleLongPressEnd}
                    onClick={(e) => {
                      handleRowClick(appointment.id, e, () => handleView(appointment.id, appointment))
                    }}
                  >
                    <td className="drag-handle">
                      <GripVertical size={18} />
                    </td>
                    <td>{appointment.name}</td>
                    <td>{appointment.email}</td>
                    <td>{appointment.phone}</td>
                    <td style={{ textTransform: 'capitalize' }}>{appointment.matter_type}</td>
                    <td>{new Date(appointment.preferred_date).toLocaleDateString()}</td>
                    <td>{appointment.preferred_time}</td>
                    <td>
                      <span className={`status-badge ${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedAppointment && (
          <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Appointment Details</h2>
                <button onClick={() => setSelectedAppointment(null)} className="modal-close">
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <p><strong>Name:</strong> {selectedAppointment.name}</p>
                <p><strong>Email:</strong> {selectedAppointment.email}</p>
                <p><strong>Phone:</strong> {selectedAppointment.phone}</p>
                <p><strong>Matter Type:</strong> {selectedAppointment.matter_type}</p>
                <p><strong>Preferred Date:</strong> {new Date(selectedAppointment.preferred_date).toLocaleDateString()}</p>
                <p><strong>Preferred Time:</strong> {selectedAppointment.preferred_time}</p>
                
                {selectedAppointment.message && (
                  <>
                    <p><strong>Message:</strong></p>
                    <p>{selectedAppointment.message}</p>
                  </>
                )}
                
                {selectedAppointment.notes && (
                  <>
                    <p><strong>Notes:</strong></p>
                    <p>{selectedAppointment.notes}</p>
                  </>
                )}

                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                  <h3>Update Status</h3>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      value={statusUpdate.notes}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                      placeholder="Add internal notes..."
                    />
                  </div>

                  <button
                    onClick={() => handleStatusUpdate(selectedAppointment.id)}
                    className="btn btn-primary"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAppointments
