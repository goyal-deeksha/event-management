import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookSlot } from "../Action/Action";
import moment from "moment-timezone"

const Slots = ({duration, startDate, selectedTimezone}) => {
  const dispatch = useDispatch();
  const { time } = useSelector((store) => store.data);

  const bookSlotHandler = (index) => {
    const dt = moment(startDate).format('YYYY-MM-DD');
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
                {tm ? tm?.substr(11, 5) : ''}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Slots;
