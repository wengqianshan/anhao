function reducer(prevState, action) {
  const { type, payload } = action;
  switch (type) {
    case "INIT_CONFIG":
      return {
        ...prevState,
        userToken: payload.token,
        host: payload.host,
      };
    case "RESTORE_TOKEN":
      return {
        ...prevState,
        userToken: payload.token,
        isLoading: false,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        isSignout: false,
        userToken: payload.token,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
      };
    case "SET_HOST":
      return {
        ...prevState,
        host: payload.host,
      };
    case "DELETE_CONTENT":
      const { id } = payload;
      return {
        ...prevState,
      };
  }
}

export default reducer;