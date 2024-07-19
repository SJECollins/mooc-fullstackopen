import { Link } from "react-router-dom"
import { AppBar, Button, Icon, Toolbar, IconButton } from "@mui/material"

const NavBar = ({ user, handleLogOut }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          home
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Button color="inherit" component={Link} to="/add-blog">
          add blog
        </Button>
        {user ? (
          <>
            {user.name} logged in{" "}
            <Button color="inherit" onClick={handleLogOut}>
              logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
