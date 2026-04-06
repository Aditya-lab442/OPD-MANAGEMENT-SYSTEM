import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Doctor() {
    const { token } = useAuth();
    const [list, setList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        doctorName: "",
        staffID: "",
        studentID: "",
        hospitalID: "",
        description: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fetchDoctor = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3001/doctor', {
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
        if (token) fetchDoctor();
        // eslint-disable-next-line
    }, [token]);

    const save = async () => {
        if (!form.doctorName || !form.hospitalID) {
            alert("Doctor Name and Hospital ID are required");
            return;
        }

        try {
            if (editIndex !== null) {
                await fetch(`http://localhost:3001/doctor/edit/${list[editIndex]._id}`, {
                    method: "PATCH",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
                setEditIndex(null);
            } else {
                await fetch('http://localhost:3001/doctor/add', {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
            }
            fetchDoctor();
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
            doctorName: "",
            staffID: "",
            studentID: "",
            hospitalID: "",
            description: "",
        });
    };

    const remove = async (id, index) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            try {
                await fetch('http://localhost:3001/doctor/delete/' + id, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                fetchDoctor();
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
                        <i className="bi bi-person-lines-fill text-primary me-2"></i>Doctor Master
                    </h2>
                    <p className="text-muted mb-0">Manage doctors and staff IDs.</p>
                </div>
            </div>

            <div className="row g-4">
                {/* Form Column */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{ top: '90px', zIndex: 1 }}>
                        <div className="card-header bg-white border-bottom p-4">
                            <h5 className="fw-bold text-primary mb-0 d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded p-2 me-2">
                                    <i className={`bi ${editIndex !== null ? 'bi-pencil-square' : 'bi-person-plus'}`}></i>
                                </div>
                                {editIndex !== null ? "Edit Doctor" : "Add New Doctor"}
                            </h5>
                        </div>

                        <div className="card-body p-4 bg-light bg-opacity-50">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Hospital ID <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control rounded-3"
                                        placeholder="e.g. 1"
                                        name="hospitalID"
                                        value={form.hospitalID}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Doctor Name <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="e.g. Dr. Aditya"
                                        name="doctorName"
                                        value={form.doctorName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Staff ID</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-3"
                                        placeholder="Optional"
                                        name="staffID"
                                        value={form.staffID}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Student ID</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-3"
                                        placeholder="Optional"
                                        name="studentID"
                                        value={form.studentID}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Description</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows="3"
                                        placeholder="Specialization, notes..."
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card-footer bg-white border-top p-4 d-flex gap-2">
                            <button className="btn btn-primary flex-grow-1 fw-bold rounded-pill" onClick={save}>
                                <i className={`bi ${editIndex !== null ? 'bi-check-circle' : 'bi-save'} me-2`}></i> {editIndex !== null ? 'Update Record' : 'Save Record'}
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
                            <h5 className="fw-bold mb-0">Registered Doctors</h5>
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 border border-primary border-opacity-25 shadow-sm">
                                {list.length} Total
                            </span>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center p-5 text-muted">
                                    <div className="spinner-border text-primary mb-3" role="status"></div>
                                    <p className="mb-0">Loading doctors...</p>
                                </div>
                            ) : list.length === 0 ? (
                                <div className="text-center p-5 text-muted">
                                    <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                                        <i className="bi bi-person-x fs-1 opacity-50"></i>
                                    </div>
                                    <h6 className="fw-bold">No doctors registered yet</h6>
                                    <p className="small mb-0">Add a new profile to get started.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3 text-secondary" style={{ width: '60px' }}>#</th>
                                                <th className="py-3 text-secondary">Doctor Name</th>
                                                <th className="py-3 text-secondary">IDs</th>
                                                <th className="py-3 text-secondary">Notes</th>
                                                <th className="px-4 py-3 text-end text-secondary">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-top-0">
                                            {list.map((doc, i) => (
                                                <tr key={doc._id || i} style={{ transition: 'all 0.2s' }}>
                                                    <td className="px-4 text-muted fw-bold small">{i + 1}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center my-1">
                                                            <div className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bolder d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                                                {doc.doctorName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="fw-bold text-dark">{doc.doctorName}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontSize: '0.85rem' }}>
                                                        <div className="text-muted mb-1"><span className="fw-semibold text-dark">HospID:</span> {doc.hospitalID}</div>
                                                        {doc.staffID && <div className="text-muted mb-1"><span className="fw-semibold text-dark">StaffID:</span> {doc.staffID}</div>}
                                                        {doc.studentID && <div className="text-muted"><span className="fw-semibold text-dark">StuID:</span> {doc.studentID}</div>}
                                                    </td>
                                                    <td>
                                                        {doc.description ? (
                                                            <small className="text-muted d-block text-truncate" style={{ maxWidth: '150px' }}>{doc.description}</small>
                                                        ) : (
                                                            <span className="text-muted">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 text-end">
                                                        <div className="btn-group shadow-sm">
                                                            <button className="btn btn-sm btn-light border text-primary" onClick={() => edit(i)} title="Edit">
                                                                <i className="bi bi-pencil-square"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-light border text-danger" onClick={() => remove(doc._id, i)} title="Delete">
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

export default Doctor;
