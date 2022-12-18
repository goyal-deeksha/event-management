import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookSlot } from "../Action/Action";
import moment from "moment-timezone"

const LeftSide = ({duration, startDate, selectedTimezone}) => {
  const dispatch = useDispatch();
  const { time } = useSelector((store) => store.data);

  const bookSlotHandler = (index) => {
  const tmp_date = new Date(startDate).setHours(parseInt(time[index]), time[index].slice(-2))
    const dt = moment(tmp_date);
    alert(dt);
    dispatch(bookSlot({ duration: duration, date: dt, timezone: selectedTimezone, description: "", time: time[index]  }));
  }

  return (
    <div>
      <h3 style={{ marginTop: "21px" }}>Available Time</h3>
      <h5>Demo Time</h5>
      {time.map((tm, i) => {
        return (
          <div className="row" key={i}>
            <div
              className="col-3"
              style={{ textAlign: "center", margin: "7px" }}
            >
              <button type="button" className="btn btn-primary" onClick={() => bookSlotHandler(i)}>
                {tm}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeftSide;
