import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function TreatmentType() {
    const { token } = useAuth();
    const [list, setList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        treatmentTypeName: "",
        treatmentTypeShortName: "",
        hospitalID: "",
        description: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fetchTreatment = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3001/treatmenttype', {
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
        if (token) fetchTreatment();
        // eslint-disable-next-line
    }, [token]);

    const save = async () => {
        if (!form.treatmentTypeName || !form.hospitalID) {
            alert("Treatment Name and Hospital ID are required");
            return;
        }

        try {
            if (editIndex !== null) {
                await fetch(`http://localhost:3001/treatmenttype/edit/${list[editIndex]._id}`, {
                    method: "PATCH",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
                setEditIndex(null);
            } else {
                await fetch('http://localhost:3001/treatmenttype/add', {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
            }
            fetchTreatment();
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
            treatmentTypeName: "",
            treatmentTypeShortName: "",
            hospitalID: "",
            description: "",
        });
    };

    const remove = async (id, index) => {
        if (window.confirm("Are you sure you want to delete this treatment type?")) {
            try {
                await fetch('http://localhost:3001/treatmenttype/delete/' + id, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                fetchTreatment();
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
                        <i className="bi bi-bandaid text-primary me-2"></i>Treatment Types
                    </h2>
                    <p className="text-muted mb-0">Manage various treatment categories.</p>
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
                                {editIndex !== null ? "Edit Treatment Type" : "New Treatment Type"}
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
                                    <label className="form-label fw-semibold text-secondary small mb-1">Treatment Name <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="e.g. Physiotherapy"
                                        name="treatmentTypeName"
                                        value={form.treatmentTypeName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Short Name</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="e.g. PT"
                                        name="treatmentTypeShortName"
                                        value={form.treatmentTypeShortName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Description</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows="3"
                                        placeholder="Details about this treatment..."
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
                            <h5 className="fw-bold mb-0">Record List</h5>
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 border border-primary border-opacity-25 shadow-sm">
                                {list.length} Total
                            </span>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center p-5 text-muted">
                                    <div className="spinner-border text-primary mb-3" role="status"></div>
                                    <p className="mb-0">Loading treatments...</p>
                                </div>
                            ) : list.length === 0 ? (
                                <div className="text-center p-5 text-muted">
                                    <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                                        <i className="bi bi-folder2-open fs-1 opacity-50"></i>
                                    </div>
                                    <h6 className="fw-bold">No treatment types found</h6>
                                    <p className="small mb-0">Use the form to add a new category.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3 text-secondary" style={{ width: '60px' }}>#</th>
                                                <th className="py-3 text-secondary">Treatment</th>
                                                <th className="py-3 text-secondary">Short</th>
                                                <th className="py-3 text-secondary">Hosp ID</th>
                                                <th className="px-4 py-3 text-end text-secondary">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-top-0">
                                            {list.map((item, i) => (
                                                <tr key={item._id || i} style={{ transition: 'all 0.2s' }}>
                                                    <td className="px-4 text-muted fw-bold small">{i + 1}</td>
                                                    <td>
                                                        <div className="fw-bold text-dark">{item.treatmentTypeName}</div>
                                                        {item.description && <small className="text-muted d-block text-truncate" style={{ maxWidth: '150px' }}>{item.description}</small>}
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-light text-dark border px-2 py-1">{item.treatmentTypeShortName || "-"}</span>
                                                    </td>
                                                    <td className="text-muted fw-medium">{item.hospitalID}</td>
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

export default TreatmentType;
