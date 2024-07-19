import ReactDOM from "react-dom/client"
import App from "./App"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NotificationContextProvider } from "./contexts/NotificationContext"
import { CurrentUserContextProvider } from "./contexts/CurrentUserContext"
import { BrowserRouter as Router } from "react-router-dom"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <CurrentUserContextProvider>
      <NotificationContextProvider>
        <Router>
          <App />
        </Router>
      </NotificationContextProvider>
    </CurrentUserContextProvider>
  </QueryClientProvider>
)
