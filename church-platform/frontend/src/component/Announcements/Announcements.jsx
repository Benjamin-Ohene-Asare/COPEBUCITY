import React from "react";
import "./Announcements.css";

import announcement1 from "../../assets/logo.png";

const announcements = [
  {
    id: 1,
    image: announcement1,
    category: "ANNOUNCEMENT",
    date: "AUG 30, 2026",
    title: "Sunday Worship Service",
    description:
      "Join us this Sunday for a wonderful time of worship, fellowship and the Word of God.",
    isNew: true,
  },
  {
    id: 2,
    image: announcement1,
    category: "ANNOUNCEMENT",
    date: "AUG 28, 2026",
    title: "District Prayer Meeting",
    description:
      "The entire district is invited to join us for a special time of prayer and intercession.",
    isNew: true,
  },
  {
    id: 3,
    image: announcement1,
    category: "ANNOUNCEMENT",
    date: "AUG 26, 2026",
    title: "Youth Ministry Meeting",
    description:
      "All young people are encouraged to join us as we grow together in Christ and fellowship.",
    isNew: false,
  },
];

const Announcements = () => {
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
            Keep up to date with the latest news, stories and important
            information from our district.
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

                <img
                  src={announcement.image}
                  alt={announcement.title}
                  className="announcement-image"
                />

                {announcement.isNew && (
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
                    {announcement.date}
                  </span>

                </div>

                <h3>
                  {announcement.title}
                </h3>

                <p>
                  {announcement.description}
                </p>

                <button className="announcement-link">
                  Read Full Announcement
                  <span>→</span>
                </button>

              </div>

            </article>
          ))}

        </div>

        {/* BUTTON */}
        <div className="announcements-bottom">

          <button className="view-announcements-btn">
            View All Announcements
            <span>→</span>
          </button>

        </div>

      </div>
    </section>
  );
};

export default Announcements;