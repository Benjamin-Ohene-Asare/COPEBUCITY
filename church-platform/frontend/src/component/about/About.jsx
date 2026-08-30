import React from "react";
import "./About.css";

import aboutImage from "../../assets/ps.png";

const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">

        {/* IMAGE */}
        <div className="about-image-wrapper">
          <img
            src={aboutImage}
            alt="The Church of Pentecost - Ebukrom District"
            className="about-image"
          />

          <div className="about-badge">
            <h3>Ebukrom District</h3>
            <p>Elmina Area • The Church of Pentecost</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="about-content">

          <span className="about-label">
            ABOUT OUR DISTRICT
          </span>

          <h2>
            A People Of Faith,
            <span> Transforming Our World</span>
          </h2>

          <p className="about-text">
            The Church of Pentecost – Ebukrom District is part of the
            Elmina Area of The Church of Pentecost. We are a family of
            believers committed to worship, prayer, discipleship,
            evangelism and Christian fellowship.
          </p>

          <p className="about-text">
            We are committed to raising Spirit-filled Christians of
            character who live out the values of the Kingdom of God
            and make a positive impact in their families, workplaces
            and communities.
          </p>

          {/* MISSION & VISION */}
          <div className="about-values">

            <div className="about-value">
              <span>01</span>

              <div>
                <h4>Our Mission</h4>

                <p>
                  To make disciples, strengthen our assemblies and
                  raise committed, Spirit-filled Christians who
                  demonstrate Christ in every sphere of life.
                </p>
              </div>
            </div>

            <div className="about-value">
              <span>02</span>

              <div>
                <h4>Our Vision</h4>

                <p>
                  To equip and unleash every member to transform
                  their world with the values and principles of
                  the Kingdom of God.
                </p>
              </div>
            </div>

          </div>

          <button className="about-btn">
            LEARN MORE
          </button>

        </div>
      </div>
    </section>
  );
};

export default About;