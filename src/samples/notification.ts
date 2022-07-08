import { Notification } from "electron"

const NOTIFICATION_TITLE = "EFS"
const NOTIFICATION_MESSAGE = "Electron from scratch is running."

export const EfsIsRunningNotification = () => new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_MESSAGE}).show()