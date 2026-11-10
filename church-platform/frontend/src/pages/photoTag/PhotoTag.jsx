import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./PhotoTag.css";
import {
  getPhotoTags,
  applyPhotoTag,
} from "../../api/api";

const MAX_PHOTOS = 5;

const POSITIONS = [
  ["bottom-left", "Bottom Left"],
  ["bottom-center", "Bottom Center"],
  ["bottom-right", "Bottom Right"],
];

const PhotoTag = () => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [photos, setPhotos] = useState([]);
  const [position, setPosition] = useState("bottom-center");
  const [loadingTags, setLoadingTags] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
  });
  const [error, setError] = useState("");

  const urlsRef = useRef(new Set());
  const busyRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const loadTags = async () => {
      try {
        const data = await getPhotoTags();

        if (cancelled) return;

        const availableTags = Array.isArray(data) ? data : [];
        setTags(availableTags);

        if (availableTags.length > 0) {
          setSelectedTag(String(availableTags[0].id));
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load programme tags.");
        }
      } finally {
        if (!cancelled) {
          setLoadingTags(false);
        }
      }
    };

    loadTags();

    return () => {
      cancelled = true;
      mountedRef.current = false;

      urlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      urlsRef.current.clear();
    };
  }, []);

  const selectedTagData = useMemo(
    () =>
      tags.find(
        (tag) => String(tag.id) === String(selectedTag)
      ),
    [tags, selectedTag]
  );

  const createPreview = (blob) => {
    const url = URL.createObjectURL(blob);
    urlsRef.current.add(url);
    return url;
  };

  const revokePreview = (url) => {
    if (!url) return;

    URL.revokeObjectURL(url);
    urlsRef.current.delete(url);
  };

  const updatePhoto = (id, changes) => {
    if (!mountedRef.current) return;

    setPhotos((previous) =>
      previous.map((photo) =>
        photo.id === id
          ? { ...photo, ...changes }
          : photo
      )
    );
  };

  const resetResults = () => {
    photos.forEach((photo) => {
      revokePreview(photo.resultUrl);
    });

    setPhotos((previous) =>
      previous.map((photo) => ({
        ...photo,
        resultUrl: "",
        status: "ready",
        message: "",
      }))
    );

    setProgress({ completed: 0, total: 0 });
    setError("");
  };

  const handlePhotoChange = (event) => {
    if (busyRef.current) return;

    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    if (photos.length + files.length > MAX_PHOTOS) {
      setError(
        "You can select up to 5 photos. Remove a photo before adding more."
      );
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setError("Please select image files only.");
      return;
    }

    const newPhotos = files.map((file, index) => ({
      id: `${Date.now()}-${index}-${Math.random()}`,
      file,
      previewUrl: createPreview(file),
      resultUrl: "",
      status: "ready",
      message: "",
    }));

    setPhotos((previous) => [...previous, ...newPhotos]);
    setProgress({ completed: 0, total: 0 });
    setError("");
  };

  const removePhoto = (id) => {
    if (busyRef.current) return;

    const photo = photos.find((item) => item.id === id);
    if (!photo) return;

    revokePreview(photo.previewUrl);
    revokePreview(photo.resultUrl);

    setPhotos((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setProgress({ completed: 0, total: 0 });
    setError("");
  };

  const handleApplyTag = async () => {
    if (busyRef.current) return;

    if (!photos.length || !selectedTag) {
      setError("Choose your photos and a programme tag first.");
      return;
    }

    // Capture one tag and position for this whole batch.
    const batch = [...photos];
    const batchTag = selectedTag;
    const batchPosition = position;

    busyRef.current = true;
    setProcessing(true);
    setError("");
    setProgress({
      completed: 0,
      total: batch.length,
    });

    batch.forEach((photo) => {
      revokePreview(photo.resultUrl);
    });

    setPhotos((previous) =>
      previous.map((photo) => ({
        ...photo,
        resultUrl: "",
        status: "waiting",
        message: "",
      }))
    );

    let failed = 0;

    try {
      for (let index = 0; index < batch.length; index += 1) {
        if (!mountedRef.current) break;

        const photo = batch[index];
        updatePhoto(photo.id, { status: "processing" });

        try {
          const formData = new FormData();

          formData.append("photo", photo.file);
          formData.append("tag_id", batchTag);
          formData.append("position", batchPosition);

          const blob = await applyPhotoTag(formData);

          if (!mountedRef.current) break;

          if (!(blob instanceof Blob) || blob.size === 0) {
            throw new Error("The server returned an empty image.");
          }

          updatePhoto(photo.id, {
            status: "done",
            resultUrl: createPreview(blob),
            message: "",
          });
        } catch (requestError) {
          failed += 1;

          updatePhoto(photo.id, {
            status: "error",
            message:
              requestError.message || "Unable to process this photo.",
          });
        }

        if (mountedRef.current) {
          setProgress({
            completed: index + 1,
            total: batch.length,
          });
        }
      }

      if (mountedRef.current && failed > 0) {
        setError(
          `${failed} photo${failed === 1 ? "" : "s"} could not be processed. Successful results are available below.`
        );
      }
    } finally {
      busyRef.current = false;

      if (mountedRef.current) {
        setProcessing(false);
      }
    }
  };

  const downloadName = (file) => {
    const name = file.name.replace(/\.[^/.]+$/, "") || "photo";
    return `${name}-tagged.jpg`;
  };

  const completedCount = photos.filter(
    (photo) => photo.status === "done"
  ).length;

  return (
    <main className="photo-tag-page">
      <section className="photo-tag-hero">
        <div className="photo-tag-hero-content">
          <span>MEDIA TOOL</span>

          <h1>
            Add Programme <strong>Tag</strong>
          </h1>

          <p>
            Select up to five photos, choose a programme tag
            and position, then apply it to every photo.
          </p>
        </div>
      </section>

      <section className="photo-tag-section">
        <div className="photo-tag-container">
          <div className="photo-tag-controls">
            <div className="photo-tag-heading">
              <span>PHOTO TAGGING</span>
              <h2>Prepare Your Photos</h2>
            </div>

            <div className="photo-tag-field">
              <label htmlFor="programme-tag">
                Programme Tag
              </label>

              {loadingTags ? (
                <p>Loading tags...</p>
              ) : (
                <select
                  id="programme-tag"
                  value={selectedTag}
                  disabled={processing || !tags.length}
                  onChange={(event) => {
                    resetResults();
                    setSelectedTag(event.target.value);
                  }}
                >
                  {!tags.length && (
                    <option value="">No tags available</option>
                  )}

                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedTagData?.png_file && (
              <div className="selected-tag-preview">
                <span>Selected Tag</span>

                <img
                  src={selectedTagData.png_file}
                  alt={selectedTagData.name}
                />
              </div>
            )}

            <div className="photo-tag-field">
              <label htmlFor="photo-tag-files">
                Choose Photos ({photos.length}/{MAX_PHOTOS})
              </label>

              <input
                id="photo-tag-files"
                type="file"
                accept="image/*"
                multiple
                disabled={
                  processing || photos.length >= MAX_PHOTOS
                }
                onChange={handlePhotoChange}
              />

              <p className="photo-batch-help">
                You can add photos in separate selections,
                up to five in total.
              </p>
            </div>

            <div className="photo-tag-field">
              <label>Tag Position</label>

              <div
                className="photo-position-options"
                role="group"
                aria-label="Tag position"
              >
                {POSITIONS.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={position === value ? "active" : ""}
                    aria-pressed={position === value}
                    disabled={processing}
                    onClick={() => {
                      if (position === value) return;

                      resetResults();
                      setPosition(value);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="photo-tag-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="button"
              className="photo-tag-generate"
              onClick={handleApplyTag}
              disabled={
                processing ||
                loadingTags ||
                !photos.length ||
                !selectedTag
              }
            >
              {processing
                ? `Processing ${Math.min(
                    progress.completed + 1,
                    progress.total
                  )} of ${progress.total}...`
                : photos.length > 1
                ? `Apply Tag to All ${photos.length} Photos`
                : "Apply Tag"}
            </button>

            {progress.total > 0 && (
              <div className="photo-batch-progress">
                <progress
                  value={progress.completed}
                  max={progress.total}
                  aria-label="Photos processed"
                />

                <p role="status" aria-live="polite">
                  {processing
                    ? `${progress.completed} of ${progress.total} processed`
                    : `${completedCount} of ${progress.total} photos tagged successfully`}
                </p>
              </div>
            )}
          </div>

          <div className="photo-tag-preview-panel">
            <div className="photo-tag-preview-heading">
              <span>PREVIEW</span>
              <h3>
                {photos.length
                  ? `Your Photos (${photos.length})`
                  : "Choose Your Photos"}
              </h3>
            </div>

            {!photos.length ? (
              <div className="photo-tag-preview">
                <div className="photo-tag-empty">
                  <h3>Select up to five photos</h3>
                  <p>Your previews will appear here.</p>
                </div>
              </div>
            ) : (
              <div className="photo-batch-grid">
                {photos.map((photo, index) => (
                  <article
                    className="photo-batch-card"
                    key={photo.id}
                  >
                    <div className="photo-batch-card-heading">
                      <strong>Photo {index + 1}</strong>

                      <button
                        type="button"
                        className="photo-batch-remove"
                        disabled={processing}
                        onClick={() => removePhoto(photo.id)}
                        aria-label={`Remove ${photo.file.name}`}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="photo-batch-image">
                      {photo.resultUrl ? (
                        <img
                          src={photo.resultUrl}
                          alt={`Tagged ${photo.file.name}`}
                        />
                      ) : (
                        <div className="photo-tag-live-preview">
                          <img
                            src={photo.previewUrl}
                            alt={photo.file.name}
                            className="photo-tag-base-image"
                          />

                          {selectedTagData?.png_file && (
                            <img
                              src={selectedTagData.png_file}
                              alt=""
                              className={`photo-tag-overlay-preview ${position}`}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <p
                      className="photo-batch-name"
                      title={photo.file.name}
                    >
                      {photo.file.name}
                    </p>

                    <p className={`photo-batch-status ${photo.status}`}>
                      {photo.status === "ready" && "Ready to tag"}
                      {photo.status === "waiting" && "Waiting"}
                      {photo.status === "processing" && "Processing..."}
                      {photo.status === "done" && "Tagged successfully"}
                      {photo.status === "error" && photo.message}
                    </p>

                    {photo.resultUrl && (
                      <a
                        className="photo-tag-download photo-batch-download"
                        href={photo.resultUrl}
                        download={downloadName(photo.file)}
                      >
                        Download Tagged Photo
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}

            <div className="photo-tag-note">
              <p>
                Previews show the selected position. Each downloaded
                image has the programme tag permanently merged into it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PhotoTag;