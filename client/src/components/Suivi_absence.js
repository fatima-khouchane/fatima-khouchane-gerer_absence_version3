import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import axios from "axios";
import "../styles/styleSurveillance.css";

const Suivi_absence = () => {
    const navigate = useNavigate();
    const [stagiaires, setStagiaires] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
        };
        fetchUserDetails();

        axios
            .get(
                "http://localhost:8000/api/getStagiairesWithAbsencesAndSanctions"
            )
            .then((response) => {
                setStagiaires(response.data.stagiaires);
            })
            .catch((error) => {
                console.error(
                    "Une erreur s'est produite lors de la récupération des données :",
                    error
                );
            });
    }, []);
    console.log(stagiaires);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <>
            <input type="checkbox" id="menu-toggle" />
            <div className="sidebar">
                <div className="side-header">
                    <img src={OFPPT_Logo} alt="logo_ofppt" className="logo" />
                </div>

                <div className="side-content">
                    <div className="profile">
                        <div
                            className="profile-img bg-img"
                            style={{ backgroundImage: "url('.jpeg')" }}
                        ></div>

                        <h4>Espace</h4>
                        <small>Directeur</small>
                    </div>

                    <div className="side-menu">
                        <ul>
                            <li>
                                <Link to="/surveillance" className="active">
                                    <span className="las la-home"></span>
                                    <small>Saisir absence</small>
                                </Link>
                            </li>
                            <li>
                                <Link to="/suivi_absence">
                                    <span className="las la-user-alt"></span>
                                    <small>Suivi absence</small>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <header>
                    <div className="header-content">
                        <label htmlFor="menu-toggle">
                            <span className="las la-bars"></span>
                        </label>

                        <div className="header-menu">
                            <div className="user">
                                <div className="bg-img"></div>

                                <span className="las la-power-off"></span>
                                <span>
                                    <button
                                        className="btn_logout"
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            navigate("/");
                                        }}
                                    >
                                        Déconnexion
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <main>
                    <div className="page-header">
                        <h1>Suivi absence</h1>
                    </div>

                    <div className="page-content">
                        <div className="records table-responsive">
                            <div className="record-header">
                                <div className="browse">
                                    <input
                                        type="search"
                                        placeholder="Search"
                                        className="record-search"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                            <table width="100%">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Prénom</th>
                                        <th>Email</th>
                                        <th>Téléphone</th>
                                        <th>Groupe</th>
                                        <th>Filière</th>
                                        <th>Total Absences</th>
                                        <th>Type Sanction</th>
                                        <th>Contacter stagiaire</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stagiaires
                                        .filter((stagiaire) =>
                                            `${stagiaire.nom} ${stagiaire.prenom} ${stagiaire.type_sanction} ${stagiaire.nom_filiere}`
                                                .toLowerCase()
                                                .includes(
                                                    searchTerm.toLowerCase()
                                                )
                                        )
                                        .map((stagiaire, index) => (
                                            <tr key={index}>
                                                <td>{stagiaire.nom}</td>
                                                <td>{stagiaire.prenom}</td>
                                                <td>{stagiaire.email}</td>
                                                <td>{stagiaire.telephone}</td>
                                                <td>
                                                    {stagiaire.numero_groupe}
                                                </td>
                                                <td>{stagiaire.nom_filiere}</td>
                                                <td>
                                                    {stagiaire.total_absences}
                                                </td>
                                                <td>
                                                    {stagiaire.type_sanction}
                                                </td>
                                                <td>
                                                    <button className="btn_email">
                                                        Email
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>{" "}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Suivi_absence;
