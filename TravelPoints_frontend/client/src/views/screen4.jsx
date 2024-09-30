import React from "react";

import "./screen4.css";
import Hero from "../components/screen4/hero";
import Locations from "../components/screen4/locations";
import Footer from "../components/screen4/footer";

const Screen4 = (props) => {
  return (
    <div className="screen4-container">
      <title>Mamut Agency</title>
      <div className="screen4-screen4">
        <Hero />
        <Locations />
        <Footer />
      </div>
    </div>
  );
};

export default Screen4;
