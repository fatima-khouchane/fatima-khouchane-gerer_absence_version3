import {React,useEffect} from "react";
import OFPPT_Logo from "../images/OFPPT_Logo.png";
import { Link, useNavigate } from "react-router-dom";
const Suivi_absence = () => {
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
            <label for="menu-toggle">
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
            <h1>Suivi absence</h1>
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
                        <button id="btn-raport">générer raport</button>
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

export default Suivi_absence;
