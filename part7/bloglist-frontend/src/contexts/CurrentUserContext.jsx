import { createContext, useReducer, useContext, useEffect } from "react"
import blogService from "../services/blogs"

const currentUserReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return action.data
    case "RESET_CURRENT_USER":
      return null
    default:
      return state
  }
}

const CurrentUserContext = createContext()

export const CurrentUserContextProvider = ({ children }) => {
  const [currentUser, dispatch] = useReducer(currentUserReducer, null)

  useEffect(() => {
    const storedUser = JSON.parse(window.localStorage.getItem("currentUser"))
    if (storedUser) {
      blogService.setToken(storedUser.token)
      dispatch({ type: "SET_CURRENT_USER", data: storedUser })
    }
  }, [])

  const setCurrentUser = (currentUser) => {
    window.localStorage.setItem("currentUser", JSON.stringify(currentUser))
    dispatch({ type: "SET_CURRENT_USER", data: currentUser })
  }

  const resetCurrentUser = () => {
    window.localStorage.clear()
    dispatch({ type: "RESET_CURRENT_USER" })
  }

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, resetCurrentUser }}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}

export const useCurrentUser = () => {
  const { currentUser } = useContext(CurrentUserContext)
  return currentUser
}

export default CurrentUserContext
