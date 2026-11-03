import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./AddDocument.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const AddDocument = () => {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      title: "",
      category: "Bible Study Outline",
      date: "",
      description: "",
      is_active: true,
    });

  const [file, setFile] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  const categories = [
    "Bible Study Outline",
    "Newsletter",
    "Study Manual",
    "Report",
    "Other",
  ];


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


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");


      if (!form.title.trim()) {
        setError(
          "Document title is required."
        );

        return;
      }


      if (!file) {
        setError(
          "Please select a document to upload."
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
          "category",
          form.category
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
          "is_active",
          form.is_active
            ? "true"
            : "false"
        );

        formData.append(
          "file",
          file
        );


        const response =
          await fetch(
            `${API_BASE}/documents/`,
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
            "Unable to upload document."
          );
        }


        navigate(
          "/media-admin/documents"
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
    <div className="add-document-page">

      <div className="add-document-heading">

        <Link
          to="/media-admin/documents"
        >
          ← Back to Documents
        </Link>

        <span>
          DOCUMENT MANAGEMENT
        </span>

        <h2>
          Add Document
        </h2>

        <p>
          Upload a new church resource
          for members to access.
        </p>

      </div>


      {error && (
        <div className="add-document-error">
          {error}
        </div>
      )}


      <form
        onSubmit={handleSubmit}
      >

        <div className="add-document-grid">


          <section className="add-document-card">

            <div className="add-document-card-title">

              <span>
                DOCUMENT DETAILS
              </span>

              <h3>
                Basic Information
              </h3>

            </div>


            <div className="document-form-field">

              <label>
                Document Title *
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Bible Study Outline 2026"
              />

            </div>


            <div className="document-form-row">

              <div className="document-form-field">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >

                  {categories.map(
                    (item) => (

                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="document-form-field">

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


            <div className="document-form-field">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe this document..."
              />

            </div>

          </section>


          <aside className="add-document-side">

            <section className="add-document-card">

              <div className="add-document-card-title">

                <span>
                  FILE
                </span>

                <h3>
                  Upload Document
                </h3>

              </div>


              <label className="document-file-upload">

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={(e) =>
                    setFile(
                      e.target.files?.[0] ||
                      null
                    )
                  }
                />


                <div className="document-upload-mark">
                  ↑
                </div>


                <strong>
                  Choose Document
                </strong>

                <span>
                  PDF, DOC or DOCX
                </span>

              </label>


              {file && (
                <div className="document-selected-file">

                  <strong>
                    {file.name}
                  </strong>

                  <span>
                    {(
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)}
                    {" "}MB
                  </span>

                </div>
              )}

            </section>


            <section className="add-document-card document-publish-option">

              <div>

                <strong>
                  Active Document
                </strong>

                <span>
                  Make this resource available
                  for public download.
                </span>

              </div>

              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />

            </section>

          </aside>

        </div>


        <div className="add-document-actions">

          <Link
            to="/media-admin/documents"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Uploading..."
              : "Save Document"}
          </button>

        </div>

      </form>

    </div>
  );
};


export default AddDocument;