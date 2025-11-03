
// 3rd take content.js --- final version with error handling and separated styles//
(function () {  
  "use strict";

  console.log("🪺 SmartNest Video Updater is searching/watching..");
// using screaming snake case :)//
  const NOTIFICATION_ID_BASE = "smart-nest-notification";
  const NOTIFICATION_TIMEOUT_MS = 10000;
  const URL_CHANGE_CHECK_DELAY_MS = 2000;
  const ANIMATION_DURATION_MS = 200;

  const EDUCATIONAL_KEYWORDS = [
    "tutorial", "how to", "guide", "learn", "react", "javascript", "python", "coding",
    "programming", "css", "html", "course", "beginner", "explained", "introduction", 
    "AI", "data science", "open AI", "machine learning", "generative AI", 
    "open source learning", "free programming tutorial"
  ];

// retrieve key information about the currently viewed YouTube explainer video.
// returns {object|null} video info or null if not a video page/error occurred.//

function getYouTubeVideoInfo() {
  try {
    // YouTube has its titles in a H1 tag within a specific metadata element//
    const titleElement = document.querySelector("h1.ytd-watch-metadata");
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v");

    if (!titleElement || !videoId) {
      // not a standard video watch page//
      return  null;
    }

    return {
      platform: "Youtube",
      title: titleElement.textContent.trim(),
      url: window.location.href,
      videoId: videoId,
    };

  } catch (e) {
    console.error("Error getting video info:", e);
    return null;
  }
}
//  check if video title contains educational keywords. 
// param {object} videoInfo
// returns {boolean}//

function isEducationalVideo(videoInfo) {
  if (!videoInfo) return false;
  const titleLower = videoInfo.title.toLowerCase();
  return EDUCATIONAL_KEYWORDS.some(keyword => titleLower.includes(keyword));
}

// displays the notification UI element
// param {object} videoInfo//

function showUpdateNotification(videoInfo) {
  // remove any existing notification(s) first//
  const existing = document.getElementById(NOTIFICATION_ID_BASE);
  if (existing) existing.remove();

  // create notification element//
  const notification = document.createElement("div");
  notification.id = NOTIFICATION_ID_BASE;
  notification.className = NOTIFICATION_ID_BASE; 
  // use class for CSS styles--or may move to own file//

  notification.innerHTML = `
  <div class="header">
   <h3> 🪺 SmartNest Detected </h3>
   <button class="close-button">&times;</button>
  </div>
  <p class="title">${videoInfo.title}</p>
  <p class="message">📚 Educational content detected!</p>
  `;
    
  document.body.appendChild(notification);

  // close button functionality//
  const closeButton = document.querySelector(`#${NOTIFICATION_ID_BASE} .close-button`);
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      notification.classList.add("slide-out");
      setTimeout(() => notification.remove(), ANIMATION_DURATION_MS);
    }); 
  }

// auto-remove after set duration//
setTimeout(() => {
  const currentNotification = document.getElementById(NOTIFICATION_ID_BASE);
  if (currentNotification) {
    currentNotification.classList.add("slide-out");
    setTimeout(() => currentNotification.remove(), ANIMATION_DURATION_MS);
  }
}, NOTIFICATION_TIMEOUT_MS);
}

// function for main logic to check video and trigger notification.//

function checkVideoAndNotify() {
  const videoInfo = getYouTubeVideoInfo();
  if (videoInfo && isEducationalVideo(videoInfo)) {
    console.log("📚 Educational video detected:", videoInfo.title);
    // display the visual notification on the YouTube page//
    showUpdateNotification(videoInfo);

// communicate this event back to the background script (service worker)//
// this allows the background script to log the detection or update the storage.//
chrome.runtime.sendMessage({
  // define an action type//
  action: "logEducationalVideoDetected",
  // send relevant data//
  videoTitle: videoInfo.title
});

  }
}

// Watch for YouTube navigation//
// YouTube is a SPA (single page application). Use MutationObserver on a stable
// element to detect when the user navigates to a new video URL.//

const pageManager = document.querySelector("ytd-page-manager");
let observer; 
if (pageManager) {
  // initialize observer//
   observer = new MutationObserver(() => {
    // check if the URL has truly changed since the last check//
    if (location.href !== observer.lastURL) {
      observer.lastURL = location.href;
      // delay checking the DOM to ensure YouTube has rendered new video details//
      setTimeout(checkVideoAndNotify, URL_CHANGE_CHECK_DELAY_MS);
    }
  });


// start observing changes within the page manager (subtree and child elements)
observer.observe(pageManager, { childList: true, subtree: true });
observer.lastURL = location.href; 
// initialize the observer's last known URL //
}

// run on the inital page load (only if pageManager exists)
setTimeout(checkVideoAndNotify, URL_CHANGE_CHECK_DELAY_MS);

// listen for messages specifically from the popup or background scripts//
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "triggerVideoCheck") {
      // run the magin logic function defined above in content.js//
      checkVideoAndNotify();
      // send a confirmation response back to the popup.js script//
      sendResponse({ status: "check initiated" });
    }
  }
);

})();  
// end of the IIFE wrapper//