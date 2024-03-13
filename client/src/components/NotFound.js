import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../styles/styleNotFound.css"; // Importation du fichier CSS
import notFound from "../images/notFound.png";

const NotFound = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserDetails(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Authentication Failed",
            text: "Please log in again.",
          }).then(() => {
            navigate("/");
          });
        } else {
          console.error("Error fetching user details:", error);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div className="containerN">
      <img src={notFound} alt="Description de votre image" />
    </div>
  );
};

export default NotFound;
