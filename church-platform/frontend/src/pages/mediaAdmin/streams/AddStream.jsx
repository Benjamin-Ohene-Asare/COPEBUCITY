import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./AddStream.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const AddStream = () => {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      platform: "youtube",
      stream_type: "live",
      video_url: "",
      embed_url: "",
      channel_name: "Ebucity Church",
      published_at: "",
      is_live: false,
      is_featured: false,
      is_active: true,
    });

  const [thumbnail, setThumbnail] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  const handleThumbnail =
    (e) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      setThumbnail(file);

      setPreview(
        URL.createObjectURL(file)
      );
    };


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");


      if (!form.title.trim()) {
        setError(
          "Stream title is required."
        );

        return;
      }


      if (!form.video_url.trim()) {
        setError(
          "Video or stream URL is required."
        );

        return;
      }


      try {
        setSaving(true);

        const formData =
          new FormData();


        Object.entries(form)
          .forEach(
            ([key, value]) => {

              if (
                value !== "" &&
                value !== null
              ) {
                formData.append(
                  key,
                  typeof value ===
                  "boolean"
                    ? value
                      ? "true"
                      : "false"
                    : value
                );
              }

            }
          );


        if (thumbnail) {
          formData.append(
            "thumbnail",
            thumbnail
          );
        }


        const response =
          await fetch(
            `${API_BASE}/streams/`,
            {
              method: "POST",
              body: formData,
            }
          );


        const data =
          await response.json();


        if (!response.ok) {
          console.error(data);

          throw new Error(
            data.detail ||
            "Unable to create stream."
          );
        }


        navigate(
          "/media-admin/streams"
        );


      } catch (err) {
        setError(
          err.message
        );

      } finally {
        setSaving(false);
      }
    };


  return (
    <div className="add-stream-page">

      <div className="add-stream-heading">

        <Link
          to="/media-admin/streams"
        >
          ← Back to Live Streams
        </Link>

        <span>
          MEDIA MANAGEMENT
        </span>

        <h2>
          Add Stream
        </h2>

        <p>
          Add a live broadcast or
          recorded church video.
        </p>

      </div>


      {error && (
        <div className="add-stream-error">
          {error}
        </div>
      )}


      <form
        onSubmit={handleSubmit}
      >

        <div className="add-stream-grid">


          {/* MAIN */}

          <section className="add-stream-card">

            <div className="add-stream-card-title">

              <span>
                STREAM DETAILS
              </span>

              <h3>
                Basic Information
              </h3>

            </div>


            <div className="stream-form-field">

              <label>
                Stream Title *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Sunday Worship Service"
              />

            </div>


            <div className="stream-form-row">

              <div className="stream-form-field">

                <label>
                  Platform
                </label>

                <select
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                >
                  <option value="youtube">
                    YouTube
                  </option>

                  <option value="facebook">
                    Facebook
                  </option>
                </select>

              </div>


              <div className="stream-form-field">

                <label>
                  Stream Type
                </label>

                <select
                  name="stream_type"
                  value={form.stream_type}
                  onChange={handleChange}
                >
                  <option value="live">
                    Live Stream
                  </option>

                  <option value="video">
                    Recorded Video
                  </option>
                </select>

              </div>

            </div>


            <div className="stream-form-field">

              <label>
                Video / Stream URL *
              </label>

              <input
                type="url"
                name="video_url"
                value={form.video_url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />

              <small>
                Paste the normal YouTube
                or Facebook video link.
              </small>

            </div>


            <div className="stream-form-field">

              <label>
                Embed URL
              </label>

              <input
                type="url"
                name="embed_url"
                value={form.embed_url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/embed/..."
              />

              <small>
                This is the URL used inside
                the website video player.
              </small>

            </div>


            <div className="stream-form-row">

              <div className="stream-form-field">

                <label>
                  Channel Name
                </label>

                <input
                  type="text"
                  name="channel_name"
                  value={form.channel_name}
                  onChange={handleChange}
                />

              </div>


              <div className="stream-form-field">

                <label>
                  Published At
                </label>

                <input
                  type="datetime-local"
                  name="published_at"
                  value={form.published_at}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="stream-form-field">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a short description about this broadcast..."
              />

            </div>

          </section>


          {/* SIDE */}

          <aside className="add-stream-side">

            <section className="add-stream-card">

              <div className="add-stream-card-title">

                <span>
                  THUMBNAIL
                </span>

                <h3>
                  Video Cover
                </h3>

              </div>


              <label className="stream-thumbnail-upload">

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={
                    handleThumbnail
                  }
                />


                {preview ? (

                  <img
                    src={preview}
                    alt="Stream preview"
                  />

                ) : (

                  <div>

                    <strong>
                      Upload Thumbnail
                    </strong>

                    <span>
                      Recommended 16:9
                    </span>

                  </div>

                )}

              </label>

            </section>


            <section className="add-stream-card stream-options-card">

              <div className="stream-option">

                <div>
                  <strong>
                    Live Now
                  </strong>

                  <span>
                    Mark this broadcast
                    as currently live.
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="is_live"
                  checked={form.is_live}
                  onChange={handleChange}
                />

              </div>


              <div className="stream-option">

                <div>
                  <strong>
                    Featured
                  </strong>

                  <span>
                    Feature this stream
                    prominently.
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="is_featured"
                  checked={
                    form.is_featured
                  }
                  onChange={handleChange}
                />

              </div>


              <div className="stream-option">

                <div>
                  <strong>
                    Active
                  </strong>

                  <span>
                    Display this stream
                    on the website.
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />

              </div>

            </section>

          </aside>

        </div>


        <div className="add-stream-actions">

          <Link
            to="/media-admin/streams"
          >
            Cancel
          </Link>


          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving Stream..."
              : "Save Stream"}
          </button>

        </div>

      </form>

    </div>
  );
};


export default AddStream;