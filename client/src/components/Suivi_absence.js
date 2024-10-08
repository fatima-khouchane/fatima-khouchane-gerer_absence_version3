import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import axios from "axios";
import "../styles/styleSurveillance.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const Suivi_absence = () => {
    const navigate = useNavigate();
    const [stagiaires, setStagiaires] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filieres, setFilieres] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [error, setError] = useState("");

    const [selectedFiliere, setSelectedFiliere] = useState("");
    const [selectedGroupe, setSelectedGroupe] = useState("");
    const getCurrentYear = () => {
        return new Date().getFullYear().toString();
    };
    const [selectedPromotion, setSelectedPromotion] = useState(
        getCurrentYear()
    );
    const [promotionShow, setPromotionShow] = useState("");

    const [message, setMessage] = useState("");
    const MySwal = withReactContent(Swal);
    const [selectedStagiaire, setSelectedStagiaire] = useState({});

    const emailRef = useRef(null);
    const subjectRef = useRef(null);
    const contentRef = useRef(null);
    const sendEmail = (recipientEmail, stagiaire) => {
        setSelectedStagiaire(stagiaire);

        MySwal.fire({
            title: "Contacter stagiaire ",
            showCancelButton: true,
            confirmButtonText: "Envoyer",
            cancelButtonText: "Cancel",
            html: (
                <form id="emailForm">
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Recipient Email"
                        defaultValue={recipientEmail}
                        required
                    />
                    <input
                        ref={subjectRef}
                        type="text"
                        placeholder="Subject"
                        required
                    />

                    <textarea ref={contentRef} placeholder="Content" required />
                </form>
            ),
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = {
                    email: emailRef.current.value,
                    subject: subjectRef.current.value,
                    content: contentRef.current.value,
                };
                send(formData);
            } else if (result.dismiss === MySwal.DismissReason.cancel) {
            }
        });
    };

    const send = async (formData) => {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/send-email",
                formData
            );
            setMessage(response.data.message);
            MySwal.fire({
                title: "Email sent successfully!",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    title: "green-title",
                },
            });
        } catch (error) {
            setMessage("Error lors de l'envoie de email.");
            console.error(error);
            MySwal.fire({
                text: "Error lors de l'envoie de email.",
            });
        }
    };

    //

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
            setPromotionShow(selectedPromotion);
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
                    if (response.status === 200) {
                        setStagiaires(response.data.stagiaires);
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
        }
    }, [selectedFiliere, selectedGroupe, selectedPromotion]);
    console.log(stagiaires);

    const handlePrint = async () => {
        const doc = new jsPDF();

        const imgData = OFPPT_Logo;
        doc.addImage(imgData, "PNG", 14, 14, 18, 20);
        doc.setFontSize(12);
        doc.text("Office de la formation professionnelle", 60, 20);
        doc.text("et de la promotion du travail", 60, 26);

        doc.text(`Promotion: ${promotionShow}`, 14, 50);

        try {
            const response = await axios.get(
                `http://localhost:8000/api/filieres/${selectedFiliere}`
            );
            const selectedFiliereName = response.data.nom_filiere;
            const responseGroupe = await axios.get(
                `http://localhost:8000/api/groupes/${selectedGroupe}`
            );
            const selectedGroupeName = responseGroupe.data.numero_groupe;

            doc.text(`Filière: ${selectedFiliereName}`, 14, 60);
            doc.text(`Groupe: ${selectedGroupeName}`, 14, 70);
            console.log(promotionShow);
        } catch (error) {
            console.error("Error fetching filiere name ans froupe:", error);
            doc.text("Filière: Non trouvé", 10, 20);
        }

        const tableData = stagiaires.map((stagiaire) => [
            stagiaire.nom,
            stagiaire.prenom,
            stagiaire.telephone,
            stagiaire.total_absences,
            stagiaire.type_sanction,
        ]);

        doc.autoTable({
            head: [
                [
                    "Nom",
                    "Prénom",
                    "Telephone",

                    "Total Absences",
                    "Type Sanction",
                ],
            ],
            body: tableData,
            startY: 90,
        });

        doc.save("tableau.pdf");
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
                                    placeholder="Années scolaire YYYY"
                                />
                            </label>
                        </div>
                    </div>
                    <>
                        {selectedFiliere &&
                            selectedGroupe &&
                            selectedPromotion && (
                                <>
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
                                        <div className="page-content">
                                            <div className="records table-responsive">
                                                <div className="record-header">
                                                    <div className="browse">
                                                        <input
                                                            type="search"
                                                            placeholder="Search"
                                                            className="record-search"
                                                            value={searchTerm}
                                                            onChange={
                                                                handleSearchChange
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <table
                                                    width="100%"
                                                    id="my-table"
                                                >
                                                    <thead>
                                                        <tr>
                                                            {/* <th>Promotion</th> */}
                                                            <th>Nom</th>
                                                            <th>Prénom</th>
                                                            <th>Email</th>
                                                            <th>Téléphone</th>

                                                            <th>
                                                                Total Absences injustifié
                                                            </th>
                                                            {/* <th>Total absence </th> */}
                                                            <th>
                                                                Type Sanction
                                                            </th>
                                                            <th>
                                                                Contacter
                                                                stagiaire
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {stagiaires &&
                                                            stagiaires
                                                                .filter(
                                                                    (
                                                                        stagiaire
                                                                    ) =>
                                                                        `${stagiaire.nom} ${stagiaire.prenom} ${stagiaire.type_sanction} ${stagiaire.nom_filiere}`
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
                                                                                index
                                                                            }
                                                                        >
                                                                            {/* <td
                                                                                style={{
                                                                                    color: "#22baa0",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    stagiaire.promotion
                                                                                }
                                                                            </td> */}
                                                                            <td
                                                                                style={{
                                                                                    color: "#22baa0",
                                                                                }}
                                                                            >
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
                                                                                    stagiaire.email
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    stagiaire.telephone
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
                                                                                    className="btn_email"
                                                                                    onClick={() =>
                                                                                        sendEmail(
                                                                                            stagiaire.email,
                                                                                            stagiaire
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Email
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <button
                                                className="btn_save_absence"
                                                onClick={handlePrint}
                                            >
                                                Imprimer
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                    </>
                </main>
            </div>
        </>
    );
};

export default Suivi_absence;
