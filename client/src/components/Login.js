import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/styleLogin.css"; // Importation du fichier CSS
import OFPPT_Logo from "../images/OFPPT_Logo.png";

const Login = ({ updateRole }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                formData
            );

            const token = response.data.authorisation.token;
            const role = response.data.user.role;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({ role: role }));

            updateRole(role); // Update role in App.js

            if (role === "Directeur") {
                navigate("/directeur");
            } else if (role === "Surveillance") {
                navigate("/surveillance");
            } else {
                navigate("/");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setValidationErrors({
                    email: [
                        "Adresse e-mail ou mot de passe invalide. Veuillez réessayer.",
                    ],
                });
            } else {
                const responseData = error.response.data;
                setValidationErrors(responseData);
            }
        }
    };

    return (
        <div className="body">
            <div className="login-container">
                <div className="container">
                    <h2>Gestion d'absence des stagiaires</h2>
                    <img src={OFPPT_Logo} alt="ista_logo" className="logo" />
                    <form method="POST" onSubmit={handleSubmit}>
                        {validationErrors.email && (
                            <span className="error-message">
                                {validationErrors.email[0]}
                            </span>
                        )}

                        <input
                            type="text"
                            name="email"
                            placeholder="Enter Email"
                            onChange={handleChange}
                        />

                        {validationErrors.password && (
                            <span className="error-message">
                                {validationErrors.password[0]}
                            </span>
                        )}

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            onChange={handleChange}
                        />

                        <button type="submit">log in </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
