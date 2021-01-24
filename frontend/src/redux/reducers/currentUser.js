const currentUserReducer = (state = null, { type, payload }) => {
  switch (type) {
    case "LOG_IN":
      return payload;
    case "LOG_OUT":
      return null;
    default:
      return state;
  }
};

export default currentUserReducer;
