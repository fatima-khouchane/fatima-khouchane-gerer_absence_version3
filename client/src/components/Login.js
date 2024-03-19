import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/styleLogin.css"; // Importation du fichier CSS
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importation des icônes

const Login = ({ updateRole }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false); // State pour afficher/masquer le mot de passe
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

            updateRole(role); // Mise à jour du rôle dans App.js

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
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="body">
            <div className="login-container">
                <div className="container">
                    <h2>Gestion d'absence des stagiaires</h2>
                    <img src={OFPPT_Logo} alt="ista_logo" className="logo" />
                    <form method="POST" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter Email"
                            onChange={handleChange}
                        />

                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter Password"
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="toggle-password"
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>

                        <button type="submit">log in </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
