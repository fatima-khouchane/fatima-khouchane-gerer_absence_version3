import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import OFPPT_Logo from "../images/OFPPT_Logo.png";

const Raport = () => {
    const navigate = useNavigate();
    const { id_stagiaire, date_debut, date_fin } = useParams();
    const [absences, setAbsences] = useState([]);

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

    useEffect(() => {
        const fetchAbsences = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/generateReport`,
                    {
                        params: {
                            id_stagiaire: id_stagiaire,
                            date_debut: date_debut,
                            date_fin: date_fin,
                        },
                    }
                );
                if (response.status === 200) {
                    setAbsences(response.data.absences);
                } else {
                    throw new Error("Failed to fetch absences");
                }
            } catch (error) {
                console.error("Error fetching absences:", error);
            }
        };
        fetchAbsences();
    }, [id_stagiaire, date_debut, date_fin]);

    const handlePrint = async () => {
        const doc = new jsPDF();
        const imgData = OFPPT_Logo;
        doc.addImage(imgData, "PNG", 14, 14, 18, 20);
        doc.setFontSize(12); 

        doc.text("Office de la formation professionnelle", 60, 20);
        doc.text("et de la promotion du travail", 60, 26);

        if (absences.length > 0) {
            doc.text(`Année scolaire : ${absences[0].promotion}`, 14, 50);
            doc.text(
                `Nom/Prénom : ${absences[0].nom} ${absences[0].prenom}`,
                14,
                60
            );
            doc.text(`Filière : ${absences[0].filiere}`, 14, 70);
            doc.text(`Groupe : ${absences[0].groupe}`, 14, 80);
        }

        const tableData = absences.map((absence) => [
            absence.date_absence,
            absence.status,
            absence.nombre_absence_heure,
        ]);

        doc.autoTable({
            head: [["Date d'absence", "Statut", "Nombre d'heures d'absence"]],
            body: tableData,
            startY: 90,
        });

        doc.save(`raport_absence_ ${absences[0].nom} ${absences[0].prenom}.pdf`);
    };

    return (
        <div className="raport-container">
            <h2 style={{ textAlign: "center" }}>Détaille raport</h2>

            {absences.length > 0 && (
                <div className="summary">
                    <p>Années scolaire : {absences[0].promotion}</p>
                    <p>
                        Nom/Prénom : {absences[0].nom} {absences[0].prenom}
                    </p>
                    <p>Filiere : {absences[0].filiere}</p>
                    <p>Groupe : {absences[0].groupe}</p>
                </div>
            )}

            <table className="absences-table" id="">
                <thead>
                    <tr>
                        <th>Date d'absence</th>
                        <th>Statut</th>
                        <th>Nombre d'heures d'absence</th>
                    </tr>
                </thead>
                <tbody>
                    {absences.map((absence, index) => (
                        <>
                            <tr key={index}>
                                <td>{absence.date_absence}</td>
                                <td>{absence.status}</td>
                                <td style={{ textAlign: "center" }}>
                                    {absence.nombre_absence_heure}
                                </td>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
            <div className="centered-buttons">
                <button className="print-button" onClick={handlePrint}>
                    Imprimer PDF
                </button>
                <button className="return-link">
                    <Link to="/directeur" className="return-link">
                        Retour
                    </Link>
                </button>
            </div>
        </div>
    );
};

export default Raport;
