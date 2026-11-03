import React, { useEffect, useState } from "react";
import "./MainAbout.css";

import {
  getAbout,
  getMinistries,
  getLeaders,
} from "../../api/api";

const MainAbout = () => {
  const [about, setAbout] = useState(null);
  const [ministries, setMinistries] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAboutPage = async () => {
      try {
        const [
          aboutData,
          ministriesData,
          leadersData,
        ] = await Promise.all([
          getAbout(),
          getMinistries(),
          getLeaders(),
        ]);

        setAbout(aboutData);
        setMinistries(ministriesData);

        // Only ministry leaders
        const ministryLeaders = leadersData.filter(
          (leader) =>
            leader.leader_type === "ministry" &&
            leader.is_current
        );

        setLeaders(ministryLeaders);

      } catch (error) {
        console.error(
          "Failed to load about page:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAboutPage();
  }, []);


  if (loading) {
    return (
      <div className="about-page-loading">
        Loading...
      </div>
    );
  }


  return (
    <main className="about-page">

      {/* =================================
          MAIN ABOUT
      ================================= */}

      <section className="main-about">

        <div className="main-about-container">

          {/* IMAGE */}

          <div className="main-about-image">

            {about?.image ? (
              <img
                src={about.image}
                alt={about.title}
              />
            ) : (
              <div className="about-image-placeholder">
                Church Photo
              </div>
            )}


            <div className="about-experience-card">
              <span>SERVING</span>

              <h3>
                Christ & Community
              </h3>
            </div>

          </div>


          {/* CONTENT */}

          <div className="main-about-content">

            <span className="about-kicker">
              WHO WE ARE
            </span>


            <h2>
              {about?.title || "About Ebukrom District"}
            </h2>


            {about?.description && (
              <p className="about-lead">
                {about.description}
              </p>
            )}


            {about?.history && (
              <p>
                {about.history}
              </p>
            )}


            {/* MISSION + VISION */}

            <div className="about-pillars">

              <div className="about-pillar">

                <span>01</span>

                <h4>
                  Our Mission
                </h4>

                <p>
                  {about?.mission ||
                    "Our mission will be added soon."}
                </p>

              </div>


              <div className="about-pillar">

                <span>02</span>

                <h4>
                  Our Vision
                </h4>

                <p>
                  {about?.vision ||
                    "Our vision will be added soon."}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================
          MINISTRIES
      ================================= */}

      {ministries.length > 0 && (

        <section className="ministries-overview">

          <div className="leaders-container">

            <div className="section-heading">

              <span>
                OUR MINISTRIES
              </span>

              <h2>
                Serving Through
                <strong> Ministry</strong>
              </h2>

              <p>
                Discover the various ministries serving
                across Ebukrom District.
              </p>

            </div>


            <div className="ministries-overview-grid">

              {ministries.map((ministry) => (

                <article
                  className="ministry-overview-card"
                  key={ministry.id}
                >

                  {ministry.image ? (

                    <div className="ministry-overview-image">

                      <img
                        src={ministry.image}
                        alt={ministry.name}
                      />

                    </div>

                  ) : (

                    <div className="ministry-image-placeholder">
                      Ministry
                    </div>

                  )}


                  <div className="ministry-overview-content">

                    <h3>
                      {ministry.name}
                    </h3>

                    <p>
                      {ministry.short_description}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          </div>

        </section>

      )}


      {/* =================================
          MINISTRY LEADERS
      ================================= */}

      <section className="leaders-section">

        <div className="leaders-container">

          <div className="section-heading">

            <span>
              OUR LEADERSHIP
            </span>

            <h2>
              Meet Our
              <strong> Ministry Leaders</strong>
            </h2>

            <p>
              Dedicated leaders serving across the
              various ministries of Ebukrom District.
            </p>

          </div>


          {leaders.length > 0 ? (

            <div className="leaders-grid">

              {leaders.map((leader) => (

                <article
                  className="leader-card"
                  key={leader.id}
                >

                  {/* LEADER IMAGE */}

                  {leader.image ? (

                    <div className="leader-image">

                      <img
                        src={leader.image}
                        alt={leader.name}
                      />

                    </div>

                  ) : (

                    <div className="leader-image-placeholder">

                      <span>
                        Photo
                      </span>

                    </div>

                  )}


                  {/* DETAILS */}

                  <div className="leader-details">

                    <span className="leader-ministry">
                      {leader.ministry_name ||
                        "Ebukrom District"}
                    </span>

                    <h3>
                      {leader.name}
                    </h3>

                    <p>
                      {leader.title}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="leaders-empty">
              Ministry leaders will be added soon.
            </div>

          )}

        </div>

      </section>

    </main>
  );
};

export default MainAbout;