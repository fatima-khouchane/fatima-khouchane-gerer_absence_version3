import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styleSurveillance.css";
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import Swal from "sweetalert2";
import axios from "axios";

const Modifier_absence = () => {
    const navigate = useNavigate();
    const [absencesExistTrue, setAbsencesExistTrue] = useState(false);
    const [absencesExistFalse, setAbsencesExistFalse] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [filieres, setFilieres] = useState([]);
    const [statusValues, setStatusValues] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [selectedFiliere, setSelectedFiliere] = useState("");
    const [selectedGroupe, setSelectedGroupe] = useState("");
    const [stagiaires, setStagiaires] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [nbr_absence, setNbr_absence] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [absencesExist, setAbsencesExist] = useState(true);
    const [absencesData, setAbsencesData] = useState([]);

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
                if (selectedFiliere && selectedGroupe && selectedYear) {
                    const response = await axios.get(
                        `http://localhost:8000/api/stagiaires/${selectedFiliere}/${selectedGroupe}/${selectedYear}`
                    );
                    const stagiairesData = response.data;
                    setStagiaires(stagiairesData);
                }
            } catch (error) {
                console.error("Error fetching stagiaires:", error);
            }
        };

        fetchStagiaires();
    }, [selectedFiliere, selectedGroupe, selectedDate, selectedYear]);

    useEffect(() => {
        const checkAbsencesExistence = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/absences/existUpdate/${selectedFiliere}/${selectedGroupe}/${selectedDate}`
                );
                const { exist, absences } = response.data;
                if (exist) {
                    setAbsencesExistTrue(true);
                    setAbsencesExistFalse(false);
                } else {
                    setAbsencesExistFalse(true);
                    setAbsencesExistTrue(false);
                }
                setAbsencesData(absences);
                console.log(response.data);
            } catch (error) {
                console.error("Error checking absences existence:", error);
            }
        };

        if (selectedFiliere && selectedGroupe && selectedDate) {
            checkAbsencesExistence();
        }
    }, [selectedFiliere, selectedGroupe, selectedDate]);

    useEffect(() => {
        if (absencesExist && absencesData.length > 0) {
            const initialNbrAbsences = stagiaires.map((stagiaire) => {
                const absence = absencesData.find(
                    (a) => a.id_stagiaire === stagiaire.id
                );
                return absence ? absence.nombre_absence_heure : 0;
            });
            setNbr_absence(initialNbrAbsences);

            const initialStatusValues = stagiaires.map((stagiaire) => {
                const absence = absencesData.find(
                    (a) => a.id_stagiaire === stagiaire.id
                );
                return absence ? absence.status : "Présent";
            });
            setStatusValues(initialStatusValues);
        }
    }, [absencesExist, absencesData]);

    const handleNbrAbsenceChange = (value, index) => {
        const updatedNbrAbsence = [...nbr_absence];
        updatedNbrAbsence[index] = value;
        setNbr_absence(updatedNbrAbsence);
    };

    const saveAbsence = async () => {
        try {
            if (absencesExist) {
                const updatedAbsencesData = stagiaires
                    .map((stagiaire, index) => {
                        const absenceData = absencesData[index];
                        if (absenceData) {
                            return {
                                id: absenceData.id,
                                status: statusValues[index],
                                nombre_absence_heure: parseInt(
                                    nbr_absence[index]
                                ),
                                date_absence: selectedDate,
                                id_stagiaire: stagiaire.id,
                                id_groupe: stagiaire.id_groupe,
                                id_filiere: stagiaire.id_filiere,
                            };
                        } else {
                            // Gérer le cas où absencesData[index] est undefined
                            return null;
                        }
                    })
                    .filter((absenceData) => absenceData !== null); // Supprimer les éléments null du tableau

                console.log(updatedAbsencesData);
                const response = await axios.put(
                    "http://localhost:8000/api/absences/update",
                    updatedAbsencesData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                Swal.fire({
                    position: "center",
                    width: "fit-content",
                    title: "Absences ont été mises à jour avec succès",
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {
                        title: "green-title",
                    },
                });
            } else {
                // Gérer le cas où absencesExist est false
                // Ajoutez ici le code à exécuter lorsque les absences n'existent pas
            }
        } catch (error) {
            console.error("Error saving absences:", error);
            Swal.fire({
                position: "center",
                width: "fit-content",
                title: "Une erreur s'est produite lors de la mise à jour des absences",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

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
                        <h1>Modifier absence</h1>
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
                                    className="record-search"
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
                        <div className="page-content">
                            <React.Fragment>
                                {absencesExistTrue && (
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
                                        <>
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
                                                                <span>
                                                                    Prénom
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span>
                                                                    Date Absence
                                                                </span>
                                                            </th>
                                                            <th>
                                                                <span>
                                                                    Status
                                                                </span>
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
                                                            .filter(
                                                                (stagiaire) =>
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
                                                                                    ] ||
                                                                                    0
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
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="hidden"
                                                                                value={
                                                                                    absencesData[
                                                                                        index
                                                                                    ]
                                                                                        ?.id ||
                                                                                    ""
                                                                                }
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    </div>
                                )}
                                {absencesExistTrue && (
                                    <button
                                        className="btn_save_absence"
                                        onClick={saveAbsence}
                                    >
                                        Modifier absence
                                    </button>
                                )}
                            </React.Fragment>
                        </div>
                    )}
                    {absencesExistFalse && (
                        <p style={{ color: "red", textAlign: "center" }}>
                            Absence pas encore saisir
                        </p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Modifier_absence;
