import { useEffect } from "react";
import React from "react";
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import { Link, useNavigate } from "react-router-dom";

const Statistique = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserDetails = async () => {
            // try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
        };
        fetchUserDetails();
    }, []);
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
                        <label for="menu-toggle">
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
                    </div>

                    <div className="page-content">
                        <div className="analytics">
                            <div className="card">
                                <div className="card-head">
                                    <h2>107,200</h2>
                                    <span className="las la-user-friends"></span>
                                </div>
                                <div className="card-progress">
                                    <small>somme des stagiaires</small>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-head">
                                    <h2>340,230</h2>
                                    <span className="las la-eye"></span>
                                </div>
                                <div className="card-progress">
                                    <small>somme des filieres</small>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-head">
                                    <h2>653,200</h2>
                                    <span className="las la-shopping-cart"></span>
                                </div>
                                <div className="card-progress">
                                    <small>
                                        somme des stagiaire exlusion définitive
                                    </small>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-head">
                                    <h2>47,500</h2>
                                    <span className="las la-envelope"></span>
                                </div>
                                <div className="card-progress">
                                    <small>
                                        somme des stagiaire qui'on pas d'absence
                                    </small>
                                </div>
                            </div>
                        </div>

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
