import React from "react";
import "../CSS/RightSide.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import TimezoneSelect from "react-timezone-select";
import { useDispatch } from "react-redux";
import { getFreeSlot } from "../Action/Action";
import moment from 'moment';

const EventBooking = (props) => {
  const {duration, setDuration, startDate, setStartDate, selectedTimezone, setSelectedTimezone} = props;
  const dispatch = useDispatch();

  const getFreeSlots = () => {
    const dt = moment(startDate).format('YYYY-MM-DD');
    dispatch(getFreeSlot(dt, selectedTimezone.value));
  };

  return (
    <div className="contaner" style={{ textAlign: "center" }}>
      <div className="span-div" style={{ marginTop: "17px" }}>
        <span>Select Date</span>
      </div>
      <div style={{ padding: "6px" }}>
        <DatePicker
          className="date-cmp date-picker"
          style={{ padding: "5px" }}
          selected={startDate}
          onChange={(date) => { 
            setStartDate(date)}}
        />
      </div>
      <div style={{ width: "51%", textAlign: "end", marginTop: "17px" }}>
        <span>Time Duration</span>
      </div>
      <div>
        <input
          style={{
            padding: "5px",
          }}
          type="text"
          placeholder="Add Minute Duration"
          onChange={(e) => {setDuration(e.target.value)}}
          value={duration}
        />
      </div>
      <div style={{ width: "45%", textAlign: "end", marginTop: "17px" }}>
        <span>Time Zone</span>
      </div>
      <div
        style={{
          width: "42%",
          margin: "auto",
        }}
      >
        <TimezoneSelect
          value={selectedTimezone}
          onChange={setSelectedTimezone}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: "15px" }}
        onClick={getFreeSlots}
      >
        Get Free Slot
      </button>
    </div>
  );
};

export default EventBooking;
