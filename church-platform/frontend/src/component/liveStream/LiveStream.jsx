import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LiveStream.css";

import { getStreams } from "../../api/api";

const LiveStream = () => {
  const [streams, setStreams] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStreams = async () => {
      try {
        const data = await getStreams();
        setStreams(data);
      } catch (error) {
        console.error("Failed to load streams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStreams();
  }, []);

  const filteredStreams = streams.filter((stream) => {
    const title = stream.title || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase());

    const streamType =
      stream.stream_type?.toUpperCase();

    const matchesFilter =
      filter === "ALL" ||
      streamType === filter;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="stream-library">
      <div className="stream-container">

        <div className="stream-heading">

          <div>
            <span className="stream-label">
              MEDIA LIBRARY
            </span>

            <h2>
              Watch. Worship.
              <strong> Grow.</strong>
            </h2>

            <p>
              Watch our live services, sermons,
              conventions and special church programmes.
            </p>
          </div>


          <div className="stream-search">
            <input
              type="text"
              placeholder="Search videos or services..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

        </div>


        <div className="stream-filters">

          <button
            className={
              filter === "ALL" ? "active" : ""
            }
            onClick={() => setFilter("ALL")}
          >
            All
          </button>

          <button
            className={
              filter === "LIVE" ? "active" : ""
            }
            onClick={() => setFilter("LIVE")}
          >
            Live
          </button>

          <button
            className={
              filter === "VIDEO" ? "active" : ""
            }
            onClick={() => setFilter("VIDEO")}
          >
            Videos
          </button>

        </div>


        {loading ? (

          <div className="stream-empty">
            Loading videos...
          </div>

        ) : (

          <div className="stream-grid">

            {filteredStreams.map((stream) => {

              const streamType =
                stream.stream_type?.toUpperCase();

              return (
                <Link
                  to={`/stream/${stream.slug}`}
                  className="stream-card"
                  key={stream.id}
                >

                  <div className="stream-thumbnail">

                    {stream.thumbnail ? (
                      <img
                        src={stream.thumbnail}
                        alt={stream.title}
                      />
                    ) : (
                      <div className="stream-placeholder">
                        Video
                      </div>
                    )}


                    <div className="stream-overlay">
                      <span className="stream-play">
                        ▶
                      </span>
                    </div>


                    <span
                      className={
                        streamType === "LIVE"
                          ? "stream-status live"
                          : "stream-status"
                      }
                    >
                      {streamType}
                    </span>

                  </div>


                  <div className="stream-card-content">

                    <h3>
                      {stream.title}
                    </h3>

                    <p className="stream-channel">
                      {stream.channel_name}
                    </p>

                    <div className="stream-meta">

                      <span>
                        {stream.platform}
                      </span>

                      <span>
                        {stream.is_live
                          ? "Live Now"
                          : formatDate(stream.published_at)}
                      </span>

                    </div>

                  </div>

                </Link>
              );
            })}

          </div>

        )}


        {!loading &&
          filteredStreams.length === 0 && (

            <div className="stream-empty">
              <h3>No videos found</h3>
              <p>
                Try another search or filter.
              </p>
            </div>

          )}

      </div>
    </section>
  );
};

export default LiveStream;