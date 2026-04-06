import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Patient() {
    const { token } = useAuth();
    const [list, setList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        patientName: "",
        patientNo: "",
        hospitalID: "",
        registrationDateTime: "",
        age: "",
        bloodGroup: "",
        gender: "Male",
        mobileNo: "",
        emergencyContactNo: "",
        occupation: "",
        referredBy: "",
        address: "",
        stateID: "",
        cityID: "",
        pinCode: "",
        description: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fetchPatient = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3001/patient', {
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
        if (token) fetchPatient();
        // eslint-disable-next-line
    }, [token]);

    const save = async () => {
        if (!form.patientName || !form.hospitalID || !form.mobileNo) {
            alert("Name, Hospital ID, and Mobile No are required");
            return;
        }

        try {
            if (editIndex !== null) {
                await fetch(`http://localhost:3001/patient/edit/${list[editIndex]._id}`, {
                    method: "PATCH",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
                setEditIndex(null);
            } else {
                await fetch('http://localhost:3001/patient/add', {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
            }
            fetchPatient();
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
            patientName: "",
            patientNo: "",
            hospitalID: "",
            registrationDateTime: "",
            age: "",
            bloodGroup: "",
            gender: "Male",
            mobileNo: "",
            emergencyContactNo: "",
            occupation: "",
            referredBy: "",
            address: "",
            stateID: "",
            cityID: "",
            pinCode: "",
            description: "",
        });
    };

    const remove = async (id, index) => {
        if (window.confirm("Are you sure you want to delete this patient record?")) {
            try {
                await fetch('http://localhost:3001/patient/delete/' + id, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                fetchPatient();
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
                        <i className="bi bi-person-rolodex text-primary me-2"></i>Patient Registration
                    </h2>
                    <p className="text-muted mb-0">Register new patients and manage details.</p>
                </div>
            </div>

            <div className="row g-4">
                {/* Form Column */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{ top: '90px', zIndex: 1 }}>
                        <div className="card-header bg-white border-bottom p-4">
                            <h5 className="fw-bold text-primary mb-0 d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded p-2 me-2">
                                    <i className={`bi ${editIndex !== null ? 'bi-pencil-square' : 'bi-person-add'}`}></i>
                                </div>
                                {editIndex !== null ? "Edit Patient" : "New Patient"}
                            </h5>
                        </div>

                        <div className="card-body p-4 bg-light bg-opacity-50" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Hospital ID <span className="text-danger">*</span></label>
                                    <input type="number" className="form-control rounded-3" placeholder="ID" name="hospitalID" value={form.hospitalID} onChange={handleChange} />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Patient No</label>
                                    <input type="number" className="form-control rounded-3" placeholder="Auto" name="patientNo" value={form.patientNo} onChange={handleChange} />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Full Name <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-person"></i></span>
                                        <input type="text" className="form-control rounded-end-3 border-start-0 ps-0" placeholder="e.g. John Doe" name="patientName" value={form.patientName} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="col-sm-4">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Age</label>
                                    <input type="number" className="form-control rounded-3" placeholder="Yr" name="age" value={form.age} onChange={handleChange} />
                                </div>
                                <div className="col-sm-4">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Gender</label>
                                    <select className="form-select rounded-3" name="gender" value={form.gender} onChange={handleChange}>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="col-sm-4">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Blood</label>
                                    <input type="text" className="form-control rounded-3" placeholder="O+" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} />
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Mobile No <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-telephone"></i></span>
                                        <input type="text" className="form-control rounded-end-3 border-start-0 ps-0" placeholder="Primary" name="mobileNo" value={form.mobileNo} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Emergency</label>
                                    <input type="text" className="form-control rounded-3" placeholder="Emergency" name="emergencyContactNo" value={form.emergencyContactNo} onChange={handleChange} />
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Date & Time</label>
                                    <input type="datetime-local" className="form-control rounded-3" name="registrationDateTime" value={form.registrationDateTime} onChange={handleChange} />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Occupation</label>
                                    <input type="text" className="form-control rounded-3" placeholder="Job" name="occupation" value={form.occupation} onChange={handleChange} />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Address</label>
                                    <input type="text" className="form-control rounded-3" placeholder="Street Address" name="address" value={form.address} onChange={handleChange} />
                                </div>

                                <div className="col-sm-4">
                                    <label className="form-label fw-semibold text-secondary small mb-1">City ID</label>
                                    <input type="number" className="form-control rounded-3" name="cityID" value={form.cityID} onChange={handleChange} />
                                </div>
                                <div className="col-sm-4">
                                    <label className="form-label fw-semibold text-secondary small mb-1">State ID</label>
                                    <input type="number" className="form-control rounded-3" name="stateID" value={form.stateID} onChange={handleChange} />
                                </div>
                                <div className="col-sm-4">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Pin Code</label>
                                    <input type="text" className="form-control rounded-3" name="pinCode" value={form.pinCode} onChange={handleChange} />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Referred By</label>
                                    <input type="text" className="form-control rounded-3" placeholder="Doctor/Clinic" name="referredBy" value={form.referredBy} onChange={handleChange} />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary small mb-1">Description</label>
                                    <textarea className="form-control rounded-3" rows="2" placeholder="Notes..." name="description" value={form.description} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="card-footer bg-white border-top p-4 d-flex gap-2">
                            <button className="btn btn-primary flex-grow-1 fw-bold rounded-pill" onClick={save}>
                                <i className={`bi ${editIndex !== null ? 'bi-check-circle' : 'bi-save'} me-2`}></i> {editIndex !== null ? 'Update Record' : 'Register'}
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
                            <h5 className="fw-bold mb-0">Patient List</h5>
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 border border-primary border-opacity-25 shadow-sm">
                                {list.length} Total
                            </span>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center p-5 text-muted">
                                    <div className="spinner-border text-primary mb-3" role="status"></div>
                                    <p className="mb-0">Loading patients...</p>
                                </div>
                            ) : list.length === 0 ? (
                                <div className="text-center p-5 text-muted">
                                    <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                                        <i className="bi bi-person-exclamation fs-1 opacity-50"></i>
                                    </div>
                                    <h6 className="fw-bold">No patients found</h6>
                                    <p className="small mb-0">Use the form to register a new patient.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3 text-secondary" style={{ width: '60px' }}>#</th>
                                                <th className="py-3 text-secondary">Patient</th>
                                                <th className="py-3 text-secondary">Contact</th>
                                                <th className="py-3 text-secondary">Details</th>
                                                <th className="px-4 py-3 text-end text-secondary">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-top-0">
                                            {list.map((p, i) => (
                                                <tr key={p._id || i} style={{ transition: 'all 0.2s' }}>
                                                    <td className="px-4 text-muted fw-bold small">{i + 1}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                                                                {p.patientName ? p.patientName.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold text-dark">{p.patientName}</div>
                                                                <small className="text-muted">{p.age} yrs • {p.gender} {p.bloodGroup ? `• ${p.bloodGroup}` : ''}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontSize: '0.85rem' }}>
                                                        <div className="mb-1"><i className="bi bi-telephone text-primary me-2"></i>{p.mobileNo}</div>
                                                        {p.address && <div className="text-muted text-truncate" style={{ maxWidth: '150px' }} title={p.address}><i className="bi bi-geo-alt me-2 text-secondary"></i>{p.address}</div>}
                                                    </td>
                                                    <td style={{ fontSize: '0.85rem' }}>
                                                        <div className="mb-1"><span className="fw-semibold text-dark">No:</span> {p.patientNo}</div>
                                                        <div><span className="fw-semibold text-dark">Hosp ID:</span> {p.hospitalID}</div>
                                                    </td>
                                                    <td className="px-4 text-end">
                                                        <div className="btn-group shadow-sm">
                                                            <button className="btn btn-sm btn-light border text-primary" onClick={() => edit(i)} title="Edit">
                                                                <i className="bi bi-pencil-square"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-light border text-danger" onClick={() => remove(p._id, i)} title="Delete">
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

export default Patient;
