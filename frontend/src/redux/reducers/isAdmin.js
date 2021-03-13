const isAdminReducer = (state = null, { type, payload }) => {
  switch (type) {
    case "SET_ISADMIN":
      return payload;
    default:
      return state;
  }
};

export default isAdminReducer;
