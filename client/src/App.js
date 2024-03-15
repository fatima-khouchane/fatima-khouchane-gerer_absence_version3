// App.js

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Directeur from "./components/Directeur";
import Surveillance from "./components/Surveillance";
import NotFound from "./components/NotFound";
import Suivi_absence from "./components/Suivi_absence";
import Statistique from "./components/Statistique";
import Modifier_absence from "./components/Modifier_absence";

const App = () => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("user");
        if (storedRole) {
            const parsedRole = JSON.parse(storedRole);
            setRole(parsedRole.role);
        }
    }, []);

    const updateRole = (newRole) => {
        setRole(newRole);
    };
    console.log(role);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login updateRole={updateRole} />} />
                {role === "Surveillance" ? (
                    <>
                        <Route
                            path="/surveillance"
                            element={<Surveillance />}
                        />
                        <Route
                            path="/suivi_absence"
                            element={<Suivi_absence />}
                        />
                        <Route
                            path="/modifier_absence"
                            element={<Modifier_absence />}
                        />
                    </>
                ) : role === "Directeur" ? (
                    <>
                        <Route path="/directeur" element={<Directeur />} />
                        <Route path="/statistique" element={<Statistique />} />
                    </>
                ) : null}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
