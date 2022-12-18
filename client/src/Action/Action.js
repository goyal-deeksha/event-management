import axios from "../service/axios";

export const getFreeSlot = (date) => (dispatch) => {
  axios.post('/freeSlots', {
    date
  }).then((res) => {
    dispatch({
      type: "GET_FREE_SLOTS",
      payload: res.data,
    });
  }).catch(() => {

  })
};

export const bookSlot = (event) => (dispatch) => {
  axios.post('/create', {
    ...event
  }).then((res) => {
    console.log("after create")
    dispatch({
      type: "BOOK_SLOTS",
      payload: event,
    });
  }).catch(() => {

  })
};
