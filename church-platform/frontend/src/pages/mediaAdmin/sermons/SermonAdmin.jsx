import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import "./SermonAdmin.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const SermonAdmin = () => {
  const [sermons, setSermons] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  const loadSermons = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_BASE}/sermons/`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Unable to load sermons."
        );
      }

      setSermons(
        Array.isArray(data)
          ? data
          : data.results || []
      );

    } catch (err) {
      console.error(err);

      setError(
        err.message
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadSermons();
  }, []);


  const deleteSermon =
    async (sermon) => {

      const confirmed =
        window.confirm(
          `Delete "${sermon.title}"?`
        );

      if (!confirmed) return;


      try {
        const response =
          await fetch(
            `${API_BASE}/sermons/${sermon.slug}/`,
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
            // no JSON
          }

          throw new Error(
            data.detail ||
            "Unable to delete sermon."
          );
        }


        setSermons(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== sermon.id
            )
        );

      } catch (err) {
        setError(
          err.message
        );
      }
    };


  const filteredSermons =
    sermons.filter(
      (sermon) => {

        const query =
          search
            .toLowerCase()
            .trim();

        if (!query) {
          return true;
        }

        return (
          sermon.title
            ?.toLowerCase()
            .includes(query) ||

          sermon.preacher
            ?.toLowerCase()
            .includes(query) ||

          sermon.scripture
            ?.toLowerCase()
            .includes(query)
        );
      }
    );


  const getImage = (
    sermon
  ) => {

    return (
      sermon.image ||
      sermon.thumbnail ||
      null
    );
  };


  return (
    <div className="sermon-admin-page">

      {/* HEADER */}

      <div className="sermon-admin-heading">

        <div>

          <span>
            CONTENT MANAGEMENT
          </span>

          <h2>
            Sermons
          </h2>

          <p>
            Add, update and manage sermon
            messages published on the website.
          </p>

        </div>


        <Link
          to="/media-admin/sermons/add"
          className="sermon-admin-add-btn"
        >
          + Add Sermon
        </Link>

      </div>


      {/* TOOLBAR */}

      <div className="sermon-admin-toolbar">

        <div className="sermon-admin-search">

          <input
            type="text"
            placeholder="Search sermons..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <div className="sermon-admin-total">

          <span>
            Total Sermons
          </span>

          <strong>
            {sermons.length}
          </strong>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="sermon-admin-error">
          {error}
        </div>
      )}


      {/* TABLE */}

      <div className="sermon-admin-table-wrapper">

        {loading ? (

          <div className="sermon-admin-loading">
            Loading sermons...
          </div>

        ) : filteredSermons.length > 0 ? (

          <table className="sermon-admin-table">

            <thead>
              <tr>
                <th>Sermon</th>
                <th>Preacher</th>
                <th>Scripture</th>
                <th>Series</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>


            <tbody>

              {filteredSermons.map(
                (sermon) => (

                  <tr key={sermon.id}>

                    <td>

                      <div className="sermon-admin-sermon">

                        <div className="sermon-admin-thumb">

                          {getImage(
                            sermon
                          ) ? (

                            <img
                              src={
                                getImage(
                                  sermon
                                )
                              }
                              alt={
                                sermon.title
                              }
                            />

                          ) : (

                            <span>
                              No Image
                            </span>

                          )}

                        </div>


                        <div>

                          <strong>
                            {
                              sermon.title
                            }
                          </strong>

                          <span>
                            {
                              sermon.slug
                            }
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>
                      {
                        sermon.preacher ||
                        "-"
                      }
                    </td>


                    <td>
                      {
                        sermon.scripture ||
                        "-"
                      }
                    </td>


                    <td>
                      {
                        sermon.series_name ||
                        sermon.series ||
                        "-"
                      }
                    </td>


                    <td>
                      {
                        sermon.date ||
                        sermon.sermon_date ||
                        "-"
                      }
                    </td>


                    <td>

                      <span
                        className={
                          sermon.is_published ===
                          false
                            ? "sermon-status draft"
                            : "sermon-status published"
                        }
                      >
                        {
                          sermon.is_published ===
                          false
                            ? "Draft"
                            : "Published"
                        }
                      </span>

                    </td>


                    <td>

                      <div className="sermon-admin-actions">

                        <Link
                          to={`/sermons/${sermon.slug}`}
                          target="_blank"
                          className="sermon-action view"
                        >
                          View
                        </Link>


                        <Link
                          to={`/media-admin/sermons/${sermon.slug}/edit`}
                          className="sermon-action edit"
                        >
                          Edit
                        </Link>


                        <button
                          type="button"
                          className="sermon-action delete"
                          onClick={() =>
                            deleteSermon(
                              sermon
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

          <div className="sermon-admin-empty">

            <h3>
              No sermons found
            </h3>

            <p>
              Add your first sermon or try
              another search.
            </p>

            <Link
              to="/media-admin/sermons/add"
            >
              Add Sermon
            </Link>

          </div>

        )}

      </div>

    </div>
  );
};


export default SermonAdmin;