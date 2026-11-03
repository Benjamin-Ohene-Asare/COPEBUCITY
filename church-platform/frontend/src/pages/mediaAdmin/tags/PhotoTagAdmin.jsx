import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import "./PhotoTagAdmin.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const PhotoTagAdmin = () => {
  const [tags, setTags] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  const loadTags = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_BASE}/photo-tags/`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Unable to load photo tags."
        );
      }

      setTags(
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
    loadTags();
  }, []);


  const deleteTag =
    async (tag) => {

      const confirmed =
        window.confirm(
          `Delete "${tag.name}"?`
        );

      if (!confirmed) {
        return;
      }


      try {
        setError("");

        const response =
          await fetch(
            `${API_BASE}/photo-tags/${tag.id}/`,
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
            "Unable to delete photo tag."
          );
        }


        setTags(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== tag.id
            )
        );

      } catch (err) {
        setError(
          err.message
        );
      }
    };


  const filteredTags =
    tags.filter(
      (tag) => {

        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        return (
          tag.name
            ?.toLowerCase()
            .includes(query) ||

          tag.description
            ?.toLowerCase()
            .includes(query)
        );
      }
    );


  return (
    <div className="photo-tag-admin-page">

      {/* HEADER */}

      <div className="photo-tag-admin-heading">

        <div>

          <span>
            MEDIA TOOLS
          </span>

          <h2>
            Photo Tags
          </h2>

          <p>
            Manage programme PNG tags used
            when branding church photos.
          </p>

        </div>


        <div className="photo-tag-admin-header-actions">

          <Link
            to="/photo-tag"
            target="_blank"
            className="photo-tag-open-tool"
          >
            Open Tagging Tool
          </Link>


          <Link
            to="/media-admin/photo-tags/add"
            className="photo-tag-add-btn"
          >
            + Add Tag
          </Link>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="photo-tag-admin-stats">

        <div>

          <span>
            Total Tags
          </span>

          <strong>
            {tags.length}
          </strong>

        </div>


        <div>

          <span>
            Active Tags
          </span>

          <strong>
            {
              tags.filter(
                (tag) =>
                  tag.is_active !==
                  false
              ).length
            }
          </strong>

        </div>


        <div>

          <span>
            Default Tag
          </span>

          <strong className="photo-default-name">
            {
              tags.find(
                (tag) =>
                  tag.is_default
              )?.name ||
              "None"
            }
          </strong>

        </div>

      </div>


      {/* TOOLBAR */}

      <div className="photo-tag-admin-toolbar">

        <input
          type="text"
          placeholder="Search photo tags..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />


        <span>
          PNG overlays for programme photos
        </span>

      </div>


      {error && (
        <div className="photo-tag-admin-error">
          {error}
        </div>
      )}


      {/* TAG GRID */}

      {loading ? (

        <div className="photo-tag-admin-loading">
          Loading photo tags...
        </div>

      ) : filteredTags.length > 0 ? (

        <div className="photo-tag-admin-grid">

          {filteredTags.map(
            (tag) => (

              <article
                className="photo-tag-admin-card"
                key={tag.id}
              >

                <div className="photo-tag-preview">

                  <div className="photo-tag-preview-bg">

                    {tag.image ? (

                      <img
                        src={tag.image}
                        alt={tag.name}
                      />

                    ) : (

                      <div className="photo-tag-no-image">
                        No PNG
                      </div>

                    )}

                  </div>


                  <div className="photo-tag-badges">

                    {tag.is_default && (
                      <span className="photo-tag-default-badge">
                        DEFAULT
                      </span>
                    )}


                    <span
                      className={
                        tag.is_active !==
                        false
                          ? "photo-tag-status active"
                          : "photo-tag-status inactive"
                      }
                    >
                      {
                        tag.is_active !==
                        false
                          ? "ACTIVE"
                          : "INACTIVE"
                      }
                    </span>

                  </div>

                </div>


                <div className="photo-tag-admin-body">

                  <h3>
                    {tag.name}
                  </h3>


                  <p>
                    {
                      tag.description ||
                      "Programme photo overlay."
                    }
                  </p>


                  <div className="photo-tag-meta">

                    <span>
                      Default Position
                    </span>

                    <strong>
                      {
                        tag.default_position ||
                        "Center"
                      }
                    </strong>

                  </div>


                  <div className="photo-tag-meta">

                    <span>
                      Bottom Padding
                    </span>

                    <strong>
                      {
                        tag.bottom_padding ??
                        10
                      } px
                    </strong>

                  </div>


                  <div className="photo-tag-admin-actions">

                    <Link
                      to="/photo-tag"
                      target="_blank"
                      className="photo-tag-action use"
                    >
                      Use Tag
                    </Link>


                    <Link
                      to={`/media-admin/photo-tags/${tag.id}/edit`}
                      className="photo-tag-action edit"
                    >
                      Edit
                    </Link>


                    <button
                      type="button"
                      className="photo-tag-action delete"
                      onClick={() =>
                        deleteTag(tag)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </article>

            )
          )}

        </div>

      ) : (

        <div className="photo-tag-admin-empty">

          <h3>
            No photo tags found
          </h3>

          <p>
            Upload your first PNG programme
            tag for the media team.
          </p>

          <Link
            to="/media-admin/photo-tags/add"
          >
            Add Photo Tag
          </Link>

        </div>

      )}

    </div>
  );
};


export default PhotoTagAdmin;