import { EnumActivity } from "models/enums";
import { convertDateToMinutes } from './dateUtil';

chrome.runtime.onMessage.addListener(function (message) {
	if (message._type === 'addPerson') {
		chrome.storage.local.set({ person: message.person })
		chrome.browserAction.setBadgeText({ text: 'ADD' })
		chrome.browserAction.setBadgeBackgroundColor({ color: '#fd6b54' })
	}
})

setInterval(function() {
  chrome.storage.local.get('activities', function(result) {
    if (result.activities) {
      const newEvents = result.activities.filter(activity => {
        const activityTime = convertDateToMinutes(activity.date);
        const currentTime = convertDateToMinutes(new Date());
        return (activityTime - currentTime) === 60; // check if diff one hour
      });

      if (newEvents && newEvents.length > 0) {
        newEvents.forEach(event => {
          const options = {
              body:`${EnumActivity[event.activity]} with ${event.person.first} ${event.person.last} in an hour!`,
              icon: "images/icon128.png",
              requireInteraction: true,
          };
          notifyMe('Todo Notification', options);
        })
      }
    }
  })
}, 60000)

function notifyMe(title, options) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    new Notification(title, options);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }

      if (permission === "granted") {
        new Notification(title, options);
      }
    });
  } else {
    alert(`Permission is ${Notification.permission}`);
  }
}
