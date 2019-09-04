import { EnumActivity } from "models/enums";
import { convertDateToMinutes } from './dateUtil';

chrome.runtime.onMessage.addListener(function (message) {
	if (message._type === 'addPerson') {
		chrome.storage.local.set({ person: message.person })
		chrome.browserAction.setBadgeText({ text: 'ADD' })
		chrome.browserAction.setBadgeBackgroundColor({ color: '#fd6b54' })
	}
})

chrome.runtime.onInstalled.addListener(function() {
  setInterval(function() {
    chrome.storage.local.get('activities', function({ activities }) {
      chrome.storage.local.get('alerts', function({ alerts }) {
        if (activities && alerts) {
          activities.forEach(({ activity, date, person, activityId }) => {
            const activityTime = convertDateToMinutes(date);
            const currentTime = convertDateToMinutes(new Date());
            const notificationBody = `${EnumActivity[activity]} with ${person ? person.first : ''}`;
            const diff = activityTime - currentTime;
            const alert = alerts.find(item => item.activityId === activityId);

            if (diff > 0 && diff <= 60 && !alert.isOneHourNotified) { // 1 hour
              notifyMe('Todo Notification', {
                body: `${notificationBody} in ${diff} minute${diff > 1 ? 's' : ''}.`,
                requireInteraction: true,
              });
              const updatedAlerts = alerts.map(item => item.activityId === activityId
                ? { ...item, isOneHourNotified: true, isOneDayNotified: true }
                : { ...item }
              );
              chrome.storage.local.set({ alerts: updatedAlerts });
            } else if (diff > 0 && diff <= 1440 && !alert.isOneDayNotified && !alert.isOneHourNotified) { // 24 hours
              notifyMe('Todo Notification', {
                body: `${notificationBody} in ${Math.floor(diff / 60)} hour${Math.floor(diff / 60) > 1 ? 's' : ''}.`,
                requireInteraction: true,
              });
              const updatedAlerts = alerts.map(item => item.activityId === activityId
                ? { ...item, isOneDayNotified: true }
                : { ...item }
              );
              chrome.storage.local.set({ alerts: updatedAlerts });
            }
          })
        }
      })
    })
  }, 60000) // one minute
})


function notifyMe(title, options) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    const newNotification = new Notification(title, options);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }

      if (permission === "granted") {
        const newNotification = new Notification(title, options);
      }
    });
  } else {
    alert(`Permission is ${Notification.permission}`);
  }
}
