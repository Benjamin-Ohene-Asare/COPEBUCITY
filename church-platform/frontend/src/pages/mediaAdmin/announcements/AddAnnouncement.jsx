import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./AddAnnouncement.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const AddAnnouncement = () => {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      title: "",
      category: "ANNOUNCEMENT",
      date: "",
      description: "",
      is_new: true,
      is_published: true,
    });

  const [image, setImage] =
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


  const handleImage = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!form.title.trim()) {
        setError(
          "Announcement title is required."
        );

        return;
      }


      try {
        setSaving(true);
        setError("");


        const formData =
          new FormData();


        Object.entries(form)
          .forEach(
            ([key, value]) => {

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
          );


        if (image) {
          formData.append(
            "image",
            image
          );
        }


        const response =
          await fetch(
            `${API_BASE}/announcements/`,
            {
              method: "POST",
              body: formData,
            }
          );


        const data =
          await response.json();


        if (!response.ok) {
          throw new Error(
            data.detail ||
            "Unable to create announcement."
          );
        }


        navigate(
          "/media-admin/announcements"
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
    <div className="add-announcement-page">

      <div className="add-announcement-heading">

        <Link
          to="/media-admin/announcements"
        >
          ← Back to Announcements
        </Link>

        <span>
          ANNOUNCEMENT MANAGEMENT
        </span>

        <h2>
          Add Announcement
        </h2>

        <p>
          Publish church news,
          notices and important information.
        </p>

      </div>


      {error && (
        <div className="add-announcement-error">
          {error}
        </div>
      )}


      <form
        onSubmit={handleSubmit}
        className="add-announcement-form"
      >

        <div className="add-announcement-grid">

          <section className="add-announcement-card">

            <h3>
              Announcement Details
            </h3>


            <div className="announcement-form-field">

              <label>
                Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Announcement title"
              />

            </div>


            <div className="announcement-form-row">

              <div className="announcement-form-field">

                <label>
                  Category
                </label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />

              </div>


              <div className="announcement-form-field">

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


            <div className="announcement-form-field">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write the full announcement..."
              />

            </div>

          </section>


          <aside className="add-announcement-side">

            <section className="add-announcement-card">

              <h3>
                Announcement Image
              </h3>


              <label className="announcement-image-upload">

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImage}
                />


                {preview ? (

                  <img
                    src={preview}
                    alt="Preview"
                  />

                ) : (

                  <div>
                    <strong>
                      Upload Image
                    </strong>

                    <span>
                      JPG, PNG or WEBP
                    </span>
                  </div>

                )}

              </label>

            </section>


            <section className="add-announcement-card announcement-options">

              <label>

                <input
                  type="checkbox"
                  name="is_new"
                  checked={form.is_new}
                  onChange={handleChange}
                />

                Mark as New

              </label>


              <label>

                <input
                  type="checkbox"
                  name="is_published"
                  checked={
                    form.is_published
                  }
                  onChange={handleChange}
                />

                Publish Announcement

              </label>

            </section>

          </aside>

        </div>


        <div className="add-announcement-actions">

          <Link
            to="/media-admin/announcements"
          >
            Cancel
          </Link>


          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Announcement"}
          </button>

        </div>

      </form>

    </div>
  );
};


export default AddAnnouncement;