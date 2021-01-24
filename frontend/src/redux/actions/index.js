export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";

export const logIn = (userId) => ({
  type: LOG_IN,
  payload: userId,
});

export const logOut = () => ({
  type: LOG_OUT,
});
