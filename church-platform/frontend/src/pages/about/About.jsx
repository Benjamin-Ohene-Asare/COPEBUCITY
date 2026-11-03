import React from "react";

import AboutHero from "../../component/aboutus/AboutHero";
import PastMinisters from "../../component/prevminister/PastMinisters";
import MainAbout from "../../component/MainAbout/MainAbout";

const About = () => {
  return (
    <div>
      <AboutHero />

      <PastMinisters />

      <MainAbout />
    </div>
  );
};

export default About;