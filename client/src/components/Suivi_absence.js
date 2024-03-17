import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import axios from "axios";
import "../styles/styleSurveillance.css";

const Suivi_absence = () => {
    const navigate = useNavigate();
    const [stagiaires, setStagiaires] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filieres, setFilieres] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [selectedFiliere, setSelectedFiliere] = useState("");
    const [selectedGroupe, setSelectedGroupe] = useState("");
    const [selectedPromotion, setSelectedPromotion] = useState("");

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
        };
        fetchUserDetails();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/filieres")
            .then((response) => {
                setFilieres(response.data);
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la récupération des filières :",
                    error
                );
            });

        axios
            .get("http://localhost:8000/api/groupes")
            .then((response) => {
                setGroupes(response.data);
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la récupération des groupes :",
                    error
                );
            });
    }, []);

    useEffect(() => {
        if (selectedFiliere && selectedGroupe && selectedPromotion) {
            const fetchStagiaires = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:8000/api/getStagiairesWithAbsencesAndSanctions`,
                        {
                            params: {
                                id_filiere: selectedFiliere,
                                id_groupe: selectedGroupe,
                                promotion: selectedPromotion,
                            },
                        }
                    );
                    setStagiaires(response.data.stagiaires);
                } catch (error) {
                    console.error("Error fetching stagiaires:", error);
                }
            };

            fetchStagiaires();
        }
    }, [selectedFiliere, selectedGroupe, selectedPromotion]);
    console.log(stagiaires);
    return (
        <>
            <input type="checkbox" id="menu-toggle" />
            <div className="sidebar">
                <div className="side-header">
                    <img src={OFPPT_Logo} alt="logo_ofppt" className="logo" />
                </div>
                <div className="side-content">
                    <div className="profile">
                        <div className="profile-img bg-img"></div>
                        <h4>Espace</h4>
                        <small>Surveillance</small>
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
                                <Link to="/modifier_absence">
                                    <span className="las la-user-alt"></span>
                                    <small>Modifier absence</small>
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
                    <div className="page-header">
                        <div className="browse">
                            <label htmlFor="filiere">Filière:</label>
                            <select
                                name="filiere"
                                id="filiere"
                                value={selectedFiliere}
                                onChange={(e) =>
                                    setSelectedFiliere(e.target.value)
                                }
                            >
                                <option value="">Choisir une filière</option>
                                {filieres.map((filiere) => (
                                    <option key={filiere.id} value={filiere.id}>
                                        {filiere.nom_filiere}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="groupe">Groupe:</label>
                            <select
                                name="groupe"
                                id="groupe"
                                value={selectedGroupe}
                                onChange={(e) =>
                                    setSelectedGroupe(e.target.value)
                                }
                            >
                                <option value="">Choisir un groupe</option>
                                {groupes.map((groupe) => (
                                    <option key={groupe.id} value={groupe.id}>
                                        {groupe.numero_groupe}
                                    </option>
                                ))}
                            </select>
                            <label>
                                Promotion :
                                <input
                                    type="text"
                                    className="record-search"
                                    value={selectedPromotion}
                                    onChange={(e) =>
                                        setSelectedPromotion(e.target.value)
                                    }
                                    placeholder="Entrer la promotion"
                                />
                            </label>
                        </div>
                    </div>
                    {selectedFiliere && selectedGroupe && selectedPromotion && (
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
                                            <th>Promotion</th>
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
                                                    <td>
                                                        {stagiaire.promotion}
                                                    </td>

                                                    <td>{stagiaire.nom}</td>
                                                    <td>{stagiaire.prenom}</td>
                                                    <td>{stagiaire.email}</td>
                                                    <td>
                                                        {stagiaire.telephone}
                                                    </td>
                                                    <td>
                                                        {
                                                            stagiaire.numero_groupe
                                                        }
                                                    </td>
                                                    <td>
                                                        {stagiaire.nom_filiere}
                                                    </td>
                                                    <td>
                                                        {
                                                            stagiaire.total_absences
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            stagiaire.type_sanction
                                                        }
                                                    </td>
                                                    <td>
                                                        <button className="btn_email">
                                                            Email
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                            <button className="btn_save_absence">
                                Imprimer
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default Suivi_absence;
