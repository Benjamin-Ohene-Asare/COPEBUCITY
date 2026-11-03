import React, { useEffect, useMemo, useState } from "react";
import "./PhotoTag.css";

import {
  getPhotoTags,
  applyPhotoTag,
} from "../../api/api";

const PhotoTag = () => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [position, setPosition] = useState("bottom-center");

  const [resultBlob, setResultBlob] = useState(null);
  const [resultPreview, setResultPreview] = useState("");

  const [loadingTags, setLoadingTags] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // LOAD AVAILABLE PNG TAGS
  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await getPhotoTags();

        setTags(data);

        if (data.length > 0) {
          setSelectedTag(String(data[0].id));
        }
      } catch (error) {
        console.error("Failed to load tags:", error);
        setError("Unable to load programme tags.");
      } finally {
        setLoadingTags(false);
      }
    };

    loadTags();
  }, []);

  // CLEAN OBJECT URLS
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }

      if (resultPreview) {
        URL.revokeObjectURL(resultPreview);
      }
    };
  }, [photoPreview, resultPreview]);

  const selectedTagData = useMemo(() => {
    return tags.find(
      (tag) => String(tag.id) === String(selectedTag)
    );
  }, [tags, selectedTag]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image.");
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    if (resultPreview) {
      URL.revokeObjectURL(resultPreview);
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));

    setResultBlob(null);
    setResultPreview("");
    setError("");
  };

  const handleApplyTag = async () => {
    if (!photo) {
      setError("Please choose a photo first.");
      return;
    }

    if (!selectedTag) {
      setError("Please choose a programme tag.");
      return;
    }

    try {
      setProcessing(true);
      setError("");

      const formData = new FormData();

      formData.append("photo", photo);
      formData.append("tag_id", selectedTag);
      formData.append("position", position);

      const blob = await applyPhotoTag(formData);

      if (resultPreview) {
        URL.revokeObjectURL(resultPreview);
      }

      const previewUrl = URL.createObjectURL(blob);

      setResultBlob(blob);
      setResultPreview(previewUrl);

    } catch (error) {
      console.error("Tagging failed:", error);

      setError(
        error.message ||
        "Unable to apply the tag."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !resultPreview) return;

    const originalName =
      photo?.name?.replace(/\.[^/.]+$/, "") || "photo";

    const link = document.createElement("a");

    link.href = resultPreview;
    link.download = `${originalName}-tagged.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <main className="photo-tag-page">

      {/* HERO */}

      <section className="photo-tag-hero">

        <div className="photo-tag-hero-content">

          <span>
            MEDIA TOOL
          </span>

          <h1>
            Add Programme <strong>Tag</strong>
          </h1>

          <p>
            Upload a church photo, choose the programme tag
            and position, then generate a ready-to-post image.
          </p>

        </div>

      </section>


      {/* TOOL */}

      <section className="photo-tag-section">

        <div className="photo-tag-container">


          {/* LEFT CONTROLS */}

          <div className="photo-tag-controls">

            <div className="photo-tag-heading">

              <span>
                PHOTO TAGGING
              </span>

              <h2>
                Prepare Your Photo
              </h2>

            </div>


            {/* SELECT TAG */}

            <div className="photo-tag-field">

              <label>
                Programme Tag
              </label>

              {loadingTags ? (
                <p>
                  Loading tags...
                </p>
              ) : (

                <select
                  value={selectedTag}
                  onChange={(e) =>
                    setSelectedTag(e.target.value)
                  }
                >

                  {tags.map((tag) => (
                    <option
                      key={tag.id}
                      value={tag.id}
                    >
                      {tag.name}
                    </option>
                  ))}

                </select>

              )}

            </div>


            {/* SHOW SELECTED PNG */}

            {selectedTagData?.png_file && (

              <div className="selected-tag-preview">

                <span>
                  Selected Tag
                </span>

                <img
                  src={selectedTagData.png_file}
                  alt={selectedTagData.name}
                />

              </div>

            )}


            {/* UPLOAD */}

            <div className="photo-tag-field">

              <label>
                Choose Photo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />

            </div>


            {/* POSITION */}

            <div className="photo-tag-field">

              <label>
                Tag Position
              </label>

              <div className="photo-position-options">

                <button
                  type="button"
                  className={
                    position === "bottom-left"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setPosition("bottom-left")
                  }
                >
                  Bottom Left
                </button>


                <button
                  type="button"
                  className={
                    position === "bottom-center"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setPosition("bottom-center")
                  }
                >
                  Bottom Center
                </button>


                <button
                  type="button"
                  className={
                    position === "bottom-right"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setPosition("bottom-right")
                  }
                >
                  Bottom Right
                </button>

              </div>

            </div>


            {error && (
              <div className="photo-tag-error">
                {error}
              </div>
            )}


            <button
              type="button"
              className="photo-tag-generate"
              onClick={handleApplyTag}
              disabled={
                processing ||
                !photo ||
                !selectedTag
              }
            >
              {processing
                ? "Processing..."
                : "Apply Tag"}
            </button>


            {resultBlob && (
              <button
                type="button"
                className="photo-tag-download"
                onClick={handleDownload}
              >
                Download Tagged Photo
              </button>
            )}

          </div>


          {/* RIGHT PREVIEW */}

          <div className="photo-tag-preview-panel">

            <div className="photo-tag-preview-heading">

              <span>
                PREVIEW
              </span>

              <h3>
                {resultPreview
                  ? "Tagged Photo"
                  : "Original Photo"}
              </h3>

            </div>


            <div className="photo-tag-preview">

              {resultPreview ? (

                <img
                  src={resultPreview}
                  alt="Tagged result"
                />

              ) : photoPreview ? (

                <div className="photo-tag-live-preview">

                  <img
                    src={photoPreview}
                    alt="Uploaded preview"
                    className="photo-tag-base-image"
                  />


                  {selectedTagData?.png_file && (

                    <img
                      src={selectedTagData.png_file}
                      alt="Programme tag"
                      className={`photo-tag-overlay-preview ${position}`}
                    />

                  )}

                </div>

              ) : (

                <div className="photo-tag-empty">

                  <span>
                    +
                  </span>

                  <h3>
                    Choose a photo
                  </h3>

                  <p>
                    Your photo preview will appear here.
                  </p>

                </div>

              )}

            </div>


            <div className="photo-tag-note">

              <p>
                The final downloaded image is generated
                by the server. The tag is physically merged
                into the photo, not just displayed as an overlay.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default PhotoTag;