import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../CSS/Datepicker.css";

import TimezoneSelect from "react-timezone-select";

const Datepicker = () => {
  const [startDate, setStartDate] = useState(new Date());

  const [value, setValue] = useState();
  const [selectedTimezone, setSelectedTimezone] = useState({});

  const inputHandler = (e) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <div className="datepicker-div">
        <h2 style={{ width: "62%", margin: "auto" }}>Date Picker</h2>
        <div style={{ width: "64%", margin: "auto" }}>
          <DatePicker
            className="date-cmp"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <input
            style={{ marginTop: "18px", padding: "12px" }}
            type="text"
            placeholder="Add Minute Duration"
            onChange={inputHandler}
            value={value}
          />
        </div>
      </div>
      <div className="timezone">
        <h2 style={{ width: "50%", margin: "auto", textAlign: "center" }}>
          Timezone
        </h2>
        <div
          className="select-wrapper"
          style={{ width: "50%", margin: "auto" }}
        >
          <TimezoneSelect
            value={selectedTimezone}
            onChange={setSelectedTimezone}
          />
        </div>
        <div className="btn-div">
          <button
            type="button"
            class="btn btn-primary"
            style={{ marginTop: "15px" }}
          >
            Get Free Slot
          </button>
        </div>
      </div>
    </div>
  );
};

export default Datepicker;
