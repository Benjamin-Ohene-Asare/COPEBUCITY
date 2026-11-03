import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./CreateGallery.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const CreateGallery = () => {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      title: "",
      date: "",
      description: "",
      allow_public_upload: false,
    });

  const [cover, setCover] =
    useState(null);

  const [coverPreview, setCoverPreview] =
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


  const handleCoverChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setCover(file);

    const preview =
      URL.createObjectURL(file);

    setCoverPreview(
      preview
    );
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
          "Gallery title is required."
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
          "date",
          form.date
        );


        formData.append(
          "description",
          form.description
        );


        formData.append(
          "allow_public_upload",
          form.allow_public_upload
            ? "true"
            : "false"
        );


        if (cover) {
          formData.append(
            "cover",
            cover
          );
        }


        const response =
          await fetch(
            `${API_BASE}/gallery/`,
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
            "Unable to create gallery."
          );
        }


        setSuccess(
          "Gallery created successfully."
        );


        setTimeout(() => {
          navigate(
            "/media-admin/gallery"
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
    <div className="create-gallery-page">

      {/* HEADER */}

      <div className="create-gallery-heading">

        <Link
          to="/media-admin/gallery"
          className="create-gallery-back"
        >
          ← Back to Gallery
        </Link>

        <span>
          GALLERY MANAGEMENT
        </span>

        <h2>
          Create Gallery Album
        </h2>

        <p>
          Create a new photo collection
          for a church programme or event.
        </p>

      </div>


      {error && (
        <div className="create-gallery-message error">
          {error}
        </div>
      )}


      {success && (
        <div className="create-gallery-message success">
          {success}
        </div>
      )}


      <form
        className="create-gallery-form"
        onSubmit={handleSubmit}
      >

        <div className="create-gallery-grid">


          {/* MAIN FORM */}

          <section className="create-gallery-card">

            <div className="create-gallery-card-heading">

              <span>
                ALBUM DETAILS
              </span>

              <h3>
                Basic Information
              </h3>

            </div>


            <div className="create-gallery-field">

              <label>
                Gallery Title
                <strong>*</strong>
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Gospel and Power Convention"
              />

            </div>


            <div className="create-gallery-field">

              <label>
                Event Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />

            </div>


            <div className="create-gallery-field">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a short description about this photo collection..."
              />

            </div>

          </section>


          {/* SIDE */}

          <aside className="create-gallery-side">


            {/* COVER */}

            <section className="create-gallery-card">

              <div className="create-gallery-card-heading">

                <span>
                  COVER
                </span>

                <h3>
                  Album Cover
                </h3>

              </div>


              <label className="gallery-cover-upload">

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={
                    handleCoverChange
                  }
                />


                {coverPreview ? (

                  <img
                    src={coverPreview}
                    alt="Gallery cover preview"
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


              {cover && (
                <p className="gallery-cover-file">
                  {cover.name}
                </p>
              )}

            </section>


            {/* PUBLIC UPLOAD */}

            <section className="create-gallery-card gallery-public-card">

              <div>

                <strong>
                  Allow Public Upload
                </strong>

                <span>
                  Visitors can submit photos
                  to this gallery for approval.
                </span>

              </div>


              <label className="gallery-admin-switch">

                <input
                  type="checkbox"
                  name="allow_public_upload"
                  checked={
                    form.allow_public_upload
                  }
                  onChange={
                    handleChange
                  }
                />

                <span></span>

              </label>

            </section>


            {/* INFO */}

            <section className="create-gallery-card gallery-create-info">

              <span>
                NEXT STEP
              </span>

              <h3>
                Upload Photos
              </h3>

              <p>
                After creating the album,
                open it from Gallery Admin
                and upload multiple photos.
              </p>

            </section>

          </aside>

        </div>


        {/* ACTIONS */}

        <div className="create-gallery-actions">

          <Link
            to="/media-admin/gallery"
            className="create-gallery-cancel"
          >
            Cancel
          </Link>


          <button
            type="submit"
            className="create-gallery-submit"
            disabled={saving}
          >
            {saving
              ? "Creating Gallery..."
              : "Create Gallery"}
          </button>

        </div>

      </form>

    </div>
  );
};


export default CreateGallery;