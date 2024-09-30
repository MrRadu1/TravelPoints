import { useState } from "react";
import axios from "axios";
import { toast, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextToSpeech from "../textToSpeech/textToSpeech";
import Review from "./review";
import { useAuth } from "../../context/authcontext";
import Rating from "react-rating";
import { ReactComponent as Star } from "../../externals/full_star.svg";
import { ReactComponent as EmptyStar } from "../../externals/empty_star.svg";
import heartIcon from "../../externals/heart.svg";
import heartRedIcon from "../../externals/heart-red.svg"
import {jwtDecode} from "jwt-decode"; 

export const Offer = ({
  id,
  price,
  textDescription,
  location,
  audioBytes,
  country,
  reviews,
  offers,
  pointId,
  isDestinationsPage
}) => {
  const [opacity, setOpacity] = useState(0.1);
  const [reviewDescription, setReviewDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);

  const changeOpacity = () => {
    setOpacity(opacity < 0.3 ? 0.1 : 0.1);
  };

  const { token } = useAuth();

  const handleAddReview = async () => {
    try {
      await axios.post(`http://localhost/api/TravelPoints/PostReview/${id}`, {
        description: reviewDescription,
        rating: rating,
      });
      toast.success("Review added successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Bounce,
      });
    } catch (error) {
      toast.error("Failed to add review", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Bounce,
      });
    }
  };

  const addToWishlist = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 
    if (!token) {
      toast.error("You must be logged in to add to wishlist.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Bounce,
      });
      return;
    }
    const user = jwtDecode(token);
    console.log("Decoded user:", user);
    try {
      const userEmail = user.email; 
      await axios.post(`http://localhost/api/User/AddToWishlist/${userEmail}/${pointId}`);
      setIsAddedToWishlist(true);
    } catch (error) {
      toast.error("Failed to add to wishlist", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Bounce,
      });
    }
  };


  return (
    <div
      className="bg-[rgba(217,237,130,0.1)] flex items-center gap-20 py-8 px-24 flex-shrink-0 self-stretch z-0"
      onClick={changeOpacity}
      style={{
        background: `rgb(217, 237,130, ${opacity})`,
      }}
    >
      <ToastContainer />
      <div className="flex items-start relative gap-[2.5em] ">
        <div className=" w-[400px] z-20 h-[600px] flex items-start justify-center relative rounded-lg">
          <img
            src={`https://source.unsplash.com/400x600/?${location}`}
            className="absolute bottom-20 left-0 w-[400px] h-[600px] rounded-lg z-0"
          />
          <div className=" relative top-64 justify-center text-center flex flex-col items-center gap-4 z-10">
            <span className="text-white font-[PlayfairDisplay] text-[37px] font-medium">
              {location}
            </span>
            <div className="flex items-start gap-1.75">
              <div className="w-[22px] h-[22px] flex items-start flex-shrink-0 rounded-full relative overflow-hidden">
                {/* Icons/images within this container */}
              </div>
              <span className="relative right-2 text-white font-[Inter] justify-center items-center self-center text-[18px] font-medium">
                {location}
              </span>
            </div>
            <span className="text-white font-[Inter] text-[14px] font-normal">
              {`${Math.floor(Math.random() * 1000)} want to travel here`}
            </span>
          </div>
        </div>
      </div>
      <div className="flex relative flex-col items-start gap-16 pb-20">
        <span className="text-[#141B34] font-[Inter] text-[37px] font-bold">
          {location}
        </span>
        <div className="flex flex-col relative items-start gap-12">
          <div className="flex items-start gap-20">
            <span className="text-[#141B34] font-[Inter] text-[18px] font-semibold">
              Description:
            </span>
            <span className="text-[#141B34] w-[748px] font-[Inter] text-[18px] font-semibold z-0">
              {textDescription}
            </span>
          </div>
          <div className="flex items-start gap-[105px]">
            <span className="text-[#141B34] font-[Inter] text-[18px] font-semibold">
              Location:
            </span>
            <span className="text-[#141B34] w-[748px] font-[Inter] text-[18px] font-semibold">
              {location}
            </span>
          </div>
          <div className="flex items-start gap-20">
            <span className="text-[#141B34] font-[Inter] text-[18px] font-semibold">
              Price/Night:
            </span>
            <span className="text-[#141B34] w-[748px] font-[Inter] text-[18px] font-semibold">
              {price}
            </span>
          </div>
          <div>
            <TextToSpeech text={textDescription} />
          </div>
          <div className="flex items-start gap-[110px]">
            <span className="text-[#141B34] font-[Inter] text-[18px] font-semibold">
              Reviews
            </span>
            <span className="text-[#141B34] overflow-scroll py-4 h-[200px] flex flex-col gap-10 w-[748px] font-[Inter] text-[18px] font-semibold">
              {reviews.map((review, id) => (
                <Review readonly={true} key={id} {...review} />
              ))}
            </span>
          </div>
          {isDestinationsPage ? (
          <div className="flex items-start gap-[60px]"> 
            <span className="text-[#141B34] font-[Inter] text-[18px] font-semibold"> 
              Add to favorite:
            </span>
            <button onClick={addToWishlist} style={{ padding: "4px", width: "30px", height: "30px" }}> 
              <img src={isAddedToWishlist ? heartRedIcon : heartIcon} alt="Heart icon" style={{ width: "100%", height: "100%" }}></img> 
            </button>
          </div>
          ) : null}
        </div>
        {token ? (
          <div className="relative flex flex-col items-center justify-center w-full gap-4">
            <div className="text-[#141B34] w-[748px] font-[Inter] text-[18px] font-semibold self-start">
              Please leave a review:
            </div>
            <Rating
              className="relative left-[-10px] self-start"
              initialRating={0}
              fullSymbol={<Star className="w-10" />}
              emptySymbol={<EmptyStar className="w-10" />}
              onChange={(value) => setRating(value)}
            />
            <textarea
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
              className="relative w-full bg-inherit border-2 rounded-lg border-[#141B34] px-2 "
            ></textarea>
            <button
              onClick={handleAddReview}
              className="relative border-2 border-[#141B34] rounded-lg px-20 py-2 bg-[#141B34]"
            >
              <span className="text-white font-[Inter] text-[18px] font-semibold">
                Add Review
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Offer;
