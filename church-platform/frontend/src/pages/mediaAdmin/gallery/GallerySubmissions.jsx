import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import "./GallerySubmissions.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const GallerySubmissions = () => {
  const { slug } = useParams();

  const [gallery, setGallery] =
    useState(null);

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [processingId, setProcessingId] =
    useState(null);

  const [filter, setFilter] =
    useState("pending");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =====================================
     LOAD SUBMISSIONS
  ===================================== */

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const galleryResponse =
        await fetch(
          `${API_BASE}/gallery/${slug}/`
        );

      const galleryData =
        await galleryResponse.json();

      if (!galleryResponse.ok) {
        throw new Error(
          galleryData.detail ||
          "Unable to load gallery."
        );
      }

      setGallery(galleryData);


      /*
        This endpoint will be added
        to Django if it does not
        already exist.
      */

      const response =
        await fetch(
          `${API_BASE}/gallery/${slug}/submissions/`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Unable to load submissions."
        );
      }

      setSubmissions(
        Array.isArray(data)
          ? data
          : data.results || []
      );

    } catch (err) {
      console.error(err);

      setError(
        err.message
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadSubmissions();
  }, [slug]);


  /* =====================================
     APPROVE
  ===================================== */

  const approveSubmission =
    async (submission) => {

      try {
        setProcessingId(
          submission.id
        );

        setError("");
        setSuccess("");


        const response =
          await fetch(
            `${API_BASE}/gallery/${slug}/submissions/${submission.id}/approve/`,
            {
              method: "POST",
            }
          );


        let data = {};

        try {
          data =
            await response.json();
        } catch {
          // response may be empty
        }


        if (!response.ok) {
          throw new Error(
            data.detail ||
            "Unable to approve photo."
          );
        }


        setSubmissions(
          (prev) =>
            prev.map(
              (item) =>
                item.id ===
                submission.id
                  ? {
                      ...item,
                      status:
                        "approved",
                    }
                  : item
            )
        );


        setSuccess(
          "Photo approved and added to the gallery."
        );

      } catch (err) {
        setError(
          err.message
        );

      } finally {
        setProcessingId(
          null
        );
      }
    };


  /* =====================================
     REJECT
  ===================================== */

  const rejectSubmission =
    async (submission) => {

      const confirmed =
        window.confirm(
          "Reject this submitted photo?"
        );

      if (!confirmed) {
        return;
      }


      try {
        setProcessingId(
          submission.id
        );

        setError("");
        setSuccess("");


        const response =
          await fetch(
            `${API_BASE}/gallery/${slug}/submissions/${submission.id}/reject/`,
            {
              method: "POST",
            }
          );


        let data = {};

        try {
          data =
            await response.json();
        } catch {
          // empty response
        }


        if (!response.ok) {
          throw new Error(
            data.detail ||
            "Unable to reject photo."
          );
        }


        setSubmissions(
          (prev) =>
            prev.map(
              (item) =>
                item.id ===
                submission.id
                  ? {
                      ...item,
                      status:
                        "rejected",
                    }
                  : item
            )
        );


        setSuccess(
          "Photo rejected."
        );

      } catch (err) {
        setError(
          err.message
        );

      } finally {
        setProcessingId(
          null
        );
      }
    };


  /* =====================================
     COUNTS
  ===================================== */

  const pendingCount =
    submissions.filter(
      (item) =>
        item.status === "pending"
    ).length;


  const approvedCount =
    submissions.filter(
      (item) =>
        item.status === "approved"
    ).length;


  const rejectedCount =
    submissions.filter(
      (item) =>
        item.status === "rejected"
    ).length;


  /* =====================================
     FILTER
  ===================================== */

  const filteredSubmissions =
    submissions.filter(
      (item) => {

        if (
          filter === "all"
        ) {
          return true;
        }

        return (
          item.status === filter
        );
      }
    );


  if (loading) {
    return (
      <div className="gallery-submissions-loading">
        Loading submissions...
      </div>
    );
  }


  return (
    <div className="gallery-submissions-page">

      {/* HEADER */}

      <div className="gallery-submissions-heading">

        <div>

          <Link
            to="/media-admin/gallery"
            className="gallery-submissions-back"
          >
            ← Back to Gallery
          </Link>


          <span>
            GALLERY MODERATION
          </span>


          <h2>
            Photo Submissions
          </h2>


          <p>
            Review photos submitted to{" "}
            <strong>
              {gallery?.title}
            </strong>
          </p>

        </div>


        <Link
          to={`/media-admin/gallery/${slug}/upload`}
          className="gallery-submissions-upload"
        >
          Upload Photos
        </Link>

      </div>


      {/* MESSAGES */}

      {error && (
        <div className="gallery-submission-message error">
          {error}
        </div>
      )}


      {success && (
        <div className="gallery-submission-message success">
          {success}
        </div>
      )}


      {/* STATS */}

      <div className="gallery-submission-stats">

        <button
          type="button"
          className={
            filter === "pending"
              ? "submission-stat active"
              : "submission-stat"
          }
          onClick={() =>
            setFilter("pending")
          }
        >
          <span>
            Pending
          </span>

          <strong>
            {pendingCount}
          </strong>
        </button>


        <button
          type="button"
          className={
            filter === "approved"
              ? "submission-stat active"
              : "submission-stat"
          }
          onClick={() =>
            setFilter("approved")
          }
        >
          <span>
            Approved
          </span>

          <strong>
            {approvedCount}
          </strong>
        </button>


        <button
          type="button"
          className={
            filter === "rejected"
              ? "submission-stat active"
              : "submission-stat"
          }
          onClick={() =>
            setFilter("rejected")
          }
        >
          <span>
            Rejected
          </span>

          <strong>
            {rejectedCount}
          </strong>
        </button>


        <button
          type="button"
          className={
            filter === "all"
              ? "submission-stat active"
              : "submission-stat"
          }
          onClick={() =>
            setFilter("all")
          }
        >
          <span>
            All
          </span>

          <strong>
            {submissions.length}
          </strong>
        </button>

      </div>


      {/* SUBMISSIONS */}

      <section className="gallery-submission-card">

        <div className="gallery-submission-card-heading">

          <div>

            <span>
              MEMBER UPLOADS
            </span>

            <h3>
              {
                filter === "all"
                  ? "All Submissions"
                  : `${
                      filter
                        .charAt(0)
                        .toUpperCase() +
                      filter.slice(1)
                    } Submissions`
              }
            </h3>

          </div>


          <strong>
            {
              filteredSubmissions.length
            }
          </strong>

        </div>


        {filteredSubmissions.length > 0 ? (

          <div className="gallery-submissions-grid">

            {filteredSubmissions.map(
              (submission) => (

                <article
                  className="gallery-submission-item"
                  key={
                    submission.id
                  }
                >

                  {/* IMAGE */}

                  <div className="gallery-submission-image">

                    <img
                      src={
                        submission.image
                      }
                      alt={
                        submission.caption ||
                        "Submitted photo"
                      }
                    />


                    <span
                      className={`submission-status ${submission.status}`}
                    >
                      {
                        submission.status
                      }
                    </span>

                  </div>


                  {/* INFO */}

                  <div className="gallery-submission-info">

                    <div className="submission-person">

                      <span>
                        Submitted by
                      </span>

                      <strong>
                        {
                          submission.name ||
                          "Anonymous"
                        }
                      </strong>

                    </div>


                    {submission.caption && (

                      <p>
                        {
                          submission.caption
                        }
                      </p>

                    )}


                    <span className="submission-date">

                      {
                        submission.created_at
                          ? new Date(
                              submission.created_at
                            ).toLocaleString()
                          : ""
                      }

                    </span>


                    {/* ACTIONS */}

                    {submission.status ===
                      "pending" && (

                      <div className="submission-actions">

                        <button
                          type="button"
                          className="submission-approve"
                          disabled={
                            processingId ===
                            submission.id
                          }
                          onClick={() =>
                            approveSubmission(
                              submission
                            )
                          }
                        >
                          {processingId ===
                          submission.id
                            ? "Processing..."
                            : "Approve"}
                        </button>


                        <button
                          type="button"
                          className="submission-reject"
                          disabled={
                            processingId ===
                            submission.id
                          }
                          onClick={() =>
                            rejectSubmission(
                              submission
                            )
                          }
                        >
                          Reject
                        </button>

                      </div>

                    )}

                  </div>

                </article>

              )
            )}

          </div>

        ) : (

          <div className="gallery-submission-empty">

            <h3>
              No {filter === "all" ? "" : filter} submissions
            </h3>

            <p>
              There are currently no photos
              in this section.
            </p>

          </div>

        )}

      </section>

    </div>
  );
};


export default GallerySubmissions;