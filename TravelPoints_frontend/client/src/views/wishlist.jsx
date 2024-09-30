import React, { useState, useEffect } from "react";
import Navbar from "../components/screen4/navbar";
import { ReactComponent as Instagram } from "../externals/instagram.svg";
import { ReactComponent as Facebook } from "../externals/facebook.svg";
import Offer from "../components/screen6/offer";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import {jwtDecode} from "jwt-decode"; 

const WishList = (props) => {
  const [places, setPlaces] = useState([]);
  const [ids, setWishListPointsIds] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = jwtDecode(token);
        const response = await axios.get(`http://localhost/api/User/${user.id}`);
        const data = await response.data.whishlist;
        const ids = data.map(item => item.pointId);
        setWishListPointsIds(ids);
        console.log("Wishlist ids:", ids);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost/api/TravelPoints");
        const allTravelPoints = response.data;
        const wishlistTravelPoints = allTravelPoints.filter(point => 
          ids.includes(point.id)
      );
        console.log("Wishlist travel points:", wishlistTravelPoints);
        setPlaces(wishlistTravelPoints);
      } catch (error) {
        console.error("Failed to fetch places:", error);
      }
    };
  
    fetchData();
  }, [ids]);
  
  
  return (
    <div className="w-[100%] min-h-[100vh] overflow-auto flex flex-col items-center">
      <div className="bg-white w-full h-auto flex flex-col items-start gap-7 py-12 overflow-hidden">
        <div className="flex flex-col items-center gap-2.5 px-1 self-stretch">
          <Navbar textColor="#141B34" />
        </div>
        <div className="bg-[rgba(217,237,130,1)] flex items-center gap-3 flex-shrink-0 self-stretch">
            <div className="w-[822px] h-[150px] flex flex-col justify-center items-start gap-2.5 p-0 px-[77px] flex-shrink-0">
                <span className="text-[#141B34] w-[729px] text-left leading-normal font-[PlayfairDisplay] text-[40px] font-bold">
                  Discover your wishlist!
                </span>
          </div>
        </div>
        {places.map((place, index) => (
          <Offer key={place.uuid} {...place} index={index} />
        ))}
        <div className="flex flex-col items-start gap-[54px] px-[152px] self-stretch relative">
          <div className="flex items-center gap-[491px]">
            <div className="flex flex-col items-start gap-[3px]">
              <span className="text-black font-inter font-extrabold text-[25px] leading-normal decoration-none">
                Travel<span>Points.</span>
              </span>
            </div>
          </div>
          <div className="flex items-end gap-[29px] z-30">
            <span className="text-black absolute top-[185px] left-[152px] z-20 font-inter text-[16px] leading-normal decoration-none">
              copyright@ TravelPoints 2024
            </span>
            <Instagram />
            <Facebook />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishList;