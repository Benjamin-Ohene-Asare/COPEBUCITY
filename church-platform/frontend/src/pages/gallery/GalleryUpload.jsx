import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import "./GalleryUpload.css";

import {
  getGalleryAlbum,
  uploadGalleryImage,
} from "../../api/api";

const GalleryUpload = () => {
  const { slug } = useParams();

  const fileInputRef = useRef(null);

  const [gallery, setGallery] = useState(null);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");


  // ==========================================
  // LOAD ALBUM
  // ==========================================

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        const data = await getGalleryAlbum(slug);
        setGallery(data);
      } catch (error) {
        console.error(
          "Failed to load album:",
          error
        );

        setError(
          "Unable to load this gallery."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAlbum();
  }, [slug]);


  // ==========================================
  // FILE SELECTION
  // ==========================================

  const handleFiles = (selectedFiles) => {
    const imageFiles = Array.from(
      selectedFiles
    ).filter((file) =>
      file.type.startsWith("image/")
    );

    const formattedFiles = imageFiles.map(
      (file) => ({
        file,
        preview: URL.createObjectURL(file),
      })
    );

    setFiles((prev) => [
      ...prev,
      ...formattedFiles,
    ]);
  };


  const handleFileChange = (e) => {
    handleFiles(e.target.files);

    e.target.value = "";
  };


  const handleDrop = (e) => {
    e.preventDefault();

    handleFiles(
      e.dataTransfer.files
    );
  };


  const removeImage = (index) => {
    setFiles((prev) => {
      URL.revokeObjectURL(
        prev[index].preview
      );

      return prev.filter(
        (_, i) => i !== index
      );
    });
  };


  // ==========================================
  // CLEAN PREVIEWS
  // ==========================================

  useEffect(() => {
    return () => {
      files.forEach((item) => {
        URL.revokeObjectURL(
          item.preview
        );
      });
    };
  }, [files]);


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setError(
        "Please select at least one photo."
      );

      return;
    }

    if (
      !gallery?.allow_public_upload
    ) {
      setError(
        "Public uploads are not enabled for this gallery."
      );

      return;
    }

    try {
      setUploading(true);
      setError("");

      for (const item of files) {
        const formData =
          new FormData();

        formData.append(
          "name",
          name
        );

        formData.append(
          "caption",
          caption
        );

        formData.append(
          "image",
          item.file
        );

        await uploadGalleryImage(
          slug,
          formData
        );
      }

      files.forEach((item) => {
        URL.revokeObjectURL(
          item.preview
        );
      });

      setFiles([]);

      setSubmitted(true);

    } catch (error) {
      console.error(
        "Gallery upload failed:",
        error
      );

      setError(
        "Your photos could not be submitted. Please try again."
      );

    } finally {
      setUploading(false);
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="gallery-upload-page">

        <section className="upload-success">

          <div className="upload-success-card">
            <p>
              Loading gallery...
            </p>
          </div>

        </section>

      </main>
    );
  }


  // ==========================================
  // INVALID / CLOSED ALBUM
  // ==========================================

  if (
    !gallery ||
    !gallery.allow_public_upload
  ) {
    return (
      <main className="gallery-upload-page">

        <section className="upload-success">

          <div className="upload-success-card">

            <h1>
              Uploads Closed
            </h1>

            <p>
              Public photo uploads are not
              currently enabled for this gallery.
            </p>

            <Link
              to={`/gallery/${slug}`}
              className="upload-success-btn"
            >
              Back to Gallery
            </Link>

          </div>

        </section>

      </main>
    );
  }


  // ==========================================
  // SUCCESS
  // ==========================================

  if (submitted) {
    return (
      <main className="gallery-upload-page">

        <section className="upload-success">

          <div className="upload-success-card">

            <div className="upload-success-icon">
              ✓
            </div>

            <h1>
              Photos Submitted
            </h1>

            <p>
              Your photos have been submitted
              successfully. They will be reviewed
              by the church media team before
              appearing in the gallery.
            </p>

            <Link
              to={`/gallery/${slug}`}
              className="upload-success-btn"
            >
              Back to Gallery
            </Link>

          </div>

        </section>

      </main>
    );
  }


  return (
    <main className="gallery-upload-page">

      {/* HERO */}

      <section className="gallery-upload-hero">

        <div className="gallery-upload-hero-container">

          <Link
            to={`/gallery/${slug}`}
            className="gallery-upload-back"
          >
            ← Back to Collection
          </Link>


          <span className="gallery-upload-label">
            CONTRIBUTE TO THE GALLERY
          </span>

          <h1>
            Upload Your <span>Photos</span>
          </h1>

          <p>
            Share your photos from{" "}
            <strong>
              {gallery.title}
            </strong>.
            Submitted photos will be reviewed
            before they are published.
          </p>

        </div>

      </section>


      {/* FORM */}

      <section className="gallery-upload-section">

        <form
          className="gallery-upload-form"
          onSubmit={handleSubmit}
        >

          <div className="upload-form-heading">

            <span>
              PHOTO SUBMISSION
            </span>

            <h2>
              Add Photos
            </h2>

          </div>


          {/* NAME */}

          <div className="upload-field">

            <label>
              Your Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* CAPTION */}

          <div className="upload-field">

            <label>
              Caption
              <span> Optional</span>
            </label>

            <textarea
              placeholder="Add a short description about the photos..."
              value={caption}
              onChange={(e) =>
                setCaption(e.target.value)
              }
            />

          </div>


          {/* DROP AREA */}

          <div
            className="gallery-drop-area"
            onDragOver={(e) =>
              e.preventDefault()
            }
            onDrop={handleDrop}
            onClick={() =>
              fileInputRef.current?.click()
            }
          >

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />

            <div className="drop-upload-icon">
              ↑
            </div>

            <h3>
              Drop your photos here
            </h3>

            <p>
              or click to browse from
              your device
            </p>

            <span>
              JPG, JPEG, PNG or WEBP
            </span>

          </div>


          {/* PREVIEWS */}

          {files.length > 0 && (

            <div className="upload-preview-section">

              <div className="upload-preview-heading">

                <h3>
                  Selected Photos
                </h3>

                <span>
                  {files.length}{" "}
                  {files.length === 1
                    ? "photo"
                    : "photos"}
                </span>

              </div>


              <div className="upload-preview-grid">

                {files.map(
                  (item, index) => (

                    <div
                      className="upload-preview-card"
                      key={`${item.file.name}-${index}`}
                    >

                      <img
                        src={item.preview}
                        alt={item.file.name}
                      />

                      <button
                        type="button"
                        className="remove-upload-image"
                        onClick={(e) => {
                          e.stopPropagation();

                          removeImage(index);
                        }}
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {error && (
            <div className="upload-error">
              {error}
            </div>
          )}


          {/* NOTICE */}

          <div className="upload-notice">

            <div className="upload-notice-icon">
              i
            </div>

            <p>
              Photos submitted here will not
              appear immediately. The media team
              must approve them before they are
              added to the public gallery.
            </p>

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="gallery-submit-btn"
            disabled={
              files.length === 0 ||
              uploading
            }
          >
            {uploading
              ? "Uploading..."
              : "Submit Photos"}

            {!uploading && (
              <span>
                →
              </span>
            )}

          </button>

        </form>

      </section>

    </main>
  );
};

export default GalleryUpload;