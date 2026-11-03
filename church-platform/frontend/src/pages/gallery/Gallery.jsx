import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Gallery.css";

import { getGalleryAlbums } from "../../api/api";

const Gallery = () => {
  const [layout, setLayout] = useState(0);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await getGalleryAlbums();
        setAlbums(data);
      } catch (error) {
        console.error("Failed to load gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLayout((prev) => (prev + 1) % 3);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const heroImages = useMemo(() => {
    const images = [];

    albums.forEach((album) => {
      if (album.cover_image) {
        images.push(album.cover_image);
      }

      if (album.images?.length) {
        album.images.forEach((item) => {
          if (item.image) {
            images.push(item.image);
          }
        });
      }
    });

    return images.slice(0, 12);
  }, [albums]);

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

  return (
    <main className="gallery-page">

      {/* HERO */}

      <section className="gallery-hero">

        <div className="gallery-hero-container">

          <div className="gallery-hero-content">

            <span className="gallery-eyebrow">
              CAPTURING MOMENTS OF GRACE
            </span>

            <h1>
              Our <span>Gallery</span>
            </h1>

            <p>
              Explore moments from our worship services,
              conventions, ministries, fellowships and special
              church gatherings.
            </p>

            <a
              href="#gallery-folders"
              className="gallery-scroll"
            >
              Scroll to explore
              <span>↓</span>
            </a>

          </div>


          {/* ANIMATED COLLAGE */}

          {heroImages.length > 0 && (
            <div
              className={`gallery-collage gallery-layout-${layout}`}
            >

              {heroImages.map((image, index) => (
                <div
                  className={`gallery-collage-item item-${index + 1}`}
                  key={`${image}-${index}`}
                >
                  <img
                    src={image}
                    alt={`Ebukrom District gallery ${index + 1}`}
                  />
                </div>
              ))}

            </div>
          )}

        </div>

      </section>


      {/* GALLERY FOLDERS */}

      <section
        className="gallery-folders-section"
        id="gallery-folders"
      >

        <div className="gallery-container">

          <div className="gallery-section-heading">

            <span>
              OUR COLLECTIONS
            </span>

            <h2>
              Gallery
            </h2>

            <div className="gallery-heading-line"></div>

          </div>


          {loading ? (
            <div className="gallery-loading">
              Loading gallery...
            </div>
          ) : (
            <div className="gallery-folders-grid">

              {albums.map((folder) => (

                <article
                  className="gallery-folder-card"
                  key={folder.id}
                >

                  <Link
                    to={`/gallery/${folder.slug}`}
                    className="gallery-folder-image"
                  >

                    {folder.cover_image ? (
                      <img
                        src={folder.cover_image}
                        alt={folder.title}
                      />
                    ) : (
                      <div className="gallery-empty-cover">
                        <span>+</span>
                        <p>Photos coming soon</p>
                      </div>
                    )}


                    <div className="gallery-folder-overlay"></div>


                    <div className="gallery-folder-content">

                      <span className="gallery-preview-badge">
                        Preview
                      </span>

                      <h3>
                        {folder.title}
                      </h3>

                      <p>
                        {folder.image_count}{" "}
                        {folder.image_count === 1
                          ? "photo"
                          : "photos"}
                      </p>

                      <div className="gallery-view-link">
                        View Full Collection
                        <span>→</span>
                      </div>

                    </div>

                  </Link>


                  <div className="gallery-folder-footer">

                    <span>
                      {formatDate(folder.event_date)}
                    </span>

                    {folder.allow_public_upload && (
                      <Link
                        to={`/gallery/${folder.slug}/upload`}
                        className="gallery-upload-btn"
                      >
                        Upload Photo
                      </Link>
                    )}

                  </div>

                </article>

              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
};

export default Gallery;