import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactComponent as LeftSlide } from "../../externals/left-slide.svg";
import { ReactComponent as RightSlide } from "../../externals/right-slide.svg";
import { Link } from "react-router-dom";

export const Locations = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [places, setPlaces] = useState([]);

  const slideWidth = 10;

  useEffect(() => {
    const fetchTripDeals = async () => {
      try {
        const response = await axios.get("http://localhost/places");
        const fetchedPlaces = response.data.filter((place) => place.tripDeal);
        setPlaces(fetchedPlaces);
      } catch (error) {
        console.error("Failed to fetch trip deals:", error);
      }
    };

    fetchTripDeals();
  }, []);

  const handleLeftSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleRightSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex < places.length - 1 ? prevIndex + 1 : places.length - 1
    );
  };

  return (
    <div className="screen4-component1">
      <div className="screen4-header-section3">
        <div className="screen4-frame2">
          <span className="screen4-text27 secondary">
            Where do you want to go
          </span>
          <span className="screen4-text29">Popular Destinations</span>
        </div>
        <div className="screen4-slidernavigation">
          <LeftSlide onClick={handleLeftSlide} />
          <RightSlide onClick={handleRightSlide} />
        </div>
      </div>
      <div className="screen4-frame4">
        <div
          className="screen4-frame5"
          style={{ transform: `translateX(-${slideIndex * slideWidth}%)` }}
        >
          {places.map((place, index) => (
            <button key={place.uuid} className="screen4-locationwidgetbutton">
              <Link to="/destinations">
                <img
                  src={
                    ""
                  }
                  alt={place.title}
                  className="screen4-rectangle"
                />
              </Link>
              <div className="screen4-frame3">
                <span className="screen4-text31">{place.title}</span>
                <div className="screen4-location">
                  <span className="screen4-text-location">
                    {place.location}
                  </span>
                </div>
                <span className="screen4-text-travel">
                  {`${Math.floor(Math.random() * 1000)} wants to travel here`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Locations;
