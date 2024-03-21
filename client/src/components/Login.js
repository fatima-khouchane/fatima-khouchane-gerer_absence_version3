import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/styleLogin.css"; 
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import { MdVisibility, MdVisibilityOff } from "react-icons/md"; 

const Login = ({ updateRole }) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
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

            updateRole(role); 

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

    const toggleVisibility = () => {
        setVisible((prevVisible) => !prevVisible);
    };
    return (
        <div className="body">
            <div className="login-container">
                <div className="container">
                    <h2>Gestion d'absence des stagiaires</h2>
                    <img src={OFPPT_Logo} alt="ista_logo" className="logo" />
                    <form method="POST" onSubmit={handleSubmit}>
                        {validationErrors.email && (
                            <div className="error-message">
                                {validationErrors.email[0]}
                            </div>
                        )}
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter Email"
                            onChange={handleChange}
                        />
                        {validationErrors.password && (
                            <div className="error-message">
                                {validationErrors.password[0]}
                            </div>
                        )}
                        <div className="password-input-container">
                            <input
                                type={visible ? "text" : "password"}
                                name="password"
                                placeholder="Enter Password"
                                onChange={handleChange}
                            />
                            <div
                                className="visibility-icon"
                                onClick={toggleVisibility}
                            >
                                {visible ? (
                                    <MdVisibility />
                                ) : (
                                    <MdVisibilityOff />
                                )}
                            </div>
                        </div>

                        <button type="submit">log in </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
