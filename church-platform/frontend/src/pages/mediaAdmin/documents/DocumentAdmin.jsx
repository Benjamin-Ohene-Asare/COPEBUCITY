import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import "./DocumentAdmin.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const DocumentAdmin = () => {
  const [documents, setDocuments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_BASE}/documents/`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Unable to load documents."
        );
      }

      setDocuments(
        Array.isArray(data)
          ? data
          : data.results || []
      );

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadDocuments();
  }, []);


  const deleteDocument =
    async (document) => {

      const confirmed =
        window.confirm(
          `Delete "${document.title}"?`
        );

      if (!confirmed) return;


      try {
        const response =
          await fetch(
            `${API_BASE}/documents/${document.id}/`,
            {
              method: "DELETE",
            }
          );


        if (
          !response.ok &&
          response.status !== 204
        ) {
          let data = {};

          try {
            data =
              await response.json();
          } catch {
            // no json
          }

          throw new Error(
            data.detail ||
            "Unable to delete document."
          );
        }


        setDocuments(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !==
                document.id
            )
        );

      } catch (err) {
        setError(
          err.message
        );
      }
    };


  const filteredDocuments =
    documents.filter(
      (document) => {

        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        return (
          document.title
            ?.toLowerCase()
            .includes(query) ||

          document.category
            ?.toLowerCase()
            .includes(query)
        );
      }
    );


  return (
    <div className="document-admin-page">

      <div className="document-admin-heading">

        <div>

          <span>
            CONTENT MANAGEMENT
          </span>

          <h2>
            Documents
          </h2>

          <p>
            Manage Bible study outlines,
            manuals, newsletters and church resources.
          </p>

        </div>


        <Link
          to="/media-admin/documents/add"
          className="document-admin-add"
        >
          + Add Document
        </Link>

      </div>


      <div className="document-admin-toolbar">

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />


        <div className="document-admin-count">

          <span>
            Total Documents
          </span>

          <strong>
            {documents.length}
          </strong>

        </div>

      </div>


      {error && (
        <div className="document-admin-error">
          {error}
        </div>
      )}


      <div className="document-admin-table-wrapper">

        {loading ? (

          <div className="document-admin-loading">
            Loading documents...
          </div>

        ) : filteredDocuments.length > 0 ? (

          <table className="document-admin-table">

            <thead>
              <tr>
                <th>Document</th>
                <th>Category</th>
                <th>Date</th>
                <th>File</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>


            <tbody>

              {filteredDocuments.map(
                (document) => (

                  <tr key={document.id}>

                    <td>

                      <div className="document-admin-item">

                        <div className="document-admin-icon">
                          PDF
                        </div>

                        <div>

                          <strong>
                            {document.title}
                          </strong>

                          <span>
                            {
                              document.description ||
                              "Church document"
                            }
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>
                      {
                        document.category ||
                        "-"
                      }
                    </td>


                    <td>
                      {
                        document.date ||
                        document.created_at ||
                        "-"
                      }
                    </td>


                    <td>

                      {document.file ? (

                        <a
                          href={document.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="document-file-link"
                        >
                          Open File
                        </a>

                      ) : (
                        "-"
                      )}

                    </td>


                    <td>

                      <span
                        className={
                          document.is_active ===
                          false
                            ? "document-status inactive"
                            : "document-status active"
                        }
                      >
                        {
                          document.is_active ===
                          false
                            ? "Inactive"
                            : "Active"
                        }
                      </span>

                    </td>


                    <td>

                      <div className="document-admin-actions">

                        <Link
                          to={`/media-admin/documents/${document.id}/edit`}
                          className="document-action edit"
                        >
                          Edit
                        </Link>


                        <button
                          type="button"
                          className="document-action delete"
                          onClick={() =>
                            deleteDocument(
                              document
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        ) : (

          <div className="document-admin-empty">

            <h3>
              No documents found
            </h3>

            <p>
              Upload your first church resource.
            </p>

            <Link
              to="/media-admin/documents/add"
            >
              Add Document
            </Link>

          </div>

        )}

      </div>

    </div>
  );
};


export default DocumentAdmin;