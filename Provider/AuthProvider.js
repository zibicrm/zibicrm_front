import { createContext, useContext, useEffect, useReducer } from "react";
import { useReducerAsync } from "use-reducer-async";
import { toast } from "react-toastify";
import Router from "next/router";
import { LoginUserService } from "../Services/loginService";
import { logoutService } from "../Services/logoutService";
import { redirect } from "next/dist/server/api-utils";
const AuthUserProviderContext = createContext();
const AuthUserProviderContextDispatcher = createContext();
const initialState = {
  user: null,
  loading: true,
  error: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SIGNUP_PENDING":
      return { ...state, loading: true };
    case "SIGNUP_SUCCESS":
      return { ...state, user: action.payload, loading: false };
    case "SIGNUP_REJECT":
      return { ...state, error: action.error, loading: false };
    case "LOGOUT_SUCCESS":
      return { ...state, user: null, error: null, loading: false };
    case "LOGIN_PENDING":
      return { ...state, loading: true };
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload, loading: false };
    case "LOGIN_REJECT":
      return { ...state, error: action.error, loading: false };
    case "LOAD_SUCCESS":
      return { ...state, user: action.payload, loading: false };
    default:
      return { ...state };
  }
};
const asyncActionHandlers = {
  LOGIN:
    ({ dispatch }) =>
    (action) => {
      dispatch({ type: "LOGIN_PENDING" });
      LoginUserService(action.payload)
        .then((res) => {
          const data = res.data;
          if (!data.status) {
            dispatch({ type: "LOGIN_REJECT", payload: data });
            toast.error(data.message[0], {
              toastId: "errorLogin",
            });
          } else {
            dispatch({ type: "LOGIN_SUCCESS", payload: data.result });
            toast.success("با موفقیت وارد شدید", {
              toastId: "succesLogin",
            });
            localStorage.setItem("access_token", JSON.stringify(data.result));
            let redirectLink;
            if (redirectDahsboard === true) {
              data.result.user.rule === 1
                ? (redirectLink = "/operator")
                : data.result.user.rule === 3 && data.result.user.doctor !== 1
                ? (redirectLink = "/clinic")
                : data.result.user.rule === 3 && data.result.user.doctor !== 1
                ? (redirectLink = "/doctor")
                : data.result.user.rule === 2 &&
                  data.result.user.accountant === 1
                ? (redirectLink = "/accountant")
                : (redirectLink = "/admin");
              Router.push(redirectLink);
            }
          }
          action.formik.setStatus(0);
        })
        .catch((err) => {
          dispatch({ type: "LOGIN_REJECT", payload: err });
          action.formik.setStatus(0);
        });
    },
  LOAD_USER:
    ({ dispatch }) =>
    (action) => {
      const token = localStorage.getItem("access_token");
      token
        ? dispatch({ type: "LOGIN_SUCCESS", payload: JSON.parse(token) })
        : dispatch({ type: "LOGIN_REJECT", payload: "err" });
    },
  LOGOUT:
    ({ dispatch }) =>
    (action) => {
      if (action.payload) {
        logoutService(action.payload)
          .then(({ data }) => {
            if (!data.status) {
              toast.error("خروج از حساب کاربری با مشکل مواجه شد", {
                toastId: "errorLogout",
              });
            } else {
              dispatch({ type: "LOGOUT_SUCCESS", payload: null });
              toast.success("با موفقیت خارج شدید", {
                toastId: "succesLogout",
              });
              localStorage.removeItem("access_token");
            }
            Router.push("/");
          })
          .catch((err) => {
            if (err.response && err.response.status === 401) {
              localStorage.removeItem("access_token");
              dispatch({ type: "LOGOUT_SUCCESS", payload: null });
            }
            if (err.response) {
              toast.error(err.response.data.message, {
                toastId: "errorLogout1",
              });
            }
            Router.push("/");
          });
      } else {
        dispatch({ type: "LOGOUT_SUCCESS", payload: null });
        toast.success("با موفقیت خارج شدید", {
          toastId: "succesLogout",
        });
        localStorage.removeItem("access_token");
      }
    },
  LOGOUTNOTTOKEN:
    ({ dispatch }) =>
    (action) => {
      dispatch({ type: "LOGOUT_SUCCESS", payload: null });
      localStorage.removeItem("access_token");
      Router.push("/");
    },
};
const AuthUserProvider = ({ children }) => {
  const [user, dispatch] = useReducerAsync(
    reducer,
    initialState,
    asyncActionHandlers
  );
  useEffect(() => {
    dispatch({ type: "LOAD_USER" });
  }, []);

  return (
    <AuthUserProviderContext.Provider value={user}>
      <AuthUserProviderContextDispatcher.Provider value={dispatch}>
        {children}
      </AuthUserProviderContextDispatcher.Provider>
    </AuthUserProviderContext.Provider>
  );
};

export default AuthUserProvider;

export const useAuth = () => useContext(AuthUserProviderContext);
export const useAuthActions = () =>
  useContext(AuthUserProviderContextDispatcher);
