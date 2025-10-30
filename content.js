// content.js - the "eyes" that watch youtube pages //
console.log('🪺 Smart Nest Video Updater is watching...');

// 1st get info about the current youtube video //
function getYouTubeVideoInfo() {
  // youtube puts video titles in an h1 tag //
  const titleElement = document.querySelector('h1.ytd-watch-metadata');
  
  if (!titleElement) {
    console.log('Not on a video page yet...');
    return null;
  }
  
  // get video ID from URL (the part after "v=") //
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');
  
  return {
    platform: 'YouTube',
    title: titleElement.textContent.trim(),
    url: window.location.href,
    videoId: videoId
  };
}

// second: is this an educational video? //
function isEducationalVideo(videoInfo) {
  if (!videoInfo) return false;
  
  // keywords that suggest this is a tutorial //
  const educationalKeywords = [
    'tutorial', 'how to', 'guide', 'learn',
    'react', 'javascript', 'python', 'coding',
    'programming', 'css', 'html', 'course',
    'beginner', 'explained', 'introduction'
  ];
  
  const titleLower = videoInfo.title.toLowerCase();
  
  // check if ANY keyword appears in title //
  return educationalKeywords.some(keyword => titleLower.includes(keyword));
}

// third: show a notification //
function showUpdateNotification(videoInfo) {
  // remove any existing notification(s) //
  const existing = document.getElementById('smart-nest-notification');
  if (existing) existing.remove();
  
  // create notification //
  const notification = document.createElement('div');
  notification.id = 'smart-nest-notification';
  notification.style.cssText = `
    position: fixed;
    top: 120px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    z-index: 999999;
    max-width: 350px;
    font-family: Arial, sans-serif;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.innerHTML = `
    <style>
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    </style>
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
      <h3 style="margin: 0; font-size: 18px; font-weight: bold;">🪺 Smart Nest Detected</h3>
      <button id="smart-nest-close" style="background: none; border: none; color: white; font-size: 28px; cursor: pointer; padding: 0; line-height: 1; margin-left: 10px;">&times;</button>
    </div>
    <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">${videoInfo.title}</p>
    <p style="margin: 10px 0 0 0; font-size: 13px; opacity: 0.95;">📚 Educational content detected!</p>
  `;
  
  document.body.appendChild(notification);
  
  // close button functionality //
  document.getElementById('smart-nest-close').addEventListener('click', () => {
    notification.style.animation = 'slideIn 0.2s ease-in reverse';
    setTimeout(() => notification.remove(), 200);
  });
  
  // auto-remove after 10 seconds //
  setTimeout(() => {
    if (document.getElementById('smart-nest-notification')) {
      notification.style.animation = 'slideIn 0.2s ease-in reverse';
      setTimeout(() => notification.remove(), 200);
    }
  }, 10000);
}

// fourth: main function that checks and notifies //
function checkVideoAndNotify() {
  const videoInfo = getYouTubeVideoInfo();
  
  if (videoInfo && isEducationalVideo(videoInfo)) {
    console.log('📚 Educational video detected:', videoInfo.title);
    showUpdateNotification(videoInfo);
  }
}

// fifth: watch for youtube navigation  //
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    setTimeout(checkVideoAndNotify, 2000);
  }
}).observe(document, { subtree: true, childList: true });

// run when page loads //
setTimeout(checkVideoAndNotify, 3000);