import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function SubTreatmentType() {
    const { token } = useAuth();
    const [list, setList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        subTreatmentTypeName: "",
        treatmentTypeID: "",
        rate: "",
        isActive: true,
        accountID: "",
        description: "",
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const fetchSubTreatment = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3001/subtreatment', {
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
        if (token) fetchSubTreatment();
        // eslint-disable-next-line
    }, [token]);

    const save = async () => {
        if (!form.subTreatmentTypeName || !form.treatmentTypeID) {
            alert("Sub Treatment Name and Treatment Type ID are required");
            return;
        }

        try {
            if (editIndex !== null) {
                await fetch(`http://localhost:3001/subtreatment/edit/${list[editIndex]._id}`, {
                    method: "PATCH",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
                setEditIndex(null);
            } else {
                await fetch('http://localhost:3001/subtreatment/add', {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
            }
            fetchSubTreatment();
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
            subTreatmentTypeName: "",
            treatmentTypeID: "",
            rate: "",
            isActive: true,
            accountID: "",
            description: "",
        });
    };

    const remove = async (id, index) => {
        if (window.confirm("Are you sure you want to delete this sub-treatment?")) {
            try {
                await fetch('http://localhost:3001/subtreatment/delete/' + id, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                fetchSubTreatment();
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
                        <i className="bi bi-diagram-3-fill text-primary me-2"></i>Sub Treatment Types
                    </h2>
                    <p className="text-muted mb-0">Manage specific treatment procedures and rates.</p>
                </div>
            </div>

            <div className="row g-4">
                {/* Form Column */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{ top: '90px', zIndex: 1 }}>
                        <div className="card-header bg-white border-bottom p-4">
                            <h5 className="fw-bold text-primary mb-0 d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded p-2 me-2">
                                    <i className={`bi ${editIndex !== null ? 'bi-pencil-square' : 'bi-node-plus'}`}></i>
                                </div>
                                {editIndex !== null ? "Edit Sub Treatment" : "New Sub Treatment"}
                            </h5>
                        </div>

                        <div className="card-body p-4 bg-light bg-opacity-50">
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Treatment ID <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control rounded-3"
                                        placeholder="ID"
                                        name="treatmentTypeID"
                                        value={form.treatmentTypeID}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Account ID</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-3"
                                        placeholder="Optional"
                                        name="accountID"
                                        value={form.accountID}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Sub Treatment Name <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="e.g. Laser Surgery"
                                        name="subTreatmentTypeName"
                                        value={form.subTreatmentTypeName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-8">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Rate ($)</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-3"
                                        placeholder="0.00"
                                        name="rate"
                                        value={form.rate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-4 d-flex align-items-end mb-2">
                                    <div className="form-check form-switch w-100 bg-white p-2 border rounded-3 text-center">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isActive"
                                            name="isActive"
                                            checked={form.isActive}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label fw-semibold small" htmlFor="isActive">
                                            Active
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Description</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows="3"
                                        placeholder="Details..."
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
                                    <p className="mb-0">Loading sub-treatments...</p>
                                </div>
                            ) : list.length === 0 ? (
                                <div className="text-center p-5 text-muted">
                                    <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                                        <i className="bi bi-diagram-2 fs-1 opacity-50"></i>
                                    </div>
                                    <h6 className="fw-bold">No sub treatment types found</h6>
                                    <p className="small mb-0">Create a new record using the form.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3 text-secondary" style={{ width: '60px' }}>#</th>
                                                <th className="py-3 text-secondary">Sub Info</th>
                                                <th className="py-3 text-secondary">Context</th>
                                                <th className="py-3 text-secondary">Stats</th>
                                                <th className="px-4 py-3 text-end text-secondary">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-top-0">
                                            {list.map((item, i) => (
                                                <tr key={item._id || i} style={{ transition: 'all 0.2s' }}>
                                                    <td className="px-4 text-muted fw-bold small">{i + 1}</td>
                                                    <td>
                                                        <div className="fw-bold text-dark">{item.subTreatmentTypeName}</div>
                                                        {item.description && <small className="text-muted d-block text-truncate" style={{ maxWidth: '150px' }}>{item.description}</small>}
                                                    </td>
                                                    <td style={{ fontSize: '0.85rem' }}>
                                                        <div className="mb-1"><span className="fw-semibold text-dark">Treat ID:</span> {item.treatmentTypeID}</div>
                                                        {item.accountID && <div><span className="fw-semibold text-dark">Acc ID:</span> {item.accountID}</div>}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column align-items-start">
                                                            <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success px-2 py-1 rounded-pill mb-1">
                                                                ${item.rate}
                                                            </span>
                                                            {item.isActive ? (
                                                                <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-0 border border-primary border-opacity-25 rounded-pill" style={{ fontSize: '0.65rem' }}>Active</span>
                                                            ) : (
                                                                <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-0 border border-danger border-opacity-25 rounded-pill" style={{ fontSize: '0.65rem' }}>Inactive</span>
                                                            )}
                                                        </div>
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

export default SubTreatmentType;
