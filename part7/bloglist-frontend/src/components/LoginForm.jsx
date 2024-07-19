import { useContext } from "react"
import { useMutation } from "@tanstack/react-query"
import CurrentUserContext from "../contexts/CurrentUserContext"
import { useNotification } from "../contexts/NotificationContext"
import loginService from "../services/login"
import { Button, TextField } from "@mui/material"

const LoginForm = () => {
  const dispatch = useNotification()

  const { setCurrentUser } = useContext(CurrentUserContext)

  const newLoginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (data) => {
      setCurrentUser(data)
      dispatch(`Logged in as: ${data.username}`)
    },
    onError: (error) => {
      dispatch(error.response.data.error)
    }
  })

  const handleLogin = (event) => {
    event.preventDefault()

    const username = event.target.username.value
    const password = event.target.password.value

    newLoginMutation.mutate({ username, password })
    dispatch(`Logged in as: ${username}`)
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            id="username"
            type="text"
            name="username"
          />
        </div>
        <div>
          <TextField
            label="password"
            id="password"
            type="password"
            name="password"
          />
        </div>
        <Button type="submit">login</Button>
      </form>
    </div>
  )
}

export default LoginForm
