import React, { useEffect, useState } from "react";
import "./Document.css";

import {
  getDocumentCategories,
  getDocuments,
} from "../../api/api";

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [documentCategories, setDocumentCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DOCUMENTS + CATEGORIES
  // ==========================================

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const [
          documentsData,
          categoriesData,
        ] = await Promise.all([
          getDocuments(),
          getDocumentCategories(),
        ]);

        setDocuments(documentsData);
        setDocumentCategories(categoriesData);

      } catch (error) {
        console.error(
          "Failed to load documents:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);


  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = [
    "All",
    ...documentCategories.map(
      (item) => item.name
    ),
  ];


  // ==========================================
  // FILTER DOCUMENTS
  // ==========================================

  const filteredDocuments = documents.filter(
    (document) => {

      const title =
        document.title || "";

      const description =
        document.description || "";

      const matchesSearch =
        title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        description
          .toLowerCase()
          .includes(search.toLowerCase());


      const matchesCategory =
        category === "All" ||
        document.category_name === category;


      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  };


  return (
    <main className="document-page">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="document-hero">

        <div className="document-hero-content">

          <span className="document-label">
            CHURCH RESOURCES
          </span>

          <h1>
            Church <span>Documents</span>
          </h1>

          <p>
            Access important church documents,
            Bible study outlines, newsletters,
            manuals and other resources.
          </p>

        </div>

      </section>


      {/* =====================================
          SEARCH PANEL
      ===================================== */}

      <div className="document-search-wrapper">

        <div className="document-search-panel">

          <div className="document-search">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="document-category-select">

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              {categories.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>

        </div>


        {/* FILTER BUTTONS */}

        <div className="document-filter-buttons">

          {categories.map((item) => (

            <button
              key={item}
              className={
                category === item
                  ? "document-filter active"
                  : "document-filter"
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

      </div>


      {/* =====================================
          DOCUMENT LIBRARY
      ===================================== */}

      <section className="document-library">

        <div className="document-container">

          <div className="document-heading">

            <div>

              <span>
                RESOURCE LIBRARY
              </span>

              <h2>
                Available
                <strong> Documents</strong>
              </h2>

            </div>


            <p>
              {filteredDocuments.length}{" "}
              {filteredDocuments.length === 1
                ? "document"
                : "documents"}
            </p>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="no-documents">

              <p>
                Loading documents...
              </p>

            </div>

          ) : (

            <div className="document-grid">

              {filteredDocuments.map(
                (document) => (

                  <article
                    className="document-card"
                    key={document.id}
                  >

                    {/* CARD TOP */}

                    <div className="document-card-top">

                      <div className="document-icon">
                        <span>
                          PDF
                        </span>
                      </div>


                      {document.category_name && (

                        <span className="document-category">
                          {document.category_name}
                        </span>

                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="document-card-content">

                      <h3>
                        {document.title}
                      </h3>


                      <p>
                        {document.description ||
                          "Church resource available for reading and download."}
                      </p>

                    </div>


                    {/* FOOTER */}

                    <div className="document-card-footer">

                      <span className="document-date">

                        {document.published_date
                          ? `Added ${formatDate(
                              document.published_date
                            )}`
                          : "Church Resource"}

                      </span>


                      {document.file && (

                        <a
                          href={document.file}
                          className="document-download"
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>↓</span>
                          Download
                        </a>

                      )}

                    </div>

                  </article>

                )
              )}

            </div>

          )}


          {/* NO DOCUMENTS */}

          {!loading &&
            filteredDocuments.length === 0 && (

              <div className="no-documents">

                <h3>
                  No documents found
                </h3>

                <p>
                  Try another search or category.
                </p>

              </div>

            )}

        </div>

      </section>

    </main>
  );
};

export default Document;