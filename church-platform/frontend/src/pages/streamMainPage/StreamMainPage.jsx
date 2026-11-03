import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./StreamMainPage.css";

import { getStream } from "../../api/api";

const StreamMainPage = () => {
  const { slug } = useParams();

  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStream = async () => {
      try {
        const data = await getStream(slug);
        setStream(data);
      } catch (error) {
        console.error(
          "Failed to load stream:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadStream();
  }, [slug]);

  if (loading) {
    return (
      <main className="stream-main-page">
        <section className="stream-player-section">
          <div className="stream-player-container">
            <p>Loading video...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!stream) {
    return (
      <main className="stream-main-page">
        <section className="stream-player-section">
          <div className="stream-player-container">

            <h1>
              Video Not Found
            </h1>

            <Link
              to="/watch-live"
              className="stream-back"
            >
              ← Back to Library
            </Link>

          </div>
        </section>
      </main>
    );
  }

  const streamType =
    stream.stream_type?.toUpperCase();

  return (
    <main className="stream-main-page">

      <section className="stream-player-section">

        <div className="stream-player-container">

          <Link
            to="/watch-live"
            className="stream-back"
          >
            ← Back to Library
          </Link>


          <div className="stream-main-header">

            <div>

              <span
                className={
                  streamType === "LIVE"
                    ? "main-stream-status live"
                    : "main-stream-status"
                }
              >
                {streamType}
              </span>


              <h1>
                {stream.title}
              </h1>


              <p>
                {stream.channel_name}
              </p>

            </div>

          </div>


          <div className="main-video-wrapper">

            {stream.embed_url ? (

              <iframe
                src={stream.embed_url}
                title={stream.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />

            ) : (

              <div className="stream-no-video">
                Video unavailable.
              </div>

            )}

          </div>


          <div className="stream-description">

            <span>
              ABOUT THIS VIDEO
            </span>

            <h2>
              {stream.title}
            </h2>

            <p>
              {stream.description ||
                "No description has been added for this video."}
            </p>

          </div>

        </div>

      </section>

    </main>
  );
};

export default StreamMainPage;