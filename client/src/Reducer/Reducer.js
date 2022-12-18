const initialState = {
  time: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_FREE_SLOTS": {
      return {
        ...state,
        time: action.payload,
      };
    }

    case "BOOK_SLOTS": {
      return {
        ...state,
        time: state.time.filter(item => item !== action.payload)
      };
    }

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
