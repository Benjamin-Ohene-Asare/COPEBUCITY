import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import "./GalleryUploads.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const GalleryUploads = () => {
  const { slug } = useParams();

  const fileInputRef =
    useRef(null);

  const [gallery, setGallery] =
    useState(null);

  const [files, setFiles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const loadGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_BASE}/gallery/${slug}/`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Unable to load gallery."
        );
      }

      setGallery(data);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadGallery();
  }, [slug]);


  const handleFiles = (
    selectedFiles
  ) => {

    const imageFiles =
      Array.from(
        selectedFiles
      ).filter(
        (file) =>
          file.type.startsWith(
            "image/"
          )
      );


    const formatted =
      imageFiles.map(
        (file) => ({
          file,
          preview:
            URL.createObjectURL(
              file
            ),
        })
      );


    setFiles(
      (prev) => [
        ...prev,
        ...formatted,
      ]
    );
  };


  const handleFileChange =
    (e) => {

      handleFiles(
        e.target.files
      );

      e.target.value = "";
    };


  const handleDrop =
    (e) => {

      e.preventDefault();

      handleFiles(
        e.dataTransfer.files
      );
    };


  const removeSelected =
    (index) => {

      setFiles((prev) => {

        const item =
          prev[index];

        if (item?.preview) {
          URL.revokeObjectURL(
            item.preview
          );
        }

        return prev.filter(
          (_, i) =>
            i !== index
        );
      });
    };


  const clearSelected = () => {

    files.forEach(
      (item) => {
        URL.revokeObjectURL(
          item.preview
        );
      }
    );

    setFiles([]);
  };


  const uploadPhotos =
    async () => {

      if (
        files.length === 0
      ) {
        return;
      }

      try {
        setUploading(true);
        setError("");
        setSuccess("");


        /*
          Your current public gallery
          uploader already sends one
          image at a time.

          So for now, upload each
          selected image separately.
        */

        for (
          const item of files
        ) {

          const formData =
            new FormData();

          formData.append(
            "image",
            item.file
          );

          formData.append(
            "name",
            "Media Admin"
          );

          formData.append(
            "caption",
            ""
          );


          const response =
            await fetch(
              `${API_BASE}/gallery/${slug}/upload/`,
              {
                method: "POST",
                body: formData,
              }
            );


          let data = {};

          try {
            data =
              await response.json();
          } catch {
            // no JSON response
          }


          if (!response.ok) {
            throw new Error(
              data.detail ||
              `Unable to upload ${item.file.name}`
            );
          }
        }


        clearSelected();

        setSuccess(
          "Photos uploaded successfully."
        );

        await loadGallery();


      } catch (err) {
        setError(
          err.message
        );

      } finally {
        setUploading(false);
      }
    };


  const deletePhoto =
    async (photo) => {

      const confirmed =
        window.confirm(
          "Delete this photo?"
        );

      if (!confirmed) {
        return;
      }


      try {
        setError("");


        /*
          This requires a delete
          endpoint in Django.

          We will add it when we
          finish the admin CRUD APIs.
        */

        const response =
          await fetch(
            `${API_BASE}/gallery/${slug}/images/${photo.id}/`,
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
            "Unable to delete photo."
          );
        }


        setGallery(
          (prev) => ({
            ...prev,

            images:
              prev.images.filter(
                (item) =>
                  item.id !== photo.id
              ),
          })
        );


      } catch (err) {
        setError(
          err.message
        );
      }
    };


  if (loading) {
    return (
      <div className="gallery-uploads-loading">
        Loading gallery...
      </div>
    );
  }


  if (!gallery) {
    return (
      <div className="gallery-uploads-empty">
        Gallery not found.
      </div>
    );
  }


  const existingPhotos =
    gallery.images || [];


  return (
    <div className="gallery-uploads-page">

      {/* HEADER */}

      <div className="gallery-uploads-heading">

        <div>

          <Link
            to="/media-admin/gallery"
            className="gallery-uploads-back"
          >
            ← Back to Gallery
          </Link>


          <span>
            GALLERY MANAGEMENT
          </span>


          <h2>
            {gallery.title}
          </h2>


          <p>
            Upload and manage photos in
            this gallery album.
          </p>

        </div>


        <Link
          to={`/gallery/${slug}`}
          target="_blank"
          className="gallery-uploads-view"
        >
          View Public Gallery
        </Link>

      </div>


      {error && (
        <div className="gallery-uploads-message error">
          {error}
        </div>
      )}


      {success && (
        <div className="gallery-uploads-message success">
          {success}
        </div>
      )}


      {/* UPLOAD PANEL */}

      <section className="gallery-uploads-card">

        <div className="gallery-uploads-card-heading">

          <div>

            <span>
              UPLOAD PHOTOS
            </span>

            <h3>
              Add Images
            </h3>

          </div>


          {files.length > 0 && (
            <button
              type="button"
              className="gallery-clear-selection"
              onClick={
                clearSelected
              }
            >
              Clear Selection
            </button>
          )}

        </div>


        <div
          className="gallery-admin-drop-area"
          onDragOver={(e) =>
            e.preventDefault()
          }
          onDrop={
            handleDrop
          }
          onClick={() =>
            fileInputRef.current
              ?.click()
          }
        >

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={
              handleFileChange
            }
          />


          <div className="gallery-admin-drop-icon">
            +
          </div>

          <strong>
            Drop photos here
          </strong>

          <p>
            or click to browse your device
          </p>

          <span>
            JPG, JPEG, PNG or WEBP
          </span>

        </div>


        {files.length > 0 && (

          <div className="gallery-selected-section">

            <div className="gallery-selected-heading">

              <strong>
                Selected Photos
              </strong>

              <span>
                {files.length}
                {" "}
                {files.length === 1
                  ? "photo"
                  : "photos"}
              </span>

            </div>


            <div className="gallery-selected-grid">

              {files.map(
                (item, index) => (

                  <div
                    className="gallery-selected-card"
                    key={`${item.file.name}-${index}`}
                  >

                    <img
                      src={item.preview}
                      alt={
                        item.file.name
                      }
                    />


                    <button
                      type="button"
                      onClick={() =>
                        removeSelected(
                          index
                        )
                      }
                    >
                      ×
                    </button>

                  </div>

                )
              )}

            </div>


            <div className="gallery-upload-actions">

              <button
                type="button"
                className="gallery-upload-submit"
                onClick={
                  uploadPhotos
                }
                disabled={
                  uploading
                }
              >
                {uploading
                  ? "Uploading..."
                  : `Upload ${files.length} Photos`}
              </button>

            </div>

          </div>

        )}

      </section>


      {/* EXISTING PHOTOS */}

      <section className="gallery-uploads-card">

        <div className="gallery-uploads-card-heading">

          <div>

            <span>
              ALBUM CONTENT
            </span>

            <h3>
              Existing Photos
            </h3>

          </div>


          <strong className="gallery-existing-count">
            {existingPhotos.length}
          </strong>

        </div>


        {existingPhotos.length > 0 ? (

          <div className="gallery-existing-grid">

            {existingPhotos.map(
              (photo) => {

                const imageUrl =
                  photo.image ||
                  photo.file ||
                  photo.url;

                return (
                  <article
                    className="gallery-existing-card"
                    key={photo.id}
                  >

                    <div className="gallery-existing-image">

                      <img
                        src={imageUrl}
                        alt={
                          photo.caption ||
                          gallery.title
                        }
                      />

                    </div>


                    <div className="gallery-existing-info">

                      <div>

                        <strong>
                          {
                            photo.caption ||
                            "Gallery Photo"
                          }
                        </strong>

                        <span>
                          {
                            photo.created_at
                              ? new Date(
                                  photo.created_at
                                ).toLocaleDateString()
                              : ""
                          }
                        </span>

                      </div>


                      <button
                        type="button"
                        className="gallery-photo-delete"
                        onClick={() =>
                          deletePhoto(
                            photo
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        ) : (

          <div className="gallery-existing-empty">

            <h3>
              No photos yet
            </h3>

            <p>
              Upload photos above to
              populate this gallery album.
            </p>

          </div>

        )}

      </section>

    </div>
  );
};


export default GalleryUploads;