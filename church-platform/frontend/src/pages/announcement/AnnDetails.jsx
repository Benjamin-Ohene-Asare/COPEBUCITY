import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import "./AnnDetails.css";

import {
  getAnnouncement,
} from "../../api/api";


const AnnDetails = () => {
  const { slug } = useParams();

  const [announcement, setAnnouncement] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const data =
          await getAnnouncement(slug);

        setAnnouncement(data);

      } catch (error) {
        console.error(
          "Failed to load announcement:",
          error
        );

      } finally {
        setLoading(false);
      }
    };

    loadAnnouncement();
  }, [slug]);


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


  if (loading) {
    return (
      <main className="ann-details-state">
        Loading announcement...
      </main>
    );
  }


  if (!announcement) {
    return (
      <main className="ann-details-state">

        <h1>
          Announcement not found
        </h1>

        <Link to="/announcements">
          Back to Announcements
        </Link>

      </main>
    );
  }


  return (
    <main className="ann-details-page">

      {/* HERO */}

      <section className="ann-details-hero">

        <div className="ann-details-hero-container">

          <Link
            to="/announcements"
            className="ann-details-back"
          >
            ← Back to Announcements
          </Link>


          <div className="ann-details-meta">

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

            {announcement.is_new && (
              <span className="ann-details-new">
                NEW
              </span>
            )}

          </div>


          <h1>
            {announcement.title}
          </h1>

        </div>

      </section>


      {/* BODY */}

      <section className="ann-details-section">

        <article className="ann-details-container">

          {announcement.image && (

            <div className="ann-details-image">

              <img
                src={announcement.image}
                alt={announcement.title}
              />

            </div>

          )}


          <div className="ann-details-body">

            <span className="ann-details-label">
              ANNOUNCEMENT
            </span>


            <div className="ann-details-text">
              {announcement.description}
            </div>


            <div className="ann-details-footer">

              <Link to="/announcements">
                ← View More Announcements
              </Link>

            </div>

          </div>

        </article>

      </section>

    </main>
  );
};

export default AnnDetails;