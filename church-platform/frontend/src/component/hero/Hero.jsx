import React, { useEffect, useState } from "react";
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

  // FETCH HERO DATA
  useEffect(() => {
    const loadHero = async () => {
      try {
        const [slidesData, settingsData] = await Promise.all([
          getHeroSlides(),
          getSiteSettings(),
        ]);

        setSlides(slidesData);
        setSiteSettings(settingsData);
      } catch (error) {
        console.error("Failed to load hero:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHero();
  }, []);

  // AUTO SLIDER
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    if (slides.length === 0) return;

    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const previousSlide = () => {
    if (slides.length === 0) return;

    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  // LOADING
  if (loading) {
    return (
      <section className="hero hero-loading">
        <p>Loading...</p>
      </section>
    );
  }

  // NO SLIDES
  if (slides.length === 0) {
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
      {/* OVERLAY */}
      <div className="hero-overlay"></div>

      {/* HERO CONTENT */}
      <div className="hero-content">

        <p className="hero-small-title">
          {slide.small_title}
        </p>

        <div className="hero-line"></div>

        <h1>
          {slide.title}
        </h1>

        {slide.button_text && (
          <button
            className="hero-btn"
            onClick={() => {
              if (slide.button_url) {
                window.location.href = slide.button_url;
              }
            }}
          >
            {slide.button_text}
          </button>
        )}

      </div>

      {/* SLIDER CONTROLS */}
      {slides.length > 1 && (
        <div className="slider-controls">

          <button
            className="slider-arrow"
            onClick={previousSlide}
            aria-label="Previous slide"
          >
            ‹
          </button>

          <div className="slider-dots">

            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={
                  currentSlide === index
                    ? "slider-dot active"
                    : "slider-dot"
                }
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}

          </div>

          <button
            className="slider-arrow"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            ›
          </button>

        </div>
      )}

      {/* BOTTOM INFORMATION */}
      {siteSettings && (
        <div className="hero-info">

          <div className="info-item">
            <span className="info-icon">◎</span>

            <span>
              {siteSettings.church_name}
            </span>
          </div>

          <div className="info-divider"></div>

          <div className="info-item">
            <span className="info-icon">☎</span>

            <span>
              {siteSettings.phone}
            </span>
          </div>

          <div className="info-divider"></div>

          <div className="info-item">
            <span className="info-icon">⌖</span>

            <span>
              {siteSettings.location}
            </span>
          </div>

        </div>
      )}

    </section>
  );
};

export default Hero;