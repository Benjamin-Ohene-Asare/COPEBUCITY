import React, { useEffect, useState } from "react";
import {
  FaChurch,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "./Hero.css";
import {
  getHeroSlides,
  getSiteSettings,
} from "../../api/api";

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadHero = async () => {
      try {
        const [slidesData, settingsData] = await Promise.all([
          getHeroSlides(),
          getSiteSettings(),
        ]);

        if (!cancelled) {
          setSlides(Array.isArray(slidesData) ? slidesData : []);
          setSiteSettings(settingsData);
        }
      } catch (error) {
        console.error("Failed to load hero:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadHero();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((previous) =>
        (previous + 1) % slides.length
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    if (!slides.length) return;

    setCurrentSlide((previous) =>
      (previous + 1) % slides.length
    );
  };

  const previousSlide = () => {
    if (!slides.length) return;

    setCurrentSlide((previous) =>
      (previous - 1 + slides.length) % slides.length
    );
  };

  const openSlideLink = (value) => {
    if (!value) return;

    try {
      const url = new URL(value, window.location.origin);

      if (url.protocol === "https:" || url.protocol === "http:") {
        window.location.assign(url.href);
      }
    } catch {
      console.error("Invalid hero button URL.");
    }
  };

  if (loading) {
    return (
      <section className="hero hero-loading">
        <p>Loading...</p>
      </section>
    );
  }

  if (!slides.length) {
    return (
      <section className="hero hero-loading">
        <p>No hero slides available.</p>
      </section>
    );
  }

  const slide = slides[currentSlide];

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${slide.image})`,
      }}
    >
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-small-title">
          {slide.small_title}
        </p>

        <div className="hero-line" aria-hidden="true" />

        <h1>{slide.title}</h1>

        {slide.button_text && (
          <button
            type="button"
            className="hero-btn"
            onClick={() => openSlideLink(slide.button_url)}
          >
            {slide.button_text}
          </button>
        )}
      </div>

      {slides.length > 1 && (
        <div className="slider-controls">
          <button
            type="button"
            className="slider-arrow"
            onClick={previousSlide}
            aria-label="Previous slide"
          >
            <FaChevronLeft aria-hidden="true" />
          </button>

          <div className="slider-dots">
            {slides.map((item, index) => (
              <button
                type="button"
                key={item.id ?? index}
                onClick={() => setCurrentSlide(index)}
                className={
                  currentSlide === index
                    ? "slider-dot active"
                    : "slider-dot"
                }
                aria-label={`Go to slide ${index + 1}`}
                aria-current={
                  currentSlide === index ? "true" : undefined
                }
              />
            ))}
          </div>

          <button
            type="button"
            className="slider-arrow"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <FaChevronRight aria-hidden="true" />
          </button>
        </div>
      )}

      {siteSettings && (
        <div className="hero-info">
          <div className="info-item">
            <span className="info-icon">
              <FaChurch aria-hidden="true" />
            </span>

            <span>{siteSettings.church_name}</span>
          </div>

          <div className="info-divider" aria-hidden="true" />

          <div className="info-item">
            <span className="info-icon">
              <FaPhoneAlt aria-hidden="true" />
            </span>

            <span>{siteSettings.phone}</span>
          </div>

          <div className="info-divider" aria-hidden="true" />

          <div className="info-item">
            <span className="info-icon">
              <FaMapMarkerAlt aria-hidden="true" />
            </span>

            <span>{siteSettings.location}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;