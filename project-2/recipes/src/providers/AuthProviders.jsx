import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { configure } from "axios-hooks";
const loginRequest = async (values) => {
  let data = await axios.post("/api/v1/login", {
    username: values.username,
    password: values.password,
  });
  console.log(JSON.stringify(data));
  return data.data.access_token;
};

const AuthContext = React.createContext({});

const AuthProvider = (props) => {
  const [accessToken, setAaccessToken] = React.useState("");
  const [tokenExpires, setTokenExpires] = React.useState({});
  const [authError, setAuthError] = React.useState("");

  const { mutateAsync: loginMutation, isSuccess: isLoginSuccess } = useMutation(
    loginRequest,
    {
      onError: (error, variables, context) => {
        setAuthError(error.response.data.msg);
      },
      onSuccess: (data) => {
        setAaccessToken(data);
        console.log(`Decoding data ${data}`);
        const decoded = jwt_decode(data);
        setTokenExpires(decoded.exp);
      },
    },
  );

  const login = async (username, password) => {
    try {
      await loginMutation(username, password);
    } catch (e) {}
    // if the username/password is incorrect.
  };

  // for debugging purpose, lets print out the token each time it changes
  React.useEffect(() => {
    console.log(`Got token ${accessToken}`);
  }, [accessToken]);
  React.useEffect(() => {
    // add authorization token to each request
    if (accessToken && accessToken !== "") {
      axios.interceptors.request.use((config) => {
        config.baseURL = "http://localhost:5001";
        config.headers.authorization = `Bearer ${accessToken}`;
        return config;
      });
    }
    axios.interceptors.request.use((config) => {
      config.baseURL = "http://localhost:5001";
      return config;
    });

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        return Promise.reject(error);
      },
    );
    // configure axios-hooks to use this instance of axios
    configure({ axios });
  }, [accessToken]);

  // these variables are stable and hence do not require a use effect
  const isSuccess = isLoginSuccess;
  const isAuthenticated = isSuccess && !!accessToken.current;
  const isError = authError;
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        isError,
        isSuccess,
      }}
      {...props}
    ></AuthContext.Provider>
  );
};
export { AuthProvider, AuthContext, axios };
