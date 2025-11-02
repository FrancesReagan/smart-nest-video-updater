
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
   <h3> 🪺 SmartNest Detected <h3>
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
    showUpdateNotification(videoInfo);
  }
}

// Watch for YouTube navigation//
// YouTube is a SPA (single page application). Use MutationObserver on a stable
// element to detect when the user navigates to a new video URL.//

const pageManager = document.querySelector("ytd-page-manager");

if (pageManager) {
  // initialize observer//
  const observer = new MutationObserver(() => {
    // check if the URL has truly changed since the last check//
    if (location.href !== observer.lastURL) {
      observer.lastURL = location.href;
      // delay checking the DOM to ensure YouTube has rendered new video details//
      setTimeout(checkVideoAndNotify, URL_CHANGE_CHECK_DELAY_MS);
    }
  });
}

// // 1st take  content.js - the "eyes" that watch youtube pages 
// // this is the first take -- no error handling no try catches and such will update//
// console.log('🪺 Smart Nest Video Updater is watching...');

// // 1st get info about the current youtube video //
// function getYouTubeVideoInfo() {
//   // youtube puts video titles in an h1 tag //
//   const titleElement = document.querySelector('h1.ytd-watch-metadata');
  
//   if (!titleElement) {
//     console.log('Not on a video page yet...');
//     return null;
//   }
  
//   // get video ID from URL (the part after "v=") //
//   const urlParams = new URLSearchParams(window.location.search);
//   const videoId = urlParams.get('v');
  
//   return {
//     platform: 'YouTube',
//     title: titleElement.textContent.trim(),
//     url: window.location.href,
//     videoId: videoId
//   };
// }

// // second: is this an educational video? //
// function isEducationalVideo(videoInfo) {
//   if (!videoInfo) return false;
  
//   // keywords that suggest this is a tutorial //
//   const educationalKeywords = [
//     'tutorial', 'how to', 'guide', 'learn',
//     'react', 'javascript', 'python', 'coding',
//     'programming', 'css', 'html', 'course',
//     'beginner', 'explained', 'introduction'
//   ];
  
//   const titleLower = videoInfo.title.toLowerCase();
  
//   // check if ANY keyword appears in title //
//   return educationalKeywords.some(keyword => titleLower.includes(keyword));
// }

// // third: show a notification //
// function showUpdateNotification(videoInfo) {
//   // remove any existing notification(s) //
//   const existing = document.getElementById('smart-nest-notification');
//   if (existing) existing.remove();
  
//   // create notification ... I will move styles into its on file soon//
//   const notification = document.createElement('div');
//   notification.id = 'smart-nest-notification';
//   notification.style.cssText = `
//     position: fixed;
//     top: 120px;
//     right: 20px;
//     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//     color: white;
//     padding: 20px;
//     border-radius: 12px;
//     box-shadow: 0 8px 32px rgba(0,0,0,0.5);
//     z-index: 999999;
//     max-width: 350px;
//     font-family: Arial, sans-serif;
//     animation: slideIn 0.3s ease-out;
//   `;
  
//   notification.innerHTML = `
//     <style>
//       @keyframes slideIn {
//         from { transform: translateX(400px); opacity: 0; }
//         to { transform: translateX(0); opacity: 1; }
//       }
//     </style>
//     <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
//       <h3 style="margin: 0; font-size: 18px; font-weight: bold;">🪺 Smart Nest Detected</h3>
//       <button id="smart-nest-close" style="background: none; border: none; color: white; font-size: 28px; cursor: pointer; padding: 0; line-height: 1; margin-left: 10px;">&times;</button>
//     </div>
//     <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">${videoInfo.title}</p>
//     <p style="margin: 10px 0 0 0; font-size: 13px; opacity: 0.95;">📚 Educational content detected!</p>
//   `;
  
//   document.body.appendChild(notification);
  
//   // close button functionality //
//   document.getElementById('smart-nest-close').addEventListener('click', () => {
//     notification.style.animation = 'slideIn 0.2s ease-in reverse';
//     setTimeout(() => notification.remove(), 200);
//   });
  
//   // auto-remove after 10 seconds //
//   setTimeout(() => {
//     if (document.getElementById('smart-nest-notification')) {
//       notification.style.animation = 'slideIn 0.2s ease-in reverse';
//       setTimeout(() => notification.remove(), 200);
//     }
//   }, 10000);
// }

// // fourth: main function that checks and notifies //
// function checkVideoAndNotify() {
//   const videoInfo = getYouTubeVideoInfo();
  
//   if (videoInfo && isEducationalVideo(videoInfo)) {
//     console.log('📚 Educational video detected:', videoInfo.title);
//     showUpdateNotification(videoInfo);
//   }
// }

// // fifth: watch for youtube navigation  //
// let lastUrl = location.href;
// new MutationObserver(() => {
//   const currentUrl = location.href;
//   if (currentUrl !== lastUrl) {
//     lastUrl = currentUrl;
//     setTimeout(checkVideoAndNotify, 2000);
//   }
// }).observe(document, { subtree: true, childList: true });

// // run when page loads //
// setTimeout(checkVideoAndNotify, 3000);


// 2nd take updated code with error handling below to implement with notes styling still in one place--will move to css files//
// // (function () {
//   'use strict';

//   console.log('🪺 Smart Nest Video Updater is watching...');

