import Rating from "react-rating";
import { ReactComponent as Star } from "../../externals/full_star.svg";
import { ReactComponent as EmptyStar } from "../../externals/empty_star.svg";

const Review = (review, readonly) => {
  return (
    <div className="flex flex-col bg-[#D9ED82] p-3 rounded-xl w-full">
      <Rating
        className="relative left-[-10px]"
        fullSymbol={<Star className="w-10" />}
        emptySymbol={<EmptyStar className="w-10" />}
        readonly={readonly}
        initialRating={review.rating}
      />
      <span className="text-[#141B34] w-[748px] font-[Inter] text-[18px] font-semibold">
        {review.userEmail} {":"} {review.description}
      </span>
    </div>
  );
};

export default Review;
