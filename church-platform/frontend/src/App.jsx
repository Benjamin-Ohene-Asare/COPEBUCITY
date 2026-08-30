import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Footer from "./component/footer/Footer";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;