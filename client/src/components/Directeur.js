import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styleDashboard.css";
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import Swal from "sweetalert2";

const Directeur = () => {
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

  const generateReport = () => {
    Swal.fire({
      html: `
    <label for="Date_début">Date début :</label>
    <input type="date" id="Date_début">
    <br>
    <label for="Date_fin">Date Fin:</label>
    <input type="date" id="Date_fin">
  `,
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Create rapport", // Vérifiez que vous avez bien écrit "Create" ici
      denyButtonText: `Cancel`,
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     Swal.fire("Saved!", "", "success");
      //   } else if (result.isDenied) {
      //     Swal.fire("Changes are not saved", "", "info");
      //   }
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
                    Logout
                  </button>
                </span>
              </div>
            </div>
          </div>
        </header>

        <main>
          <div className="page-header">
            <h1>Dashboard</h1>
            {/* <!-- <small>Home / Dashboard</small> --> */}
          </div>

          <div className="page-content">
            {/* <div className="analytics"> */}

            <div className="page-header">
              <div class="browse">
                <label>
                  Anneés Scolaire :
                  <input type="text" class="record-search" placeholder="2024" />
                </label>
                <label>
                  Filiere :
                  <select name="" id="">
                    <option value="">DD</option>
                  </select>
                </label>
                <label>
                  Groupe :
                  <select name="" id="">
                    <option value="">201</option>
                  </select>
                </label>

                <button className="btn_show_liste">
                  Afficher liste stagiaires
                </button>
              </div>
            </div>

            <div className="records table-responsive">
              <div className="record-header">
                <div className="browse">
                  <input
                    type="search"
                    placeholder="Search"
                    className="record-search"
                  />
                </div>
              </div>

              <div>
                <table width="100%">
                  <thead>
                    <tr>
                      <th>
                        <span></span> Nom
                      </th>
                      <th>
                        <span></span> Prénom
                      </th>
                      <th>
                        <span></span> Date naissance
                      </th>
                      <th>
                        <span></span> Somme d'absence/heure
                      </th>
                      <th>
                        <span></span> Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="client">
                          <div className="client-info">
                            <h4>Andrew Bruno</h4>
                          </div>
                        </div>
                      </td>
                      <td>Fatima</td>
                      <td>22/08/2004</td>
                      <td>20</td>
                      <td>
                        <button id="btn-raport" onClick={generateReport}>
                          générer rapport
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="client">
                          <div className="client-info">
                            <h4>El asri</h4>
                          </div>
                        </div>
                      </td>
                      <td>Amina</td>
                      <td>10/01/1982</td>
                      <td>42</td>
                      <td>
                        <button id="btn-raport" onClick={generateReport}>
                          générer rapport
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Directeur;
