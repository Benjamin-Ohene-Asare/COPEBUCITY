import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import "./AnnouncementAdmin.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const AnnouncementAdmin = () => {
  const [announcements, setAnnouncements] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_BASE}/announcements/`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Unable to load announcements."
        );
      }

      setAnnouncements(
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
    loadAnnouncements();
  }, []);


  const deleteAnnouncement =
    async (announcement) => {

      const confirmed =
        window.confirm(
          `Delete "${announcement.title}"?`
        );

      if (!confirmed) return;


      try {
        const response =
          await fetch(
            `${API_BASE}/announcements/${announcement.slug}/`,
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
            // no json
          }

          throw new Error(
            data.detail ||
            "Unable to delete announcement."
          );
        }


        setAnnouncements(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !==
                announcement.id
            )
        );

      } catch (err) {
        setError(
          err.message
        );
      }
    };


  const filteredAnnouncements =
    announcements.filter(
      (announcement) => {

        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        return (
          announcement.title
            ?.toLowerCase()
            .includes(query) ||

          announcement.category
            ?.toLowerCase()
            .includes(query) ||

          announcement.description
            ?.toLowerCase()
            .includes(query)
        );
      }
    );


  const getImage =
    (announcement) => {
      return (
        announcement.image ||
        announcement.cover ||
        null
      );
    };


  return (
    <div className="announcement-admin-page">

      {/* HEADER */}

      <div className="announcement-admin-heading">

        <div>

          <span>
            CONTENT MANAGEMENT
          </span>

          <h2>
            Announcements
          </h2>

          <p>
            Manage church news,
            notices and important updates.
          </p>

        </div>


        <Link
          to="/media-admin/announcements/add"
          className="announcement-admin-add-btn"
        >
          + Add Announcement
        </Link>

      </div>


      {/* TOOLBAR */}

      <div className="announcement-admin-toolbar">

        <div className="announcement-admin-search">

          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <div className="announcement-admin-total">

          <span>
            Total
          </span>

          <strong>
            {announcements.length}
          </strong>

        </div>

      </div>


      {error && (
        <div className="announcement-admin-error">
          {error}
        </div>
      )}


      {/* TABLE */}

      <div className="announcement-admin-table-wrapper">

        {loading ? (

          <div className="announcement-admin-loading">
            Loading announcements...
          </div>

        ) : filteredAnnouncements.length > 0 ? (

          <table className="announcement-admin-table">

            <thead>
              <tr>
                <th>Announcement</th>
                <th>Category</th>
                <th>Date</th>
                <th>New</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>


            <tbody>

              {filteredAnnouncements.map(
                (announcement) => (

                  <tr key={announcement.id}>

                    <td>

                      <div className="announcement-admin-item">

                        <div className="announcement-admin-thumb">

                          {getImage(
                            announcement
                          ) ? (

                            <img
                              src={
                                getImage(
                                  announcement
                                )
                              }
                              alt={
                                announcement.title
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
                              announcement.title
                            }
                          </strong>

                          <span>
                            {
                              announcement.slug
                            }
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>
                      {
                        announcement.category ||
                        "Announcement"
                      }
                    </td>


                    <td>
                      {
                        announcement.date ||
                        announcement.created_at ||
                        "-"
                      }
                    </td>


                    <td>
                      {
                        announcement.is_new
                          ? "Yes"
                          : "No"
                      }
                    </td>


                    <td>

                      <span
                        className={
                          announcement.is_published ===
                          false
                            ? "announcement-status draft"
                            : "announcement-status published"
                        }
                      >
                        {
                          announcement.is_published ===
                          false
                            ? "Draft"
                            : "Published"
                        }
                      </span>

                    </td>


                    <td>

                      <div className="announcement-admin-actions">

                        <Link
                          to={`/announcements/${announcement.slug}`}
                          target="_blank"
                          className="announcement-action view"
                        >
                          View
                        </Link>


                        <Link
                          to={`/media-admin/announcements/${announcement.slug}/edit`}
                          className="announcement-action edit"
                        >
                          Edit
                        </Link>


                        <button
                          type="button"
                          className="announcement-action delete"
                          onClick={() =>
                            deleteAnnouncement(
                              announcement
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

          <div className="announcement-admin-empty">

            <h3>
              No announcements found
            </h3>

            <p>
              Add your first announcement
              or try another search.
            </p>

            <Link
              to="/media-admin/announcements/add"
            >
              Add Announcement
            </Link>

          </div>

        )}

      </div>

    </div>
  );
};


export default AnnouncementAdmin;