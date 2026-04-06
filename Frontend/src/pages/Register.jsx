import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        role: 'Patient',
        password: '',
        email: '',
        confirmPassword: '',

    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = () => {
        //   e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        fetch("http://localhost:3001/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                console.log("Registered:", data);
                alert("Registration successful!");
                navigate("/");
            })
            .catch(err => {
                console.log(err);
                setError("Registration failed");
            });
    };




    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #e0f2fe 10%, #bfdbfe 100%)' }}>
            <div className="card shadow-lg border-0 animate-fade-in" style={{ maxWidth: '500px', width: '100%', borderRadius: '24px' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
                            <i className="bi bi-person-plus text-primary fs-1"></i>
                        </div>
                        <h2 className="fw-bold text-dark">Create Account</h2>
                        <p className="text-muted">Join the OPD Management System</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger border-0 rounded-3 small mb-4 py-2">
                            <i className="bi bi-exclamation-circle me-2"></i>{error}
                        </div>
                    )}

                    <form>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold mb-1 small">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control form-control-modern py-2"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold mb-1 small">Role</label>
                                <select
                                    name="role"
                                    className="form-select form-control-modern py-2"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="Doctor">Doctor</option>
                                    <option value="Patient">Patient</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold mb-1 small">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-modern py-2"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold mb-1 small">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-modern py-2"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold mb-1 small">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control form-control-modern py-2"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" onClick={handleRegister} className="btn btn-modern-primary w-100 py-3 mt-2">
                            Sign Up
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted small mb-0">Already have an account? <Link to="/" className="text-primary fw-bold text-decoration-none">Login here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
