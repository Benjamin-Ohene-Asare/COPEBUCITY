import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./AddPhotoTag.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const AddPhotoTag = () => {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      description: "",
      default_position: "bottom-center",
      bottom_padding: 10,
      is_default: false,
      is_active: true,
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


  const handleImageChange = (e) => {
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

      setError("");


      if (!form.name.trim()) {
        setError(
          "Tag name is required."
        );

        return;
      }


      if (!image) {
        setError(
          "Please upload the PNG tag."
        );

        return;
      }


      try {
        setSaving(true);

        const formData =
          new FormData();


        formData.append(
          "name",
          form.name
        );


        formData.append(
          "description",
          form.description
        );


        formData.append(
          "default_position",
          form.default_position
        );


        formData.append(
          "bottom_padding",
          form.bottom_padding
        );


        formData.append(
          "is_default",
          form.is_default
            ? "true"
            : "false"
        );


        formData.append(
          "is_active",
          form.is_active
            ? "true"
            : "false"
        );


        formData.append(
          "image",
          image
        );


        const response =
          await fetch(
            `${API_BASE}/photo-tags/`,
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
            "Unable to create photo tag."
          );
        }


        navigate(
          "/media-admin/photo-tags"
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
    <div className="add-photo-tag-page">

      <div className="add-photo-tag-heading">

        <Link
          to="/media-admin/photo-tags"
        >
          ← Back to Photo Tags
        </Link>

        <span>
          PHOTO TAG MANAGEMENT
        </span>

        <h2>
          Add Photo Tag
        </h2>

        <p>
          Upload a transparent PNG tag
          used to brand church photos.
        </p>

      </div>


      {error && (
        <div className="add-photo-tag-error">
          {error}
        </div>
      )}


      <form
        onSubmit={handleSubmit}
      >

        <div className="add-photo-tag-grid">


          {/* MAIN */}

          <section className="add-photo-tag-card">

            <div className="add-photo-tag-card-title">

              <span>
                TAG DETAILS
              </span>

              <h3>
                Basic Information
              </h3>

            </div>


            <div className="photo-tag-form-field">

              <label>
                Tag Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Youth Week 2026"
              />

            </div>


            <div className="photo-tag-form-field">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short description about this programme tag..."
              />

            </div>


            <div className="photo-tag-form-row">

              <div className="photo-tag-form-field">

                <label>
                  Default Position
                </label>

                <select
                  name="default_position"
                  value={
                    form.default_position
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="bottom-left">
                    Bottom Left
                  </option>

                  <option value="bottom-center">
                    Bottom Center
                  </option>

                  <option value="bottom-right">
                    Bottom Right
                  </option>
                </select>

              </div>


              <div className="photo-tag-form-field">

                <label>
                  Bottom Padding
                </label>

                <div className="photo-tag-padding-input">

                  <input
                    type="number"
                    name="bottom_padding"
                    min="0"
                    max="500"
                    value={
                      form.bottom_padding
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span>
                    px
                  </span>

                </div>

              </div>

            </div>


            <div className="photo-tag-help">

              <strong>
                Positioning
              </strong>

              <p>
                The tag will always stay near the bottom
                of the photo. The position determines whether
                it sits on the left, centre or right.
              </p>

            </div>

          </section>


          {/* SIDE */}

          <aside className="add-photo-tag-side">


            <section className="add-photo-tag-card">

              <div className="add-photo-tag-card-title">

                <span>
                  PNG OVERLAY
                </span>

                <h3>
                  Upload Tag
                </h3>

              </div>


              <label className="photo-tag-image-upload">

                <input
                  type="file"
                  accept="image/png"
                  hidden
                  onChange={
                    handleImageChange
                  }
                />


                {preview ? (

                  <div className="photo-tag-preview-area">

                    <img
                      src={preview}
                      alt="Photo tag preview"
                    />

                  </div>

                ) : (

                  <div className="photo-tag-upload-empty">

                    <div>
                      ↑
                    </div>

                    <strong>
                      Upload PNG Tag
                    </strong>

                    <span>
                      Transparent PNG recommended
                    </span>

                  </div>

                )}

              </label>


              {image && (

                <div className="photo-tag-selected-file">

                  <strong>
                    {image.name}
                  </strong>

                  <span>
                    {(
                      image.size /
                      1024 /
                      1024
                    ).toFixed(2)}
                    {" "}
                    MB
                  </span>

                </div>

              )}

            </section>


            {/* OPTIONS */}

            <section className="add-photo-tag-card photo-tag-options-card">

              <div className="photo-tag-option">

                <div>

                  <strong>
                    Default Tag
                  </strong>

                  <span>
                    Automatically select this tag
                    in the photo tagging tool.
                  </span>

                </div>


                <input
                  type="checkbox"
                  name="is_default"
                  checked={
                    form.is_default
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="photo-tag-option">

                <div>

                  <strong>
                    Active
                  </strong>

                  <span>
                    Make this tag available
                    to the media team.
                  </span>

                </div>


                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    form.is_active
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </section>


            {/* POSITION PREVIEW */}

            <section className="add-photo-tag-card">

              <div className="add-photo-tag-card-title">

                <span>
                  POSITION PREVIEW
                </span>

                <h3>
                  Example Placement
                </h3>

              </div>


              <div className="photo-tag-placement-preview">

                <div
                  className={`photo-tag-placement-tag ${form.default_position}`}
                  style={{
                    bottom:
                      `${form.bottom_padding}px`,
                  }}
                >

                  {preview ? (

                    <img
                      src={preview}
                      alt=""
                    />

                  ) : (

                    <span>
                      TAG
                    </span>

                  )}

                </div>

              </div>

            </section>

          </aside>

        </div>


        {/* ACTIONS */}

        <div className="add-photo-tag-actions">

          <Link
            to="/media-admin/photo-tags"
          >
            Cancel
          </Link>


          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving Tag..."
              : "Save Photo Tag"}
          </button>

        </div>

      </form>

    </div>
  );
};


export default AddPhotoTag;