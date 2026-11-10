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
    <section
      className="our-leaders-section"
      aria-labelledby="our-leaders-title"
    >
      <div className="our-leaders-container">
        <div className="our-leaders-heading">
          <span className="our-leaders-small-title">
            DEDICATED SERVANTS
          </span>

          <h2 id="our-leaders-title">
            Our <span>Leaders</span>
          </h2>

          <p>
            Meet the dedicated servants providing spiritual leadership
            and guidance to our district.
          </p>
        </div>

        <div className="our-leaders-grid">
          {leaders.map((leader) => (
            <article
              className="our-leaders-card"
              key={leader.id}
            >
              <img
                src={leader.image}
                alt={leader.name}
                className="our-leaders-image"
                loading="lazy"
              />

              <div
                className="our-leaders-overlay"
                aria-hidden="true"
              />

              <span className="our-leaders-badge">
                {leader.role}
              </span>

              <div className="our-leaders-content">
                <span className="our-leaders-position">
                  {leader.title}
                </span>

                <h3>{leader.name}</h3>

                <div
                  className="our-leaders-line"
                  aria-hidden="true"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurLeaders;