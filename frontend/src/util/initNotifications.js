const initNotifications = (notificationsNumbers) => {
  let unreadMessages = {}
  for (let chatSlug in notificationsNumbers) {
    // notification is an string here as it is only used for counting
    unreadMessages[chatSlug] = new Array(notificationsNumbers[chatSlug]).fill('notification')
  }
  return unreadMessages
}

export default initNotifications