import { useRef, useContext } from "react"
import { Routes, Route } from "react-router-dom"
import { Container } from "@mui/material"
import Users from "./components/Users"
import User from "./components/User"
import BlogPost from "./components/BlogPost"
import BlogList from "./components/BlogList"
import NavBar from "./components/NavBar"
import Notification from "./components/Notification"
import LoginForm from "./components/LoginForm"
import Togglable from "./components/Togglable"
import BlogForm from "./components/BlogForm"
import { useCurrentUser } from "./contexts/CurrentUserContext"
import CurrentUserContext from "./contexts/CurrentUserContext"

const App = () => {
  const user = useCurrentUser()

  const { resetCurrentUser } = useContext(CurrentUserContext)

  const blogFormRef = useRef()

  const handleLogout = async () => {
    resetCurrentUser()
  }

  return (
    <Container>
      {!user ? (
        <>
          <h1>Blog app</h1>
          <Notification />
          <Togglable buttonLabel="login">
            <LoginForm />
          </Togglable>
        </>
      ) : (
        <>
          <NavBar user={user} handleLogOut={handleLogout} />
          <h1>Blog app</h1>
          <Notification />
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
            <Route path="/add-blog" element={<BlogForm />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User user={user} />} />
          </Routes>
        </>
      )}
    </Container>
  )
}

export default App
