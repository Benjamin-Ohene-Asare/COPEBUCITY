import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Ann.css";

import {
  getAnnouncements,
} from "../../api/api";

const Ann = () => {
  const [announcements, setAnnouncements] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");


  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data =
          await getAnnouncements();

        setAnnouncements(data);

      } catch (error) {
        console.error(
          "Failed to load announcements:",
          error
        );

      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);


  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };


  const filteredAnnouncements =
    announcements.filter(
      (announcement) => {

        const text = `
          ${announcement.title}
          ${announcement.description}
          ${announcement.category}
        `.toLowerCase();

        return text.includes(
          search.toLowerCase()
        );
      }
    );


  return (
    <main className="ann-page">

      {/* HERO */}

      <section className="ann-hero">

        <div className="ann-hero-container">

          <span>
            CHURCH NEWS
          </span>

          <h1>
            Announcements
          </h1>

          <p>
            Stay informed with the latest
            announcements, updates and important
            information from Ebukrom District.
          </p>

        </div>

      </section>


      {/* CONTENT */}

      <section className="ann-section">

        <div className="ann-container">


          {/* TOP */}

          <div className="ann-top">

            <div>

              <span className="ann-label">
                LATEST UPDATES
              </span>

              <h2>
                District Announcements
              </h2>

            </div>


            <div className="ann-search">

              <input
                type="text"
                placeholder="Search announcements..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="ann-message">
              Loading announcements...
            </div>

          ) : filteredAnnouncements.length > 0 ? (

            <div className="ann-grid">

              {filteredAnnouncements.map(
                (announcement) => (

                  <article
                    className="ann-card"
                    key={announcement.id}
                  >

                    <Link
                      to={`/announcements/${announcement.slug}`}
                      className="ann-image"
                    >

                      {announcement.image ? (

                        <img
                          src={announcement.image}
                          alt={announcement.title}
                        />

                      ) : (

                        <div className="ann-no-image">
                          Announcement
                        </div>

                      )}


                      {announcement.is_new && (

                        <span className="ann-new">
                          NEW
                        </span>

                      )}

                    </Link>


                    <div className="ann-content">

                      <div className="ann-meta">

                        <span>
                          {announcement.category}
                        </span>

                        <span>
                          •
                        </span>

                        <span>
                          {formatDate(
                            announcement.published_date
                          )}
                        </span>

                      </div>


                      <h3>
                        {announcement.title}
                      </h3>


                      <p>
                        {announcement.description}
                      </p>


                      <Link
                        to={`/announcements/${announcement.slug}`}
                        className="ann-read"
                      >
                        Read Full Announcement
                        <span>→</span>
                      </Link>

                    </div>

                  </article>

                )
              )}

            </div>

          ) : (

            <div className="ann-message">

              <h3>
                No announcements found
              </h3>

              <p>
                There are currently no announcements
                matching your search.
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  );
};

export default Ann;