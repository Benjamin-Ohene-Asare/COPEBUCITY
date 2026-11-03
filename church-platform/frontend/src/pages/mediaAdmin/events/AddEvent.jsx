import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./AddEvent.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const AddEvent = () => {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      is_published: true,
    });

  const [image, setImage] =
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


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");
      setSuccess("");


      if (
        !form.title.trim()
      ) {
        setError(
          "Event title is required."
        );

        return;
      }


      if (!form.date) {
        setError(
          "Event date is required."
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
          "time",
          form.time
        );

        formData.append(
          "location",
          form.location
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


        const response =
          await fetch(
            `${API_BASE}/events/`,
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
            "Unable to create event."
          );
        }


        setSuccess(
          "Event created successfully."
        );


        setTimeout(() => {
          navigate(
            "/media-admin/events"
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
    <div className="add-event-page">

      {/* HEADER */}

      <div className="add-event-heading">

        <Link
          to="/media-admin/events"
          className="add-event-back"
        >
          ← Back to Events
        </Link>

        <span>
          EVENT MANAGEMENT
        </span>

        <h2>
          Add New Event
        </h2>

        <p>
          Create an upcoming church
          programme or special event.
        </p>

      </div>


      {error && (
        <div className="add-event-message error">
          {error}
        </div>
      )}


      {success && (
        <div className="add-event-message success">
          {success}
        </div>
      )}


      <form
        onSubmit={handleSubmit}
        className="add-event-form"
      >

        <div className="add-event-grid">


          {/* MAIN FORM */}

          <section className="add-event-card">

            <div className="add-event-card-heading">

              <span>
                EVENT DETAILS
              </span>

              <h3>
                Basic Information
              </h3>

            </div>


            <div className="add-event-field">

              <label>
                Event Title
                <strong>*</strong>
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. District Prayer Service"
              />

            </div>


            <div className="add-event-two-column">

              <div className="add-event-field">

                <label>
                  Date
                  <strong>*</strong>
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />

              </div>


              <div className="add-event-field">

                <label>
                  Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="add-event-field">

              <label>
                Venue / Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Ebucity Church Auditorium"
              />

            </div>


            <div className="add-event-field">

              <label>
                Event Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a short description about the event..."
              />

            </div>

          </section>


          {/* SIDE */}

          <aside className="add-event-side">


            {/* IMAGE */}

            <section className="add-event-card">

              <div className="add-event-card-heading">

                <span>
                  EVENT FLYER
                </span>

                <h3>
                  Event Image
                </h3>

              </div>


              <label className="event-upload-box">

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
                    alt="Event preview"
                  />

                ) : (

                  <div>

                    <strong>
                      Upload Event Flyer
                    </strong>

                    <span>
                      JPG, PNG or WEBP
                    </span>

                  </div>

                )}

              </label>


              {image && (
                <p className="event-selected-file">
                  {image.name}
                </p>
              )}

            </section>


            {/* PUBLISH */}

            <section className="add-event-card event-publish-card">

              <div>

                <strong>
                  Publish Event
                </strong>

                <span>
                  Show this event on the
                  public website.
                </span>

              </div>


              <label className="event-admin-switch">

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


            {/* SUMMARY */}

            <section className="add-event-card event-summary-card">

              <span>
                PREVIEW
              </span>

              <h3>
                {form.title ||
                  "Event Title"}
              </h3>

              <p>
                {form.date ||
                  "Event date"}
              </p>

              <p>
                {form.time ||
                  "Event time"}
              </p>

              <p>
                {form.location ||
                  "Event venue"}
              </p>

            </section>

          </aside>

        </div>


        {/* ACTIONS */}

        <div className="add-event-actions">

          <Link
            to="/media-admin/events"
            className="add-event-cancel"
          >
            Cancel
          </Link>


          <button
            type="submit"
            className="add-event-submit"
            disabled={saving}
          >
            {saving
              ? "Saving Event..."
              : "Save Event"}
          </button>

        </div>

      </form>

    </div>
  );
};


export default AddEvent;