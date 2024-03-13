import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/styleLogin.css"; // Importation du fichier CSS

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
    <>
      <div className="container">
        <div className="wrapper">
          <div className="title">
            <span>Login </span>
          </div>
          <form method="POST" onSubmit={handleSubmit}>
            {validationErrors.email && (
              <span className="error-message">{validationErrors.email[0]}</span>
            )}
            <div className="row">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="email"
                placeholder="Enter Email"
                onChange={handleChange}
              />
            </div>
            {validationErrors.password && (
              <span className="error-message">
                {validationErrors.password[0]}
              </span>
            )}
            <div className="row">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                onChange={handleChange}
              />
            </div>

            <div className="row button">
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
