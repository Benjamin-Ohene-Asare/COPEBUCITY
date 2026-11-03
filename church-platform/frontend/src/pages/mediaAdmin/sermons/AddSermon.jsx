import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./AddSermon.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const AddSermon = () => {
  const navigate =
    useNavigate();


  const [form, setForm] =
    useState({
      title: "",
      preacher: "",
      scripture: "",
      series: "",
      date: "",
      description: "",
      is_published: true,
    });


  const [image, setImage] =
    useState(null);

  const [audio, setAudio] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
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


  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;


    setImage(file);


    const preview =
      URL.createObjectURL(file);

    setImagePreview(
      preview
    );
  };


  const handleAudioChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setAudio(file);
  };


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");
      setSuccess("");


      if (
        !form.title.trim()
      ) {
        setError(
          "Sermon title is required."
        );

        return;
      }


      try {
        setSaving(true);


        const formData =
          new FormData();


        formData.append(
          "title",
          form.title
        );


        formData.append(
          "preacher",
          form.preacher
        );


        formData.append(
          "scripture",
          form.scripture
        );


        formData.append(
          "series",
          form.series
        );


        formData.append(
          "date",
          form.date
        );


        formData.append(
          "description",
          form.description
        );


        formData.append(
          "is_published",
          form.is_published
            ? "true"
            : "false"
        );


        if (image) {
          formData.append(
            "image",
            image
          );
        }


        if (audio) {
          formData.append(
            "audio",
            audio
          );
        }


        const response =
          await fetch(
            `${API_BASE}/sermons/`,
            {
              method: "POST",

              body: formData,
            }
          );


        const data =
          await response.json();


        if (!response.ok) {
          console.error(
            data
          );

          throw new Error(
            data.detail ||
            "Unable to create sermon."
          );
        }


        setSuccess(
          "Sermon created successfully."
        );


        setTimeout(() => {
          navigate(
            "/media-admin/sermons"
          );
        }, 800);


      } catch (err) {
        setError(
          err.message
        );

      } finally {
        setSaving(false);
      }
    };


  return (
    <div className="add-sermon-page">

      {/* HEADER */}

      <div className="add-sermon-heading">

        <div>

          <Link
            to="/media-admin/sermons"
            className="add-sermon-back"
          >
            ← Back to Sermons
          </Link>


          <span>
            SERMON MANAGEMENT
          </span>


          <h2>
            Add New Sermon
          </h2>


          <p>
            Add sermon information,
            cover artwork and audio.
          </p>

        </div>

      </div>


      {error && (
        <div className="add-sermon-message error">
          {error}
        </div>
      )}


      {success && (
        <div className="add-sermon-message success">
          {success}
        </div>
      )}


      <form
        className="add-sermon-form"
        onSubmit={handleSubmit}
      >

        <div className="add-sermon-grid">


          {/* =================================
              MAIN CONTENT
          ================================= */}

          <section className="add-sermon-card">

            <div className="add-sermon-card-heading">

              <span>
                SERMON DETAILS
              </span>

              <h3>
                Basic Information
              </h3>

            </div>


            <div className="add-sermon-field">

              <label>
                Sermon Title
                <strong>*</strong>
              </label>

              <input
                type="text"
                name="title"
                placeholder="e.g. Walking By Faith"
                value={form.title}
                onChange={handleChange}
              />

            </div>


            <div className="add-sermon-two-column">

              <div className="add-sermon-field">

                <label>
                  Preacher
                </label>

                <input
                  type="text"
                  name="preacher"
                  placeholder="e.g. Ps. Joseph K. Amesinu"
                  value={form.preacher}
                  onChange={handleChange}
                />

              </div>


              <div className="add-sermon-field">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="add-sermon-two-column">

              <div className="add-sermon-field">

                <label>
                  Scripture
                </label>

                <input
                  type="text"
                  name="scripture"
                  placeholder="e.g. Hebrews 11:1-6"
                  value={form.scripture}
                  onChange={handleChange}
                />

              </div>


              <div className="add-sermon-field">

                <label>
                  Series
                </label>

                <input
                  type="text"
                  name="series"
                  placeholder="e.g. Faith Series"
                  value={form.series}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="add-sermon-field">

              <label>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Write a short description or sermon summary..."
                value={form.description}
                onChange={handleChange}
              />

            </div>

          </section>


          {/* =================================
              MEDIA
          ================================= */}

          <aside className="add-sermon-side">


            <section className="add-sermon-card">

              <div className="add-sermon-card-heading">

                <span>
                  COVER
                </span>

                <h3>
                  Sermon Image
                </h3>

              </div>


              <label className="sermon-upload-box">

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={
                    handleImageChange
                  }
                />


                {imagePreview ? (

                  <img
                    src={imagePreview}
                    alt="Sermon preview"
                  />

                ) : (

                  <div>

                    <strong>
                      Upload Cover Image
                    </strong>

                    <span>
                      JPG, PNG or WEBP
                    </span>

                  </div>

                )}

              </label>


              {image && (
                <p className="sermon-selected-file">
                  {image.name}
                </p>
              )}

            </section>


            <section className="add-sermon-card">

              <div className="add-sermon-card-heading">

                <span>
                  AUDIO
                </span>

                <h3>
                  Sermon Audio
                </h3>

              </div>


              <label className="sermon-audio-upload">

                <input
                  type="file"
                  accept="audio/*"
                  hidden
                  onChange={
                    handleAudioChange
                  }
                />


                <strong>
                  Choose Audio File
                </strong>

                <span>
                  MP3, WAV, M4A
                </span>

              </label>


              {audio && (

                <div className="sermon-audio-selected">

                  <strong>
                    {audio.name}
                  </strong>

                  <span>
                    {(
                      audio.size /
                      1024 /
                      1024
                    ).toFixed(2)}
                    {" "}
                    MB
                  </span>

                </div>

              )}

            </section>


            <section className="add-sermon-card publish-card">

              <div>

                <strong>
                  Publish Sermon
                </strong>

                <span>
                  Make this sermon visible
                  on the website.
                </span>

              </div>


              <label className="admin-switch">

                <input
                  type="checkbox"
                  name="is_published"
                  checked={
                    form.is_published
                  }
                  onChange={
                    handleChange
                  }
                />

                <span></span>

              </label>

            </section>

          </aside>

        </div>


        {/* =================================
            ACTIONS
        ================================= */}

        <div className="add-sermon-actions">

          <Link
            to="/media-admin/sermons"
            className="add-sermon-cancel"
          >
            Cancel
          </Link>


          <button
            type="submit"
            className="add-sermon-submit"
            disabled={saving}
          >
            {saving
              ? "Saving Sermon..."
              : "Save Sermon"}
          </button>

        </div>

      </form>

    </div>
  );
};


export default AddSermon;