//   const NOTIFICATION_ID = 'smart-nest-notification';
//   const EDUCATIONAL_KEYWORDS = [
//     'tutorial', 'how to', 'guide', 'learn',
//     'react', 'javascript', 'python', 'coding',
//     'programming', 'css', 'html', 'course',
//     'beginner', 'explained', 'introduction'
//   ];

//   /**
//    * Defines the CSS for the notification and appends it to the document's head.
//    */
//   function injectNotificationStyles() {
//     const style = document.createElement('style');
//     style.textContent = `
//       .${NOTIFICATION_ID} {
//         position: fixed;
//         top: 120px;
//         right: 20px;
//         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//         color: white;
//         padding: 20px;
//         border-radius: 12px;
//         box-shadow: 0 8px 32px rgba(0,0,0,0.5);
//         z-index: 999999;
//         max-width: 350px;
//         font-family: Arial, sans-serif;
//         animation: slideIn 0.3s ease-out forwards;
//       }

//       .${NOTIFICATION_ID}.slide-out {
//         animation: slideOut 0.2s ease-in forwards;
//       }
      
//       .${NOTIFICATION_ID} .header {
//         display: flex;
//         justify-content: space-between;
//         align-items: start;
//         margin-bottom: 10px;
//       }
      
//       .${NOTIFICATION_ID} .header h3 {
//         margin: 0;
//         font-size: 18px;
//         font-weight: bold;
//       }
      
//       .${NOTIFICATION_ID} .close-button {
//         background: none;
//         border: none;
//         color: white;
//         font-size: 28px;
//         cursor: pointer;
//         padding: 0;
//         line-height: 1;
//         margin-left: 10px;
//       }
      
//       .${NOTIFICATION_ID} .title {
//         margin: 5px 0;
//         font-size: 14px;
//         font-weight: bold;
//       }
      
//       .${NOTIFICATION_ID} .message {
//         margin: 10px 0 0 0;
//         font-size: 13px;
//         opacity: 0.95;
//       }

//       @keyframes slideIn {
//         from { transform: translateX(400px); opacity: 0; }
//         to { transform: translateX(0); opacity: 1; }
//       }

//       @keyframes slideOut {
//         from { transform: translateX(0); opacity: 1; }
//         to { transform: translateX(400px); opacity: 0; }
//       }
//     `;
//     document.head.appendChild(style);
//   }

//   function getYouTubeVideoInfo() {
//     try {
//       const titleElement = document.querySelector('h1.ytd-watch-metadata');
//       const urlParams = new URLSearchParams(window.location.search);
//       const videoId = urlParams.get('v');

//       if (!titleElement || !videoId) {
//         return null;
//       }

//       return {
//         platform: 'YouTube',
//         title: titleElement.textContent.trim(),
//         url: window.location.href,
//         videoId: videoId
//       };
//     } catch (e) {
//       console.error('Error getting video info:', e);
//       return null;
//     }
//   }

//   function isEducationalVideo(videoInfo) {
//     if (!videoInfo) return false;
//     const titleLower = videoInfo.title.toLowerCase();
//     return EDUCATIONAL_KEYWORDS.some(keyword => titleLower.includes(keyword));
//   }

//   function showUpdateNotification(videoInfo) {
//     const existing = document.getElementById(NOTIFICATION_ID);
//     if (existing) existing.remove();

//     const notification = document.createElement('div');
//     notification.id = NOTIFICATION_ID;
//     notification.className = NOTIFICATION_ID;
    
//     notification.innerHTML = `
//       <div class="header">
//         <h3>🪺 Smart Nest Detected</h3>
//         <button class="close-button">&times;</button>
//       </div>
//       <p class="title">${videoInfo.title}</p>
//       <p class="message">📚 Educational content detected!</p>
//     `;
    
//     document.body.appendChild(notification);
    
//     document.querySelector(`#${NOTIFICATION_ID} .close-button`).addEventListener('click', () => {
//       notification.classList.add('slide-out');
//       setTimeout(() => notification.remove(), 200);
//     });

//     setTimeout(() => {
//       if (document.getElementById(NOTIFICATION_ID)) {
//         notification.classList.add('slide-out');
//         setTimeout(() => notification.remove(), 200);
//       }
//     }, 10000);
//   }

//   function checkVideoAndNotify() {
//     const videoInfo = getYouTubeVideoInfo();
//     if (videoInfo && isEducationalVideo(videoInfo)) {
//       console.log('📚 Educational video detected:', videoInfo.title);
//       showUpdateNotification(videoInfo);
//     }
//   }

//   // Initial setup: Inject styles and wait for the page to be ready
//   injectNotificationStyles();//
  
//   // Wait for the YouTube page manager element, which indicates a page load
//   const pageManager = document.querySelector('ytd-page-manager');//
  
//   if (pageManager) {
//     const observer = new MutationObserver((mutationsList, observer) => {
//       // Check for a URL change, as that's the clearest sign of navigation
//       if (location.href !== observer.lastUrl) {
//         observer.lastUrl = location.href;
//         // Delay the check to ensure the new video content has loaded
//         setTimeout(checkVideoAndNotify, 2000);
//       }
//     });
    
//     observer.observe(pageManager, { childList: true, subtree: true });
//     observer.lastUrl = location.href; // Initialize the last URL
//   } else {
//     // Fallback for the initial page load if the page manager isn't immediately ready
//     setTimeout(checkVideoAndNotify, 3000);//
//   }
// })();