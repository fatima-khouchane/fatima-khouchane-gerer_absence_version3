import { useEffect, useState } from "react";
import React from "react";
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const Statistique = () => {
    const navigate = useNavigate();
    const [anneeScolaire, setAnneeScolaire] = useState("");
    const [totalStagiaires, setTotalStagiaires] = useState(0);
    const [totalFilieres, setTotalFilieres] = useState(0);
    const [totalExclusions, setTotalExclusions] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        const dateActuelle = new Date();
        const annee = dateActuelle.getFullYear();
        const anneeScolaireDefaut = `${annee}`;

        setAnneeScolaire(anneeScolaireDefaut);
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
            }
        };
        fetchUserDetails();
    }, [navigate]);

    const handleAnneeScolaireChange = (e) => {
        setAnneeScolaire(e.target.value);
    };

    useEffect(() => {
        const fetchStagiaires = async () => {
            if (anneeScolaire === "") {
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8000/api/dashboard_statistique`,
                    {
                        params: { promotion: anneeScolaire },
                    }
                );
                if (response.status === 200) {
                    const { totalStagiaires, totalFilieres, totalExclusions } =
                        response.data;
                    setTotalStagiaires(totalStagiaires);
                    setTotalFilieres(totalFilieres);
                    setTotalExclusions(totalExclusions);
                    setError("");
                } else {
                    throw new Error("Failed to fetch data");
                }
            } catch (error) {
                setError(
                    "Aucune donnée disponible pour l'année scolaire spécifiée."
                );
            }
        };

        fetchStagiaires();
    }, [anneeScolaire]);
    console.log(totalExclusions, totalFilieres, totalStagiaires);
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
                                <Link to="/directeur" className="active">
                                    <span className="las la-home"></span>
                                    <small>Dashboard</small>
                                </Link>
                            </li>
                            <li>
                                <Link to="/statistique">
                                    <span className="las la-user-alt"></span>
                                    <small>Statistique</small>
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
                        <h1>Statistique</h1>
                        {/* <!-- <small>Home / Dashboard</small> --> */}
                        <div className="browse">
                            <input
                                type="search"
                                placeholder="Année scolaire"
                                className="record-search"
                                value={anneeScolaire}
                                onChange={handleAnneeScolaireChange}
                            />
                        </div>
                    </div>

                    <div className="page-content">
                        {error && (
                            <p
                                style={{
                                    color: "red",
                                    fontSize: "1.2rem",
                                    textAlign: "center",
                                }}
                            >
                                {error}
                            </p>
                        )}
                        {!error && (
                            <div className="analytics">
                                <div className="card">
                                    <div className="card-head">
                                        <h2>{totalStagiaires}</h2>
                                        <span className="las la-user-friends"></span>
                                    </div>
                                    <div className="card-progress">
                                        <small>somme des stagiaires</small>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-head">
                                        <h2>{totalFilieres}</h2>
                                        <span className="las la-user-friends"></span>
                                    </div>
                                    <div className="card-progress">
                                        <small>somme des filières</small>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-head">
                                        <h2>{totalExclusions}</h2>
                                        <span className="las la-user-friends"></span>
                                    </div>
                                    <div className="card-progress">
                                        <small>
                                            somme des stagiaires exclus
                                            définitivement
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="records table-responsive">
                            <div className="record-header"></div>

                            <div></div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Statistique;
