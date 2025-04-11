import { Router, useRouter } from "next/router";
import { createContext, useContext, useEffect, useReducer } from "react";
import { useReducerAsync } from "use-reducer-async";

const PageProviderContext = createContext();
const PageProviderContextDispatcher = createContext();
const initialState = {
  select: 100,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_PAGE":
      return { select: action.payload };
    default:
      return { ...state };
  }
};

const asyncActionHandlers = {
  CHANGE:
    ({ dispatch }) =>
    (action) => {
      dispatch({ type: "CHANGE_PAGE", payload: action.payload });
    },
};
const PageProvider = ({ children }) => {
  const [user, dispatch] = useReducerAsync(
    reducer,
    initialState,
    asyncActionHandlers
  );
  const router = useRouter();
  useEffect(() => {
    switch (router.pathname.split("/")[2]) {
      case "record":
        dispatch({
          type: "CHANGE",
          payload: 1,
        });
        break;
      case "appointment":
        dispatch({
          type: "CHANGE",
          payload: 1,
        });
        break;

      case "vip-appointment":
        dispatch({
          type: "CHANGE",
          payload: 1,
        });
        break;

      case "transfer":
        dispatch({
          type: "CHANGE",
          payload: 1,
        });
        break;

      case "doctor":
        dispatch({
          type: "CHANGE",
          payload: 2,
        });
        break;

      case "phone-numbers":
        dispatch({
          type: "CHANGE",
          payload: 3,
        });
        break;
      case "fix":
        dispatch({
          type: "CHANGE",
          payload: 3,
        });
        break;
      case "finance":
        dispatch({
          type: "CHANGE",
          payload: 4,
        });
        break;

      case "paraclinic":
        dispatch({
          type: "CHANGE",
          payload: 5,
        });
        break;

      case "service":
        dispatch({
          type: "CHANGE",
          payload: 9,
        });
        break;

      case "clinic":
        dispatch({
          type: "CHANGE",
          payload: 9,
        });
        break;

      case "patient-status":
        dispatch({
          type: "CHANGE",
          payload: 9,
        });
        break;

      case "diseases":
        dispatch({
          type: "CHANGE",
          payload: 9,
        });
        break;

      case "message":
        dispatch({
          type: "CHANGE",
          payload: 7,
        });
        break;

      case "users":
        dispatch({
          type: "CHANGE",
          payload: 8,
        });
        break;
    }
  }, []);
  return (
    <PageProviderContext.Provider value={user}>
      <PageProviderContextDispatcher.Provider value={dispatch}>
        {children}
      </PageProviderContextDispatcher.Provider>
    </PageProviderContext.Provider>
  );
};

export default PageProvider; 

export const useSelect = () => useContext(PageProviderContext);
export const useSelectActions = () => useContext(PageProviderContextDispatcher);
