import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.data;
    case "RESET_NOTIFICATION":
      return "";
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, "");

  const setNotification = (notification) => {
    dispatch({ type: "SET_NOTIFICATION", data: notification });
    setTimeout(() => {
      dispatch({ type: "RESET_NOTIFICATION" });
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const { setNotification } = useContext(NotificationContext);
  return setNotification;
};

export const useNotificationValue = () => {
  const { notification } = useContext(NotificationContext);
  return notification;
};

export default NotificationContext;
