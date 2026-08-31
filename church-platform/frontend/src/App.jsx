import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Header from "./component/header/Header";
import Footer from "./component/footer/Footer";
import About from "./pages/about/About";

const App = () => {
  return (
    <>
      {/* GLOBAL HEADER */}
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {/* GLOBAL FOOTER */}
      <Footer />
    </>
  );
};

export default App;