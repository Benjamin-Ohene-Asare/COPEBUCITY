import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./GalleryDetail.css";

import { getGalleryAlbum } from "../../api/api";

const GalleryDetail = () => {
  const { slug } = useParams();

  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await getGalleryAlbum(slug);
        setGallery(data);
      } catch (error) {
        console.error(
          "Failed to load gallery:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [slug]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <main className="gallery-detail-not-found">
        <p>Loading gallery...</p>
      </main>
    );
  }

  if (!gallery) {
    return (
      <main className="gallery-detail-not-found">
        <h1>Gallery not found</h1>

        <Link to="/gallery">
          Back to Gallery
        </Link>
      </main>
    );
  }

  const images = gallery.images || [];

  return (
    <main className="gallery-detail-page">

      {/* HERO */}

      <section className="gallery-detail-hero">

        <div className="gallery-detail-hero-container">

          <Link
            to="/gallery"
            className="gallery-detail-back"
          >
            ← Back to Gallery
          </Link>


          <div className="gallery-detail-heading">

            <span>
              PHOTO COLLECTION
            </span>

            <h1>
              {gallery.title}
            </h1>

            <p>
              {gallery.description ||
                "A collection of memorable moments from Ebukrom District."}
            </p>


            <div className="gallery-detail-meta">

              {gallery.event_date && (
                <span>
                  {formatDate(gallery.event_date)}
                </span>
              )}

              <span>
                {images.length}{" "}
                {images.length === 1
                  ? "Photo"
                  : "Photos"}
              </span>

            </div>


            {gallery.allow_public_upload && (

              <Link
                to={`/gallery/${gallery.slug}/upload`}
                className="gallery-detail-upload"
              >
                Upload Photos
              </Link>

            )}

          </div>

        </div>

      </section>


      {/* IMAGES */}

      <section className="gallery-detail-content">

        <div className="gallery-detail-container">

          {images.length > 0 ? (

            <div className="gallery-photo-grid">

              {images.map((item, index) => (

                <div
                  className="gallery-photo"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={
                      item.caption ||
                      `${gallery.title} ${index + 1}`
                    }
                  />

                  <div className="gallery-photo-overlay">
                    <span>
                      View
                    </span>
                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="gallery-empty-state">

              <div className="gallery-empty-icon">
                +
              </div>

              <h2>
                No Photos Yet
              </h2>

              <p>
                This gallery folder has been created,
                but no photos have been uploaded yet.
              </p>


              {gallery.allow_public_upload && (

                <Link
                  to={`/gallery/${gallery.slug}/upload`}
                  className="gallery-empty-upload"
                >
                  Upload Photos
                </Link>

              )}

            </div>

          )}

        </div>

      </section>

    </main>
  );
};

export default GalleryDetail;