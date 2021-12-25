import React, { useReducer } from "react";
import reducer from './reducer';
import Context from './Context';

// 默认状态
const defaultState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  host: "https://wenglou.com",
};

function Provider(props) {

    const [state, dispatch] = useReducer(reducer, defaultState);

    return (
        <Context.Provider value={{state, dispatch}}>
            {props.children}
        </Context.Provider>
    )
}

export default Provider;