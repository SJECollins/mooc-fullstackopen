import { Alert } from "@mui/material"
import { useNotificationValue } from "../contexts/NotificationContext"

const Notification = () => {
  const notification = useNotificationValue()

  return <>{notification === "" ? null : <Alert>{notification}</Alert>}</>
}

export default Notification
