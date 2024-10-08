import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styleSurveillance.css";
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import Swal from "sweetalert2";
import axios from "axios";

const Surveillance = () => {
    const navigate = useNavigate();
    const [filieres, setFilieres] = useState([]);
    const [statusValues, setStatusValues] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [selectedFiliere, setSelectedFiliere] = useState("");
    const [selectedGroupe, setSelectedGroupe] = useState("");
    const [stagiaires, setStagiaires] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [nbr_absence, setNbr_absence] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [messageShow, setMessageShow] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
        };

        const fetchFilieres = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/filieres"
                );
                setFilieres(response.data);
            } catch (error) {
                console.error("Error fetching filieres:", error);
            }
        };

        const fetchGroupes = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/groupes"
                );
                setGroupes(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching groupes:", error);
            }
        };

        fetchFilieres();
        fetchGroupes();
        fetchUserDetails();
    }, []);

    useEffect(() => {
        const fetchStagiaires = async () => {
            try {
                if (
                    selectedFiliere &&
                    selectedGroupe &&
                    selectedDate &&
                    selectedYear
                ) {
                    const response = await axios.get(
                        `http://localhost:8000/api/stagiaires/${selectedFiliere}/${selectedGroupe}/${selectedYear}`
                    );
                    const initialStatusValues = response.data.map(
                        () => "Présent"
                    );
                    const initialNbrAbsences = response.data.map(() => 0);
                    setStatusValues(initialStatusValues);
                    setNbr_absence(initialNbrAbsences);
                    setStagiaires(response.data);
                    console.log(response.data);
                }
            } catch (error) {
                console.error("Error fetching stagiaires:", error);
            }
        };

        fetchStagiaires();
    }, [selectedFiliere, selectedGroupe, selectedDate, selectedYear]);

    const handleNbrAbsenceChange = (value, index) => {
        const updatedNbrAbsence = [...nbr_absence];
        updatedNbrAbsence[index] = value;
        setNbr_absence(updatedNbrAbsence);
    };
    // console.log(stagiaires)
    const saveAbsence = async () => {
        try {
            const validStagiaires = stagiaires.every(
                (stagiaire) =>
                    stagiaire.id && stagiaire.id_groupe && stagiaire.id_filiere
            );
            if (!validStagiaires) {
                console.error(
                    "Tous les champs requis (id, id_groupe, id_filiere) doivent être définis pour chaque stagiaire."
                );
                return;
            }

            if (!selectedDate) {
                console.error(
                    "Veuillez sélectionner une date avant d'enregistrer l'absence."
                );
                return;
            }

            if (!statusValues) {
                setStatusValues(Array(stagiaires.length).fill("Présent"));
            }

            if (!nbr_absence) {
                setNbr_absence(Array(stagiaires.length).fill(0));
            }

            if (!selectedFiliere || !selectedGroupe) {
                console.error(
                    "Veuillez sélectionner une filière et un groupe avant de récupérer les stagiaires."
                );
                return;
            }

            const absencesData = stagiaires.map((stagiaire, index) => ({
                status: statusValues[index],
                nombre_absence_heure: parseInt(nbr_absence[index]),
                date_absence: selectedDate,
                id_stagiaire: stagiaire.id,
                id_groupe: stagiaire.id_groupe,
                id_filiere: stagiaire.id_filiere,
            }));

            const response = await axios.post(
                "http://localhost:8000/api/absences",
                absencesData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            Swal.fire({
                position: "center",
                width: "fit-content",
                title: "Absence est bien enregistrée",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    title: "green-title",
                },
            });
        } catch (error) {
            console.error("Error saving absences:", error);
            Swal.fire({
                position: "center",
                width: "fit-content",
                title: "Une erreur s'est produite lors de l'enregistrement de l'absence",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    useEffect(() => {
        const checkAbsencesExistence = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/absences/exist/${selectedFiliere}/${selectedGroupe}/${selectedDate}`
                );
                if (response.data.message === "Absence deja saisir.") {
                    setMessage(response.data.message);
                    setMessageShow("");
                } else {
                    setMessage("");
                    setMessageShow(response.data.message);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        if (selectedFiliere && selectedGroupe && selectedDate) {
            checkAbsencesExistence();
        }
    }, [selectedFiliere, selectedGroupe, selectedDate]);
    return (
        <div className="allContainer">
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
                        <h1>Saisir absence</h1>
                    </div>
                    <div className="page-header">
                        <div className="browse">
                            <label htmlFor="filiere">Filiere:</label>
                            <select
                                name="filiere"
                                id="filiere"
                                value={selectedFiliere}
                                onChange={(e) => {
                                    setSelectedFiliere(e.target.value);
                                }}
                            >
                                <option>choisir filiere</option>
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
                                onChange={(e) => {
                                    setSelectedGroupe(e.target.value);
                                }}
                            >
                                <option>choisir groupe</option>
                                {groupes.map((groupe) => (
                                    <option key={groupe.id} value={groupe.id}>
                                        {groupe.numero_groupe}
                                    </option>
                                ))}
                            </select>
                            <label>
                                Date :
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) =>
                                        setSelectedDate(e.target.value)
                                    }
                                />
                            </label>
                            <label>
                                Année scolaire :
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    value={selectedYear}
                                    onChange={(e) =>
                                        setSelectedYear(e.target.value)
                                    }
                                />
                            </label>
                        </div>
                    </div>
                    {selectedFiliere && selectedGroupe && selectedDate && (
                        <>
                            {messageShow && (
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
                                                        setSearchTerm(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <table width="100%">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <span>CIN</span>
                                                        </th>
                                                        <th>
                                                            <span>Nom</span>
                                                        </th>
                                                        <th>
                                                            <span>Prénom</span>
                                                        </th>
                                                        <th>
                                                            <span>
                                                                Date Absence
                                                            </span>
                                                        </th>
                                                        <th>
                                                            <span>Status</span>
                                                        </th>
                                                        <th>
                                                            <span>
                                                                Nombre
                                                                d'absence/heure
                                                            </span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stagiaires
                                                        .filter((stagiaire) =>
                                                            `${stagiaire.cin} ${stagiaire.nom} ${stagiaire.prenom}`
                                                                .toLowerCase()
                                                                .includes(
                                                                    searchTerm.toLowerCase()
                                                                )
                                                        )
                                                        .map(
                                                            (
                                                                stagiaire,
                                                                index
                                                            ) => (
                                                                <tr
                                                                    key={
                                                                        stagiaire.id
                                                                    }
                                                                >
                                                                    <td
                                                                        style={{
                                                                            color: "#22baa0",
                                                                        }}
                                                                    >
                                                                        {
                                                                            stagiaire.cin
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            stagiaire.nom
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            stagiaire.prenom
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            selectedDate
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <select
                                                                            value={
                                                                                statusValues[
                                                                                    index
                                                                                ]
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                const newStatusValues =
                                                                                    [
                                                                                        ...statusValues,
                                                                                    ];
                                                                                newStatusValues[
                                                                                    index
                                                                                ] =
                                                                                    e.target.value;
                                                                                setStatusValues(
                                                                                    newStatusValues
                                                                                );
                                                                            }}
                                                                            className="status_select"
                                                                        >
                                                                            <option value="Présent">
                                                                                Présent
                                                                            </option>
                                                                            <option value="Absence">
                                                                                Absence
                                                                            </option>
                                                                            <option value="Absence justifiée">
                                                                                Absence
                                                                                justifiée
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="number"
                                                                            value={
                                                                                nbr_absence[
                                                                                    index
                                                                                ]
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleNbrAbsenceChange(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    index
                                                                                )
                                                                            }
                                                                            className="nbr_absence"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <button
                                        className="btn_save_absence"
                                        onClick={saveAbsence}
                                    >
                                        Enregistrer absence
                                    </button>
                                </div>
                            )}
                            {message && (
                                <p
                                    style={{
                                        color: "red",
                                        textAlign: "center",
                                        fontSize: "1.6rem",
                                        marginBottom: "30px",
                                    }}
                                >
                                    Absence de ce groupe et filière et déjà
                                    saisie dans cette date.
                                </p>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Surveillance;
