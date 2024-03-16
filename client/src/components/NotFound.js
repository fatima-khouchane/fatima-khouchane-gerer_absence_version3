import React from "react";

import "../styles/styleNotFound.css"; // Importation du fichier CSS
import notFound from "../images/notFound.png";

const NotFound = () => {
    return (
        <div className="containerN">
            <img src={notFound} alt="Description de votre image" />
        </div>
    );
};

export default NotFound;
