import React from 'react';
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from 'react-date-range';
import "../../views/screen6.css";

const DatePicker = ({setData}) => {
  const [state, setState] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const handleSelect = (ranges) => {
    // ranges.selection contains the start and end dates selected by the user
    setState([ranges.selection]);
    setData([ranges.selection])
  };

  return (
    <DateRangePicker className='absolute top-[100px] left-[170px] border-2 z-[999999]'
      ranges={state}
      onChange={handleSelect}
      rangeColors={["#141B34"]}
      style = {{width: "50em"}}
    />
  );
};

export default DatePicker;
