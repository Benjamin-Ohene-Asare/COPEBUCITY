import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./SermonDetail.css";

import { getSermon } from "../../api/api";

const SermonDetail = () => {
  const { slug } = useParams();

  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSermon = async () => {
      try {
        const data = await getSermon(slug);
        setSermon(data);
      } catch (error) {
        console.error("Failed to load sermon:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSermon();
  }, [slug]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: sermon?.title,
          text: sermon?.short_description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Sermon link copied.");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  if (loading) {
    return (
      <main className="sermon-detail-page">
        <section className="sermon-detail-top">
          <div className="sermon-detail-container">
            <p>Loading sermon...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!sermon) {
    return (
      <main className="sermon-detail-page">
        <section className="sermon-detail-top">
          <div className="sermon-detail-container">
            <div className="sermon-detail-info">
              <h1>Sermon Not Found</h1>

              <Link
                to="/sermons"
                className="back-to-sermons"
              >
                ← BACK TO SERMONS
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="sermon-detail-page">

      {/* TOP SERMON SECTION */}

      <section className="sermon-detail-top">

        <div className="sermon-detail-topbar">

          <Link
            to="/sermons"
            className="back-to-sermons"
          >
            <span>←</span>
            BACK TO SERMONS
          </Link>

          <button
            className="share-sermon"
            onClick={handleShare}
            aria-label="Share sermon"
          >
            ↗
          </button>

        </div>


        <div className="sermon-detail-container">

          {/* IMAGE */}

          <div className="sermon-detail-image">

            {sermon.thumbnail && (
              <img
                src={sermon.thumbnail}
                alt={sermon.title}
              />
            )}

          </div>


          {/* DETAILS */}

          <div className="sermon-detail-info">

            <span className="now-playing">
              NOW PLAYING
            </span>

            <h1>
              {sermon.title}
            </h1>


            <div className="sermon-detail-meta">

              <span>
                {sermon.preacher}
              </span>

              <span>
                {formatDate(sermon.sermon_date)}
              </span>

              {sermon.duration && (
                <span>
                  {sermon.duration}
                </span>
              )}

            </div>


            {/* AUDIO PLAYER */}

            {sermon.audio_file && (

              <div className="sermon-audio">

                <div className="sermon-audio-heading">

                  <div className="audio-main-play">
                    ▶
                  </div>

                  <div>
                    <h3>
                      Sermon Audio
                    </h3>

                    <p>
                      Listen to the full message
                    </p>
                  </div>

                </div>


                <audio controls>
                  <source
                    src={sermon.audio_file}
                    type="audio/mpeg"
                  />

                  Your browser does not support the audio element.
                </audio>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* MESSAGE INSIGHTS */}

      <section className="message-insights">

        <div className="message-insights-container">

          <div className="insights-heading">

            <span></span>

            <h2>
              Message Insights
            </h2>

          </div>


          <div className="insights-content">

            <h3>
              {sermon.title}
            </h3>

            <p className="insights-subtitle">
              Excerpts From The Message
            </p>


            <div className="sermon-information">

              <p>
                <strong>Speaker:</strong>{" "}
                {sermon.preacher}
              </p>

              {sermon.topic && (
                <p>
                  <strong>Topic:</strong>{" "}
                  {sermon.topic}
                </p>
              )}

              {sermon.scripture && (
                <p>
                  <strong>Scripture:</strong>{" "}
                  {sermon.scripture}
                </p>
              )}

            </div>


            {sermon.short_description && (
              <div className="sermon-exposition">

                <h4>
                  About This Message
                </h4>

                <p>
                  {sermon.short_description}
                </p>

              </div>
            )}


            {sermon.exposition && (
              <div className="sermon-exposition">

                <h4>
                  Exposition
                </h4>

                <p>
                  {sermon.exposition}
                </p>

              </div>
            )}


            {sermon.insights?.length > 0 && (
              <div className="sermon-exposition">

                <h4>
                  Key Insights
                </h4>

                <ul>

                  {sermon.insights.map((insight) => (
                    <li key={insight.id}>
                      {insight.text}
                    </li>
                  ))}

                </ul>

              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  );
};

export default SermonDetail;