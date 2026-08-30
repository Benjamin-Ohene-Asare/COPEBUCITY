import React, { useEffect, useState } from "react";
import "./Hero.css";

import image1 from "../../assets/image1.jpeg";
import image2 from "../../assets/image2.jpeg";
import image3 from "../../assets/image3.jpeg";

const slides = [
  {
    image: image1,
    smallTitle: "The Church of Pentecost • Elmina Area",
    title: "EBUKROM DISTRICT",
    button: "DISCOVER OUR DISTRICT",
  },
  {
    image: image2,
    smallTitle: "A Place of Worship, Fellowship and Growth",
    title: "GROWING TOGETHER IN CHRIST",
    button: "EXPLORE MORE",
  },
  {
    image: image3,
    smallTitle: "You Are Welcome To Worship With Us",
    title: "EXPERIENCE HIS PRESENCE",
    button: "JOIN US",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

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
          {slide.smallTitle}
        </p>

        <div className="hero-line"></div>

        <h1>{slide.title}</h1>

        <button className="hero-btn">
          {slide.button}
        </button>
      </div>

      {/* SLIDER CONTROLS */}
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

      {/* BOTTOM INFORMATION */}
      <div className="hero-info">

        <div className="info-item">
          <span className="info-icon">◎</span>

          <div>
            <span>
              The Church of Pentecost
            </span>
          </div>
        </div>

        <div className="info-divider"></div>

        <div className="info-item">
          <span className="info-icon">☎</span>

          <span>
            +233 54 125  4645
          </span>
        </div>

        <div className="info-divider"></div>

        <div className="info-item">
          <span className="info-icon">⌖</span>

          <span>
            Ebukrom, Elmina, Ghana
          </span>
        </div>

      </div>
    </section>
  );
};

export default Hero;