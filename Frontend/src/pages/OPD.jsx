import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function OPD() {
    const { token } = useAuth();
    const [list, setList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        opdNo: "",
        opdDateTime: "",
        patientID: "",
        isFollowUpCase: false,
        treatedByDoctorID: "",
        registrationFee: "",
        description: "",
        oldOPDNo: "",
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const fetchOPD = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3001/opd', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setList(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchOPD();
        // eslint-disable-next-line
    }, [token]);

    const save = async () => {
        if (!form.opdNo || !form.patientID) {
            alert("OPD No and Patient ID are required");
            return;
        }

        try {
            if (editIndex !== null) {
                await fetch(`http://localhost:3001/opd/edit/${list[editIndex]._id}`, {
                    method: "PATCH",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
                setEditIndex(null);
            } else {
                await fetch('http://localhost:3001/opd/add', {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
            }
            fetchOPD();
            cancelEdit();
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    const edit = (index) => {
        setForm(list[index]);
        setEditIndex(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditIndex(null);
        setForm({
            opdNo: "",
            opdDateTime: "",
            patientID: "",
            isFollowUpCase: false,
            treatedByDoctorID: "",
            registrationFee: "",
            description: "",
            oldOPDNo: "",
        });
    };

    const remove = async (id, index) => {
        if (window.confirm("Are you sure you want to delete this OPD record?")) {
            try {
                await fetch('http://localhost:3001/opd/delete/' + id, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                fetchOPD();
                if (editIndex === index) cancelEdit();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    return (
        <div className="animate-fade-in pb-5">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bolder mb-0 text-dark">
                        <i className="bi bi-clipboard-pulse text-primary me-2"></i>OPD Management
                    </h2>
                    <p className="text-muted mb-0">Register and manage Out Patient Department entries.</p>
                </div>
            </div>

            <div className="row g-4">
                {/* Form Column */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{ top: '90px', zIndex: 1 }}>
                        <div className="card-header bg-white border-bottom p-4">
                            <h5 className="fw-bold text-primary mb-0 d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded p-2 me-2">
                                    <i className={`bi ${editIndex !== null ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
                                </div>
                                {editIndex !== null ? "Edit OPD Entry" : "New OPD Entry"}
                            </h5>
                        </div>

                        <div className="card-body p-4 bg-light bg-opacity-50">
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">OPD No <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control rounded-3"
                                        placeholder="No."
                                        name="opdNo"
                                        value={form.opdNo}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Old OPD No</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="Optional"
                                        name="oldOPDNo"
                                        value={form.oldOPDNo}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control rounded-3"
                                        name="opdDateTime"
                                        value={form.opdDateTime}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Patient ID <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-person"></i></span>
                                        <input
                                            type="number"
                                            className="form-control rounded-end-3 border-start-0 ps-0"
                                            placeholder="ID"
                                            name="patientID"
                                            value={form.patientID}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Doctor ID</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-heart-pulse"></i></span>
                                        <input
                                            type="number"
                                            className="form-control rounded-end-3 border-start-0 ps-0"
                                            placeholder="ID"
                                            name="treatedByDoctorID"
                                            value={form.treatedByDoctorID}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Reg. Fee ($)</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-3"
                                        placeholder="0.00"
                                        name="registrationFee"
                                        value={form.registrationFee}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-6 d-flex align-items-end mb-2">
                                    <div className="form-check form-switch w-100 bg-white p-2 border rounded-3 text-center">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isFollowUpCase"
                                            name="isFollowUpCase"
                                            checked={form.isFollowUpCase}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label fw-semibold small" htmlFor="isFollowUpCase">
                                            Follow Up Case
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Description</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows="3"
                                        placeholder="Diagnosis notes..."
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card-footer bg-white border-top p-4 d-flex gap-2">
                            <button className="btn btn-primary flex-grow-1 fw-bold rounded-pill" onClick={save}>
                                <i className={`bi ${editIndex !== null ? 'bi-check-circle' : 'bi-save'} me-2`}></i> {editIndex !== null ? 'Update Entry' : 'Save Entry'}
                            </button>
                            {editIndex !== null && (
                                <button className="btn btn-light fw-bold rounded-pill border" onClick={cancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Column */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white border-bottom p-4 d-flex align-items-center justify-content-between text-dark">
                            <h5 className="fw-bold mb-0">OPD Records</h5>
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 border border-primary border-opacity-25 shadow-sm">
                                {list.length} Total
                            </span>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center p-5 text-muted">
                                    <div className="spinner-border text-primary mb-3" role="status"></div>
                                    <p className="mb-0">Loading OPD records...</p>
                                </div>
                            ) : list.length === 0 ? (
                                <div className="text-center p-5 text-muted">
                                    <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                                        <i className="bi bi-clipboard-x fs-1 opacity-50"></i>
                                    </div>
                                    <h6 className="fw-bold">No OPD records found</h6>
                                    <p className="small mb-0">Use the form to create a new entry.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3 text-secondary" style={{ width: '60px' }}>#</th>
                                                <th className="py-3 text-secondary">OPD Info</th>
                                                <th className="py-3 text-secondary">Medical IDs</th>
                                                <th className="py-3 text-secondary">Payment</th>
                                                <th className="px-4 py-3 text-end text-secondary">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-top-0">
                                            {list.map((item, i) => (
                                                <tr key={item._id || i} style={{ transition: 'all 0.2s' }}>
                                                    <td className="px-4 text-muted fw-bold small">{i + 1}</td>
                                                    <td>
                                                        <div className="fw-bold text-dark mb-1">OPD: {item.opdNo}</div>
                                                        <small className="text-muted d-block mb-1">
                                                            <i className="bi bi-clock me-1"></i>
                                                            {new Date(item.opdDateTime).toLocaleString()}
                                                        </small>
                                                        {item.isFollowUpCase && <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2 py-0 rounded-pill" style={{ fontSize: '0.65rem' }}>Follow Up</span>}
                                                    </td>
                                                    <td style={{ fontSize: '0.85rem' }}>
                                                        <div className="mb-1"><span className="fw-semibold text-dark">Pat ID:</span> {item.patientID}</div>
                                                        {item.treatedByDoctorID && <div className="mb-1"><span className="fw-semibold text-dark">Doc ID:</span> {item.treatedByDoctorID}</div>}
                                                        {item.oldOPDNo && <div className="text-muted text-truncate" style={{ maxWidth: '100px' }}><span className="fw-semibold">Old:</span> {item.oldOPDNo}</div>}
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success px-2 py-1 rounded-pill data-badge">
                                                            ${item.registrationFee || '0'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 text-end">
                                                        <div className="btn-group shadow-sm">
                                                            <button className="btn btn-sm btn-light border text-primary" onClick={() => edit(i)} title="Edit">
                                                                <i className="bi bi-pencil-square"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-light border text-danger" onClick={() => remove(item._id, i)} title="Delete">
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OPD;
