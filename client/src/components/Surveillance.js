import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styleSurveillance.css";
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import Swal from "sweetalert2";
const Surveillance = () => {
  const navigate = useNavigate();

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

  const saveAbsence = () => {
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
  };

  return (
    <div div className="allContainer">
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
                    Logout
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
            <div class="browse">
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
              <label>
                Date :
                <input type="date" class="record-search" />
              </label>
              <button className="btn_show_liste">
                Afficher liste stagiaires
              </button>
            </div>
          </div>

          <div className="page-content">
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
                        <span>Nom</span>
                      </th>
                      <th>
                        <span>Prénom</span>
                      </th>
                      <th>
                        <span>Filiere</span>
                      </th>
                      <th>
                        <span>Groupe</span>
                      </th>
                      <th>
                        <span>Date Absence</span>
                      </th>
                      <th>
                        <span>Status</span>
                      </th>
                      <th>
                        <span>Nombre d'absence/heure</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="client">
                          <div className="client-info">
                            <h4>Khouchane</h4>
                          </div>
                        </div>
                      </td>
                      <td>Fatima</td>
                      <td>DD</td>

                      <td>201</td>
                      <td>22/08/2004</td>
                      <td>
                        <select>
                          <option>Absence</option>
                        </select>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input type="number" />
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
                      <td>ID</td>
                      <td>204</td>

                      <td>10/01/1982</td>
                      <td>
                        <select>
                          <option>Absence</option>
                        </select>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input type="number" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <button className="btn_save_absence" onClick={saveAbsence}>
              Enregistrer absence
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Surveillance;
