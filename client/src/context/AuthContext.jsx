import React, {useState, createContext } from 'react';
import { useHistory } from "react-router-dom";
import { publicFetch } from '../api';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const history = useHistory();
  let silentRefresh;

  const userInfo = localStorage.getItem("userInfo");
  const expiresAt = localStorage.getItem("expiresAt");

  const [authState, setAuthState] = useState({
    expiresAt,
    userInfo: userInfo ? JSON.parse(userInfo) : {}
  });

  const setAuthInfo = ({ expiresAt, userInfo }) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("expiresAt", expiresAt);

    setAuthState({ 
      expiresAt, 
      userInfo 
    });

    const SILENT_REFRESH_TIME = new Date(expiresAt * 1000 - 1000 * 60 * 5);
    silentRefresh = setTimeout(() => {
      alert("Do Silent Refresh!");
      console.log("Do Silent Refresh!");
    }, SILENT_REFRESH_TIME.getTime() - Date.now());
  }

  const logout = () => {
    //TODO: Delete accessToken Cookie
    publicFetch
      .get("logout")
      .then((res) => console.log('You are logged out from server'))
      .catch((err) => console.log("Something went Wrong. Could not logout from server"));

    localStorage.removeItem("userInfo");
    localStorage.removeItem("expiresAt");

    clearTimeout(silentRefresh);

    setAuthState({
      expiresAt: null,
      userInfo: {},
    });
    history.push('/login')
  }

  const isAuthenticated = () => {
    if(!authState.expiresAt) return false

    return new Date().getTime() / 1000 < authState.expiresAt
  }

  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
