import React from "react";
import "./OurLeaders.css";

import areaHead from "../../assets/area.png";
import pastor from "../../assets/ps.png";
import districtSecretary from "../../assets/sec.jpeg";

const leaders = [
  {
    id: 1,
    role: "AREA HEAD",
    title: "AREA HEAD",
    name: "Apostle Lawrence Oduro-Nyarko",
    image: areaHead,
  },
  {
    id: 2,
    role: "PASTOR",
    title: "DISTRICT PASTOR",
    name: "Pastor George Arthur",
    image: pastor,
  },
  {
    id: 3,
    role: "DISTRICT SECRETARY",
    title: "DISTRICT SECRETARY",
    name: "Elder Raymon Awortwe",
    image: districtSecretary,
  },
];

const OurLeaders = () => {
  return (
    <section className="leaders-section">
      <div className="leaders-container">

        <div className="leaders-heading">
          <span className="leaders-small-title">
            DEDICATED SERVANTS
          </span>

          <h2>
            Our <span>Leaders</span>
          </h2>

          <p>
            Meet the dedicated servants providing spiritual leadership
            and guidance to our district.
          </p>
        </div>

        <div className="leaders-grid">
          {leaders.map((leader) => (
            <div className="leader-card" key={leader.id}>

              <img
                src={leader.image}
                alt={leader.name}
                className="leader-image"
              />

              <div className="leader-overlay"></div>

              <span className="leader-badge">
                {leader.role}
              </span>

              <div className="leader-content">
                <span className="leader-position">
                  {leader.title}
                </span>

                <h3>{leader.name}</h3>

                <div className="leader-line"></div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurLeaders;