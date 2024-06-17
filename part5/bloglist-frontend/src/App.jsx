import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  const messageHandler = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      messageHandler("Logged in successfully!");
      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
      blogFormRef.current?.toggleVisibility();
    } catch (error) {
      console.log(error);
      messageHandler("Wrong username or password");
    }
  };

  const handleLogout = async () => {
    window.localStorage.clear();
    setUser(null);
    messageHandler("Successfully logged out");
  };

  const createBlog = async (newBlog) => {
    blogFormRef.current?.toggleVisibility();
    try {
      await blogService.create(newBlog);
      const blogs = await blogService.getAll();
      messageHandler("Blog added successfully.");
      setBlogs(blogs.sort((a, b) => b.likes - a.likes));
    } catch (error) {
      console.log(error);
      messageHandler("Error adding blog");
    }
  };

  const updateBlog = async (blog) => {
    try {
      await blogService.update(blog.id, blog);
      const blogs = await blogService.getAll();
      setBlogs(blogs.sort((a, b) => b.likes - a.likes));
      messageHandler(`Liked ${blog.title}!`);
    } catch (error) {
      console.log(error);
      messageHandler(`Unable to like ${blog.title}`);
    }
  };

  const deleteBlog = async (id, blog) => {
    try {
      if (window.confirm(`Remove blog: ${blog.title}?`)) {
        await blogService.deleteBlog(id);
        const blogs = await blogService.getAll();
        setBlogs(blogs.sort((a, b) => b.likes - a.likes));
        messageHandler("Blog deleted!");
      }
    } catch (error) {
      console.log(error);
      messageHandler("Error deleting blog");
    }
  };

  return (
    <div>
      <h1>Blog app</h1>
      <Notification message={message} />

      {!user && (
        <div>
          <Togglable buttonLabel="login">
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>
        </div>
      )}

      {user && (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          <Togglable buttonLabel="Add Blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
        </div>
      )}

      {blogs?.map((blog) => (
        <Blog
          key={blog.id}
          {...{ blog, updateBlog, deleteBlog, username: user?.username }}
        />
      ))}
    </div>
  );
};

export default App;
