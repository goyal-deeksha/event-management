import EventBooking from "./eventBooking";
import Slots from "./slots";
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
        <EventBooking
          duration = {duration}
          setDuration={setDuration}
          startDate={startDate}
          setStartDate={setStartDate}
          selectedTimezone={selectedTimezone}
          setSelectedTimezone = {setSelectedTimezone}
        />
      </div>
      <div className="col-6">
        <Slots duration = {duration} startDate={startDate} selectedTimezone={selectedTimezone}/>
      </div>
    </div>
  );
};

export default Homepage;
