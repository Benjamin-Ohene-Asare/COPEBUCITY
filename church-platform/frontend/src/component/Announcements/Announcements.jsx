import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Announcements.css";

import { getAnnouncements } from "../../api/api";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await getAnnouncements();

        // Homepage only shows latest 3
        setAnnouncements(data.slice(0, 3));
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

    return new Date(`${date}T00:00:00`)
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
  };

  if (loading) {
    return null;
  }

  if (announcements.length === 0) {
    return null;
  }

  return (
    <section className="announcements-section">
      <div className="announcements-container">

        {/* HEADER */}
        <div className="announcements-header">

          <div className="announcement-label">
            <span>◁</span>
            CHURCH NEWS
          </div>

          <h2>
            Announcements <span>& Feeds</span>
          </h2>

          <p>
            Keep up to date with the latest news, stories and
            important information from our district.
          </p>

        </div>


        {/* CARDS */}
        <div className="announcements-grid">

          {announcements.map((announcement) => (

            <article
              className="announcement-card"
              key={announcement.id}
            >

              {/* IMAGE */}
              <div className="announcement-image-wrapper">

                {announcement.image ? (
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="announcement-image"
                  />
                ) : (
                  <div className="announcement-image-placeholder">
                    Announcement
                  </div>
                )}

                {announcement.is_new && (
                  <span className="announcement-new">
                    NEW
                  </span>
                )}

              </div>


              {/* CONTENT */}
              <div className="announcement-content">

                <div className="announcement-meta">

                  <span className="announcement-category">
                    ◁ {announcement.category}
                  </span>

                  <span className="announcement-dot">
                    •
                  </span>

                  <span className="announcement-date">
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
                  className="announcement-link"
                >
                  Read Full Announcement
                  <span>→</span>
                </Link>

              </div>

            </article>

          ))}

        </div>


        {/* VIEW ALL */}
        <div className="announcements-bottom">

          <Link
            to="/announcements"
            className="view-announcements-btn"
          >
            View All Announcements
            <span>→</span>
          </Link>

        </div>

      </div>
    </section>
  );
};

export default Announcements;