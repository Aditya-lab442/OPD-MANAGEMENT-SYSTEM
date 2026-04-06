import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Hospital() {
  const { token } = useAuth();
  const [list, setList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    hospitalName: "",
    address: "",
    registrationCharge: "",
    openingDate: "",
    openingPatientNo: "",
    openingOPDNo: "",
    openingReceiptNo: "",
    description: "",
    defaultPaymentModeID: "",
    registrationValidityMonths: "",
    isRateEnableInReceipt: false,
    isRegistrationFeeEnableInOPD: false,
  });

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/hospital', {
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
    if (token) {
      fetchHospitals();
    }
    // eslint-disable-next-line
  }, [token]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const save = async () => {
    if (!form.hospitalName || !form.openingDate) {
      alert("Hospital Name and Opening Date are required");
      return;
    }

    try {
      if (editIndex !== null) {
        await fetch(`http://localhost:3001/hospital/edit/${list[editIndex]._id}`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(form)
        });
        setEditIndex(null);
      } else {
        await fetch('http://localhost:3001/hospital/add', {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(form)
        });
      }
      fetchHospitals();
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
      hospitalName: "",
      address: "",
      registrationCharge: "",
      openingDate: "",
      openingPatientNo: "",
      openingOPDNo: "",
      openingReceiptNo: "",
      description: "",
      defaultPaymentModeID: "",
      registrationValidityMonths: "",
      isRateEnableInReceipt: false,
      isRegistrationFeeEnableInOPD: false,
    });
  };

  const remove = async (id, index) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        await fetch('http://localhost:3001/hospital/delete/' + id, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        fetchHospitals();
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
                  <i className="bi bi-building text-primary me-2"></i>Hospital Master
              </h2>
              <p className="text-muted mb-0">Manage hospital details and configurations.</p>
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
                 {editIndex !== null ? "Edit Hospital" : "Add New Hospital"}
              </h5>
            </div>
            
            <div className="card-body p-4 bg-light bg-opacity-50">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small mb-1">Hospital Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    name="hospitalName"
                    value={form.hospitalName}
                    onChange={handleChange}
                    placeholder="e.g. City General"
                  />
                </div>

                <div className="col-sm-6">
                  <label className="form-label fw-semibold text-secondary small mb-1">Opening Date <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control rounded-3"
                    name="openingDate"
                    value={form.openingDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-6">
                  <label className="form-label fw-semibold text-secondary small mb-1">Reg. Charge ($)</label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    name="registrationCharge"
                    value={form.registrationCharge}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>

                <div className="col-sm-4">
                  <label className="form-label fw-semibold text-secondary small mb-1">Pat. No</label>
                  <input type="number" className="form-control rounded-3" name="openingPatientNo" value={form.openingPatientNo} onChange={handleChange} placeholder="0" />
                </div>
                <div className="col-sm-4">
                  <label className="form-label fw-semibold text-secondary small mb-1">OPD No</label>
                  <input type="number" className="form-control rounded-3" name="openingOPDNo" value={form.openingOPDNo} onChange={handleChange} placeholder="0" />
                </div>
                <div className="col-sm-4">
                  <label className="form-label fw-semibold text-secondary small mb-1">Rcpt No</label>
                  <input type="number" className="form-control rounded-3" name="openingReceiptNo" value={form.openingReceiptNo} onChange={handleChange} placeholder="0" />
                </div>

                <div className="col-sm-6">
                  <label className="form-label fw-semibold text-secondary small mb-1">Def. Pay Mode</label>
                  <input type="number" className="form-control rounded-3" name="defaultPaymentModeID" value={form.defaultPaymentModeID} onChange={handleChange} placeholder="ID" />
                </div>

                <div className="col-sm-6">
                  <label className="form-label fw-semibold text-secondary small mb-1">Validity (Mo)</label>
                  <input type="number" className="form-control rounded-3" name="registrationValidityMonths" value={form.registrationValidityMonths} onChange={handleChange} placeholder="12" />
                </div>

                <div className="col-12">
                   <div className="bg-white p-3 rounded-3 border">
                      <div className="form-check form-switch mb-2">
                        <input className="form-check-input" type="checkbox" id="isRateEnableInReceipt" name="isRateEnableInReceipt" checked={form.isRateEnableInReceipt} onChange={handleChange} />
                        <label className="form-check-label small fw-semibold" htmlFor="isRateEnableInReceipt">Rate Enable in Receipt</label>
                      </div>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="isRegistrationFeeEnableInOPD" name="isRegistrationFeeEnableInOPD" checked={form.isRegistrationFeeEnableInOPD} onChange={handleChange} />
                        <label className="form-check-label small fw-semibold" htmlFor="isRegistrationFeeEnableInOPD">Reg. Fee Enable in OPD</label>
                      </div>
                   </div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small mb-1">Address</label>
                  <textarea className="form-control rounded-3" name="address" value={form.address} onChange={handleChange} rows="2" placeholder="Full street address"></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small mb-1">Description</label>
                  <textarea className="form-control rounded-3" name="description" value={form.description} onChange={handleChange} rows="2" placeholder="Optional notes"></textarea>
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
                        <p className="mb-0">Loading hospitals...</p>
                    </div>
                ) : list.length === 0 ? (
                    <div className="text-center p-5 text-muted">
                        <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                            <i className="bi bi-inbox fs-1 opacity-50"></i>
                        </div>
                        <h6 className="fw-bold">No hospitals found</h6>
                        <p className="small mb-0">Use the form to add a new hospital record.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                       <table className="table table-hover align-middle mb-0">
                           <thead className="bg-light">
                               <tr>
                                   <th className="px-4 py-3 text-secondary" style={{width: '60px'}}>#</th>
                                   <th className="py-3 text-secondary">Hospital Details</th>
                                   <th className="py-3 text-secondary">Configuration</th>
                                   <th className="py-3 text-secondary">Fees</th>
                                   <th className="px-4 py-3 text-end text-secondary">Actions</th>
                               </tr>
                           </thead>
                           <tbody className="border-top-0">
                               {list.map((h, i) => (
                                   <tr key={h._id || i} style={{ transition: 'all 0.2s' }}>
                                       <td className="px-4 text-muted fw-bold small">{i + 1}</td>
                                       <td>
                                           <div className="d-flex align-items-center my-2">
                                               <div className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bolder d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                                                   {h.hospitalName.charAt(0).toUpperCase()}
                                               </div>
                                               <div>
                                                   <h6 className="mb-1 fw-bold text-dark">{h.hospitalName}</h6>
                                                   <p className="mb-0 small text-muted"><i className="bi bi-geo-alt me-1"></i>{h.address || 'No address'}</p>
                                               </div>
                                           </div>
                                       </td>
                                       <td>
                                           <div className="small text-muted mb-1"><span className="fw-semibold text-dark">Opened:</span> {h.openingDate}</div>
                                           <div className="small text-muted"><span className="fw-semibold text-dark">Validity:</span> {h.registrationValidityMonths} Mon</div>
                                       </td>
                                       <td>
                                           <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 mb-1 shadow-sm border border-success border-opacity-25">
                                               ${h.registrationCharge} Reg
                                           </span>
                                           <div className="d-flex gap-1 mt-1">
                                                {h.isRateEnableInReceipt && <span className="badge bg-light text-secondary border border-secondary border-opacity-25" style={{fontSize: '0.65rem'}}>Rate</span>}
                                                {h.isRegistrationFeeEnableInOPD && <span className="badge bg-light text-secondary border border-secondary border-opacity-25" style={{fontSize: '0.65rem'}}>Fee</span>}
                                           </div>
                                       </td>
                                       <td className="px-4 text-end">
                                           <div className="btn-group shadow-sm">
                                               <button className="btn btn-sm btn-light border text-primary" onClick={() => edit(i)} title="Edit">
                                                   <i className="bi bi-pencil-square"></i>
                                               </button>
                                               <button className="btn btn-sm btn-light border text-danger" onClick={() => remove(h._id, i)} title="Delete">
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

export default Hospital;
