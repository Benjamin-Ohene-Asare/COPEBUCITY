import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import "./GalleryAdmin.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const GalleryAdmin = () => {
  const [albums, setAlbums] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  const loadAlbums = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_BASE}/gallery/`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Unable to load gallery albums."
        );
      }

      setAlbums(
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
    loadAlbums();
  }, []);


  const deleteAlbum =
    async (album) => {

      const confirmed =
        window.confirm(
          `Delete "${album.title}" gallery album?`
        );

      if (!confirmed) return;


      try {
        const response =
          await fetch(
            `${API_BASE}/gallery/${album.slug}/`,
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
            "Unable to delete gallery album."
          );
        }


        setAlbums(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== album.id
            )
        );

      } catch (err) {
        setError(
          err.message
        );
      }
    };


  const filteredAlbums =
    albums.filter(
      (album) => {

        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        return (
          album.title
            ?.toLowerCase()
            .includes(query) ||

          album.description
            ?.toLowerCase()
            .includes(query)
        );
      }
    );


  const getCover = (
    album
  ) => {
    return (
      album.cover ||
      album.cover_image ||
      null
    );
  };


  const getPhotoCount = (
    album
  ) => {
    return (
      album.image_count ??
      album.photo_count ??
      album.images?.length ??
      0
    );
  };


  return (
    <div className="gallery-admin-page">

      {/* HEADER */}

      <div className="gallery-admin-heading">

        <div>

          <span>
            CONTENT MANAGEMENT
          </span>

          <h2>
            Gallery
          </h2>

          <p>
            Create photo albums, upload images
            and manage gallery submissions.
          </p>

        </div>


        <Link
          to="/media-admin/gallery/create"
          className="gallery-admin-add-btn"
        >
          + Create Gallery
        </Link>

      </div>


      {/* TOOLBAR */}

      <div className="gallery-admin-toolbar">

        <div className="gallery-admin-search">

          <input
            type="text"
            placeholder="Search gallery albums..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <div className="gallery-admin-total">

          <span>
            Total Albums
          </span>

          <strong>
            {albums.length}
          </strong>

        </div>

      </div>


      {error && (
        <div className="gallery-admin-error">
          {error}
        </div>
      )}


      {/* ALBUMS */}

      {loading ? (

        <div className="gallery-admin-loading">
          Loading gallery albums...
        </div>

      ) : filteredAlbums.length > 0 ? (

        <div className="gallery-admin-grid">

          {filteredAlbums.map(
            (album) => (

              <article
                className="gallery-admin-card"
                key={album.id}
              >

                <div className="gallery-admin-cover">

                  {getCover(album) ? (

                    <img
                      src={getCover(album)}
                      alt={album.title}
                    />

                  ) : (

                    <div className="gallery-admin-no-cover">
                      No Cover Image
                    </div>

                  )}


                  <span className="gallery-admin-photo-count">
                    {getPhotoCount(album)} Photos
                  </span>

                </div>


                <div className="gallery-admin-card-body">

                  <div className="gallery-admin-card-head">

                    <div>

                      <h3>
                        {album.title}
                      </h3>

                      <span>
                        {
                          album.date ||
                          album.created_at ||
                          "-"
                        }
                      </span>

                    </div>


                    <span
                      className={
                        album.allow_public_upload
                          ? "gallery-upload-status enabled"
                          : "gallery-upload-status disabled"
                      }
                    >
                      {
                        album.allow_public_upload
                          ? "Public Upload On"
                          : "Public Upload Off"
                      }
                    </span>

                  </div>


                  <p>
                    {
                      album.description ||
                      "No description added."
                    }
                  </p>


                  <div className="gallery-admin-actions">

                    <Link
                      to={`/gallery/${album.slug}`}
                      target="_blank"
                      className="gallery-action view"
                    >
                      View
                    </Link>


                    <Link
                      to={`/media-admin/gallery/${album.slug}/upload`}
                      className="gallery-action upload"
                    >
                      Upload Photos
                    </Link>

<Link
  to={`/media-admin/gallery/${album.slug}/submissions`}
  className="gallery-action submissions"
>
  Submissions
</Link>
                    <Link
                      to={`/media-admin/gallery/${album.slug}/edit`}
                      className="gallery-action edit"
                    >
                      Edit
                    </Link>


                    <button
                      type="button"
                      className="gallery-action delete"
                      onClick={() =>
                        deleteAlbum(
                          album
                        )
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

        <div className="gallery-admin-empty">

          <h3>
            No gallery albums found
          </h3>

          <p>
            Create your first gallery album
            to start uploading church photos.
          </p>

          <Link
            to="/media-admin/gallery/create"
          >
            Create Gallery
          </Link>

        </div>

      )}

    </div>
  );
};


export default GalleryAdmin;