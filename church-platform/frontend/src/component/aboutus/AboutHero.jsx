import React, { useEffect, useState } from "react";
import "./AboutHero.css";

import { getAbout } from "../../api/api";

const AboutHero = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await getAbout();
        setAbout(data);
      } catch (error) {
        console.error("Failed to load about hero:", error);
      }
    };

    loadAbout();
  }, []);

  return (
    <section className="about-hero">
      <div className="about-hero-content">

        <span className="about-hero-label">
          OUR IDENTITY
        </span>

        <h1>
          {about?.title || "The Heart of Ebukrom District"}
        </h1>

        <p>
          {about?.subtitle ||
            "A Christ-centred family committed to worship, spiritual growth, fellowship and impacting our community with the love of Jesus Christ."}
        </p>

      </div>
    </section>
  );
};

export default AboutHero;