import RightSide from "./RightSide";
import LeftSide from "./LeftSide";
import { useState } from "react";
{
  /* <Datepicker /> */
}

const Homepage = () => {
  const [duration, setDuration] = useState(0)
  const [startDate, setStartDate] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState({});

  return (
    <div className="row">
      <div className="col-6">
        <RightSide duration = {duration} setDuration={setDuration} startDate={startDate} setStartDate={setStartDate} selectedTimezone={selectedTimezone} setSelectedTimezone = {setSelectedTimezone}/>
      </div>
      <div className="col-6">
        <LeftSide duration = {duration} startDate={startDate} selectedTimezone={selectedTimezone}/>
      </div>
    </div>
  );
};

export default Homepage;
