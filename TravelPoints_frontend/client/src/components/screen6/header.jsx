import { useEffect, useState } from "react";
import { ReactComponent as Calendar } from "../../externals/calendar.svg";
import "../../views/screen6.css";

export const Header = ({startDateFunction, endDateFunction}) => {
  const [open, setOpen] = useState(false);

  const handleOpening = () => {
    setOpen(!open);
  };

  const [time, setTime] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(); 

  useEffect(() => {
    if (time) {
      setStartDate(time[0].startDate);
      setEndDate(time[0].endDate);
      startDateFunction(time[0].startDate);
      endDateFunction(time[0].endDate);
    }
  }, [time]);

  return (
    <div className="bg-[rgba(217,237,130,1)] flex items-center gap-3 flex-shrink-0 self-stretch">
      <div className="flex justify-end items-center gap-[226px] py-1">
        <div className="w-[822px] h-[349px] flex flex-col justify-center items-start gap-2.5 p-0 px-[77px] flex-shrink-0">
          <div className="flex flex-col justify-center items-start gap-8">
            <span className="text-[#141B34] w-[729px] text-left leading-normal font-[PlayfairDisplay] text-[60px] font-bold">
              Find the perfect destination for you:
            </span>
            <span className="text-[#141B34] w-[618px] text-left leading-normal font-[Inter] text-[18px] font-medium">
              We help people find co travellers and also structure their travel
              plans
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-end items-center gap-3 z-[9999] relative">
          <span className="text-[#141B34] w-[251px] text-left leading-normal font-[Inter] text-[18px] font-medium ml-80">
            When do you want to travel?
          </span>
          <button
            className="flex justify-center items-center gap-2.5 py-3.5 px-[38px] rounded-full border-2 border-[#141B34] ml-80 mb-0"
            onClick={handleOpening}
          >
            <div className="flex justify-center items-center gap-2.5">
              <Calendar/>
              <span className="text-[#141B34] text-left leading-normal font-[Inter] text-[16px] font-medium">
                {startDate ? startDate.toDateString() : "start date"}
              </span>
            </div>
            <div className="flex justify-center items-center gap-2.5">
              <Calendar />
              <span className="text-[#141B34] text-left leading-normal font-[Inter] text-[16px] font-medium">
                {endDate ? endDate.toDateString() : "end date"}
              </span>
            </div>
          </button>
          {/* {open ? <DatePicker setData={setTime} /> : false} */}
        </div>
      </div>
    </div>
  );
};

export default Header;
