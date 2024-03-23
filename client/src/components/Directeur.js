import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/styleDashboard.css";
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import Swal from "sweetalert2";

const Directeur = () => {
    const navigate = useNavigate();
    const [stagiaires, setStagiaires] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [date_debut, setdate_debut] = useState("");
    const [date_fin, setdate_fin] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [anneeScolaire, setAnneeScolaire] = useState("");
    useEffect(() => {
        const dateActuelle = new Date();
        const annee = dateActuelle.getFullYear();
        const anneeScolaireDefaut = `${annee}`;

        setAnneeScolaire(anneeScolaireDefaut);
    }, []);
    const handleAnneeScolaireChange = (e) => {
        setAnneeScolaire(e.target.value);
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
        };

        const fetchStagiaires = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/getStagiairesWithAbsencesAndSanctions`,
                    {
                        params: { promotion: anneeScolaire },
                    }
                );
                if (response.status === 200) {
                    if (
                        !response.data.stagiaires ||
                        response.data.stagiaires.length === 0
                    ) {
                        setStagiaires([]);
                    } else {
                        setStagiaires(response.data.stagiaires);
                        setDataLoaded(true);
                    }
                } else {
                    throw new Error("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(
                    "Une erreur s'est produite lors du chargement des données."
                );
            }
        };

        if (anneeScolaire !== "") {
            fetchStagiaires();
        }
        fetchUserDetails();
    }, [anneeScolaire]);
    console.log(stagiaires);
    // console.log(anneeScolaire);
    const generateReport = (id_stagiaire) => {
        console.log("ID Stagiaire:", id_stagiaire);

        Swal.fire({
            html: `
            <label for="Date_début">Date début :</label>
            <input type="date" id="Date_début" >
            <br>
            <label for="Date_fin">Date Fin:</label>
            <input type="date" id="Date_fin" >
        `,
            showCancelButton: true,
            confirmButtonText: "Create rapport",
            denyButtonText: `Cancel`,
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                const date_debut = document.getElementById("Date_début").value;
                const date_fin = document.getElementById("Date_fin").value;
                navigate(`/rapport/${id_stagiaire}/${date_debut}/${date_fin}`);
            }
        });
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
                        <h1>Dashboard</h1>
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
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />

                                    <input
                                        type="number"
                                        placeholder="Année scolaire"
                                        className="record-search"
                                        value={anneeScolaire}
                                        onChange={handleAnneeScolaireChange}
                                    />
                                </div>
                            </div>
                            {/* {error && <p>{error}</p>} */}

                            {anneeScolaire && dataLoaded ? (
                                stagiaires.length > 0 ? (
                                    <div>
                                        <table width="100%">
                                            <thead>
                                                <tr>
                                                    <th>Nom</th>
                                                    <th>Prénom</th>
                                                    <th>Filiere</th>
                                                    <th>Groupe</th>
                                                    <th>
                                                        Somme d'absence
                                                        injustifié
                                                    </th>
                                                    <th>type sanctions</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stagiaires
                                                    .filter((stagiaire) =>
                                                        `${stagiaire.type_sanction} ${stagiaire.nom} ${stagiaire.prenom}`
                                                            .toLowerCase()
                                                            .includes(
                                                                searchTerm.toLowerCase()
                                                            )
                                                    )
                                                    .map((stagiaire, index) => (
                                                        <tr key={stagiaire.id}>
                                                            <td
                                                                style={{
                                                                    color: "#22baa0",
                                                                }}
                                                            >
                                                                {stagiaire.nom}
                                                            </td>
                                                            <td>
                                                                {
                                                                    stagiaire.prenom
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    stagiaire.nom_filiere
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    stagiaire.numero_groupe
                                                                }
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                {
                                                                    stagiaire.total_absences_injustifié
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    stagiaire.type_sanction
                                                                }
                                                            </td>
                                                            <td>
                                                                <button
                                                                    id="btn-raport"
                                                                    onClick={() =>
                                                                        generateReport(
                                                                            stagiaire.id
                                                                        )
                                                                    }
                                                                >
                                                                    Générer
                                                                    rapport
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p
                                        style={{
                                            textAlign: "center",
                                            color: "red",
                                            fontSize: "1.4rem",
                                        }}
                                    >
                                        Aucun stagiaire trouvé.
                                    </p>
                                )
                            ) : null}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Directeur;
