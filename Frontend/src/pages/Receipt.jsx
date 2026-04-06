import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Receipt() {
    const { token } = useAuth();
    const [list, setList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        receiptNo: "",
        receiptDate: "",
        opdID: "",
        amountPaid: "",
        paymentModeID: "",
        referenceNo: "",
        referenceDate: "",
        description: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fetchReceipt = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3001/receipt', {
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
        if (token) fetchReceipt();
        // eslint-disable-next-line
    }, [token]);

    const save = async () => {
        if (!form.opdID || !form.amountPaid) {
            alert("OPD ID and Amount Paid are required");
            return;
        }

        try {
            if (editIndex !== null) {
                await fetch(`http://localhost:3001/receipt/edit/${list[editIndex]._id}`, {
                    method: "PATCH",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
                setEditIndex(null);
            } else {
                await fetch('http://localhost:3001/receipt/add', {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
            }
            fetchReceipt();
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
            receiptNo: "",
            receiptDate: "",
            opdID: "",
            amountPaid: "",
            paymentModeID: "",
            referenceNo: "",
            referenceDate: "",
            description: "",
        });
    };

    const remove = async (id, index) => {
        if (window.confirm("Are you sure you want to delete this receipt?")) {
            try {
                await fetch('http://localhost:3001/receipt/delete/' + id, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                fetchReceipt();
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
                        <i className="bi bi-receipt-cutoff text-primary me-2"></i>Receipt Management
                    </h2>
                    <p className="text-muted mb-0">Create and manage patient transaction receipts.</p>
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
                                {editIndex !== null ? "Edit Receipt" : "New Receipt"}
                            </h5>
                        </div>

                        <div className="card-body p-4 bg-light bg-opacity-50">
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">OPD ID <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control rounded-3"
                                        placeholder="ID"
                                        name="opdID"
                                        value={form.opdID}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Receipt No</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="No."
                                        name="receiptNo"
                                        value={form.receiptNo}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Receipt Date</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control rounded-3"
                                        name="receiptDate"
                                        value={form.receiptDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Amount Paid <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 text-success fw-bold">$</span>
                                        <input
                                            type="number"
                                            className="form-control rounded-end-3 border-start-0 ps-0 text-success fw-bold"
                                            placeholder="0.00"
                                            name="amountPaid"
                                            value={form.amountPaid}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Pay Mode ID</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-3"
                                        placeholder="ID"
                                        name="paymentModeID"
                                        value={form.paymentModeID}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Ref. No</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="Optional"
                                        name="referenceNo"
                                        value={form.referenceNo}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Ref. Date</label>
                                    <input
                                        type="date"
                                        className="form-control rounded-3"
                                        name="referenceDate"
                                        value={form.referenceDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Description</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows="3"
                                        placeholder="Notes..."
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card-footer bg-white border-top p-4 d-flex gap-2">
                            <button className="btn btn-primary flex-grow-1 fw-bold rounded-pill" onClick={save}>
                                <i className={`bi ${editIndex !== null ? 'bi-check-circle' : 'bi-save'} me-2`}></i> {editIndex !== null ? 'Update Receipt' : 'Save Receipt'}
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
                                    <p className="mb-0">Loading receipts...</p>
                                </div>
                            ) : list.length === 0 ? (
                                <div className="text-center p-5 text-muted">
                                    <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                                        <i className="bi bi-cash-coin fs-1 opacity-50"></i>
                                    </div>
                                    <h6 className="fw-bold">No receipts found</h6>
                                    <p className="small mb-0">Generate a new transaction using the form.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3 text-secondary" style={{ width: '60px' }}>#</th>
                                                <th className="py-3 text-secondary">Receipt Info</th>
                                                <th className="py-3 text-secondary">Reference</th>
                                                <th className="py-3 text-secondary">Amount</th>
                                                <th className="px-4 py-3 text-end text-secondary">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-top-0">
                                            {list.map((r, i) => (
                                                <tr key={r._id || i} style={{ transition: 'all 0.2s' }}>
                                                    <td className="px-4 text-muted fw-bold small">{i + 1}</td>
                                                    <td>
                                                        <div className="fw-bold text-dark">{r.receiptNo || "N/A"}</div>
                                                        <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                                                            {r.receiptDate ? new Date(r.receiptDate).toLocaleString() : 'No date'}
                                                        </small>
                                                    </td>
                                                    <td style={{ fontSize: '0.85rem' }}>
                                                        <div className="mb-1"><span className="fw-semibold text-dark">OPD ID:</span> {r.opdID}</div>
                                                        {r.referenceNo && <div className="text-muted text-truncate" style={{ maxWidth: '100px' }} title={r.referenceNo}>Ref: {r.referenceNo}</div>}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column align-items-start">
                                                            <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success px-2 py-1 rounded-pill mb-1">
                                                                ${r.amountPaid}
                                                            </span>
                                                            <span className="text-muted" style={{ fontSize: '0.65rem' }}>Mode: {r.paymentModeID || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 text-end">
                                                        <div className="btn-group shadow-sm">
                                                            <button className="btn btn-sm btn-light border text-primary" onClick={() => edit(i)} title="Edit">
                                                                <i className="bi bi-pencil-square"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-light border text-danger" onClick={() => remove(r._id, i)} title="Delete">
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

export default Receipt;
