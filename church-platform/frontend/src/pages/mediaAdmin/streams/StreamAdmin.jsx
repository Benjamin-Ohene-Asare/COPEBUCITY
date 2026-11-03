import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import "./StreamAdmin.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const StreamAdmin = () => {
  const [streams, setStreams] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  const loadStreams = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_BASE}/streams/`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Unable to load streams."
        );
      }

      setStreams(
        Array.isArray(data)
          ? data
          : data.results || []
      );

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadStreams();
  }, []);


  const deleteStream =
    async (stream) => {

      const confirmed =
        window.confirm(
          `Delete "${stream.title}"?`
        );

      if (!confirmed) return;


      try {
        setError("");

        const response =
          await fetch(
            `${API_BASE}/streams/${stream.slug}/`,
            {
              method: "DELETE",
            }
          );


        if (
          !response.ok &&
          response.status !== 204
        ) {
          let data = {};

          try {
            data =
              await response.json();
          } catch {
            // empty response
          }

          throw new Error(
            data.detail ||
            "Unable to delete stream."
          );
        }


        setStreams(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== stream.id
            )
        );

      } catch (err) {
        setError(err.message);
      }
    };


  const filteredStreams =
    streams.filter((stream) => {

      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return true;
      }

      return (
        stream.title
          ?.toLowerCase()
          .includes(query) ||

        stream.channel_name
          ?.toLowerCase()
          .includes(query) ||

        stream.platform
          ?.toLowerCase()
          .includes(query)
      );
    });


  return (
    <div className="stream-admin-page">

      {/* HEADER */}

      <div className="stream-admin-heading">

        <div>

          <span>
            MEDIA MANAGEMENT
          </span>

          <h2>
            Live Streams
          </h2>

          <p>
            Manage live services,
            broadcasts and recorded videos.
          </p>

        </div>


        <Link
          to="/media-admin/streams/add"
          className="stream-admin-add"
        >
          + Add Stream
        </Link>

      </div>


      {/* SUMMARY */}

      <div className="stream-admin-stats">

        <div>
          <span>
            Total Streams
          </span>

          <strong>
            {streams.length}
          </strong>
        </div>


        <div>
          <span>
            Live Now
          </span>

          <strong>
            {
              streams.filter(
                (stream) =>
                  stream.is_live
              ).length
            }
          </strong>
        </div>


        <div>
          <span>
            Featured
          </span>

          <strong>
            {
              streams.filter(
                (stream) =>
                  stream.is_featured
              ).length
            }
          </strong>
        </div>


        <div>
          <span>
            Active
          </span>

          <strong>
            {
              streams.filter(
                (stream) =>
                  stream.is_active !==
                  false
              ).length
            }
          </strong>
        </div>

      </div>


      {/* TOOLBAR */}

      <div className="stream-admin-toolbar">

        <input
          type="text"
          placeholder="Search streams..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <Link
          to="/watch-live"
          target="_blank"
        >
          View Watch Live Page
        </Link>

      </div>


      {error && (
        <div className="stream-admin-error">
          {error}
        </div>
      )}


      {/* TABLE */}

      <div className="stream-admin-table-wrapper">

        {loading ? (

          <div className="stream-admin-loading">
            Loading streams...
          </div>

        ) : filteredStreams.length > 0 ? (

          <table className="stream-admin-table">

            <thead>
              <tr>
                <th>Stream</th>
                <th>Platform</th>
                <th>Type</th>
                <th>Published</th>
                <th>Live</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>


            <tbody>

              {filteredStreams.map(
                (stream) => (

                  <tr key={stream.id}>

                    <td>

                      <div className="stream-admin-item">

                        <div className="stream-admin-thumb">

                          {stream.thumbnail ? (

                            <img
                              src={
                                stream.thumbnail
                              }
                              alt={
                                stream.title
                              }
                            />

                          ) : (

                            <span>
                              VIDEO
                            </span>

                          )}

                        </div>


                        <div>

                          <strong>
                            {stream.title}
                          </strong>

                          <span>
                            {
                              stream.channel_name ||
                              "Ebucity Church"
                            }
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>

                      <span className="stream-platform">
                        {
                          stream.platform ||
                          "-"
                        }
                      </span>

                    </td>


                    <td>
                      {
                        stream.stream_type ===
                        "live"
                          ? "Live Stream"
                          : "Video"
                      }
                    </td>


                    <td>
                      {
                        stream.published_at
                          ? new Date(
                              stream.published_at
                            ).toLocaleDateString()
                          : "-"
                      }
                    </td>


                    <td>

                      <span
                        className={
                          stream.is_live
                            ? "stream-live-badge live"
                            : "stream-live-badge offline"
                        }
                      >
                        {
                          stream.is_live
                            ? "LIVE"
                            : "OFFLINE"
                        }
                      </span>

                    </td>


                    <td>

                      <span
                        className={
                          stream.is_active !==
                          false
                            ? "stream-status active"
                            : "stream-status inactive"
                        }
                      >
                        {
                          stream.is_active !==
                          false
                            ? "Active"
                            : "Inactive"
                        }
                      </span>

                    </td>


                    <td>

                      <div className="stream-admin-actions">

                        <Link
                          to={`/stream/${stream.slug}`}
                          target="_blank"
                          className="stream-action view"
                        >
                          View
                        </Link>


                        <Link
                          to={`/media-admin/streams/${stream.slug}/edit`}
                          className="stream-action edit"
                        >
                          Edit
                        </Link>


                        <button
                          type="button"
                          className="stream-action delete"
                          onClick={() =>
                            deleteStream(
                              stream
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        ) : (

          <div className="stream-admin-empty">

            <h3>
              No streams found
            </h3>

            <p>
              Add a live stream or
              recorded church video.
            </p>

            <Link
              to="/media-admin/streams/add"
            >
              Add Stream
            </Link>

          </div>

        )}

      </div>

    </div>
  );
};


export default StreamAdmin;