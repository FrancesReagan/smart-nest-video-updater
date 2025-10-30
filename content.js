// content.js - The "eyes" that watch YouTube pages
console.log('🪺 Smart Nest Video Updater is watching...');

// STEP 1: Get info about the current YouTube video
function getYouTubeVideoInfo() {
  // YouTube puts video titles in an h1 tag
  const titleElement = document.querySelector('h1.ytd-watch-metadata');
  
  if (!titleElement) {
    console.log('Not on a video page yet...');
    return null;
  }
  
  // Get video ID from URL (the part after "v=")
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');
  
  return {
    platform: 'YouTube',
    title: titleElement.textContent.trim(),
    url: window.location.href,
    videoId: videoId
  };
}

// STEP 2: Is this an educational video?
function isEducationalVideo(videoInfo) {
  if (!videoInfo) return false;
  
  // Keywords that suggest this is a tutorial
  const educationalKeywords = [
    'tutorial', 'how to', 'guide', 'learn',
    'react', 'javascript', 'python', 'coding',
    'programming', 'css', 'html', 'course',
    'beginner', 'explained', 'introduction'
  ];
  
  const titleLower = videoInfo.title.toLowerCase();
  
  // Check if ANY keyword appears in title
  return educationalKeywords.some(keyword => titleLower.includes(keyword));
}

// STEP 3: Show a simple notification
function showUpdateNotification(videoInfo) {
  // Remove any existing notification
  const existing = document.getElementById('smart-nest-notification');
  if (existing) existing.remove();
  
  // Create notification
  const notification = document.createElement('div');
  notification.id = 'smart-nest-notification';
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 10000;
    max-width: 350px;
    font-family: Arial, sans-serif;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">🪺 Smart Nest Detected</h3>
      <button id="smart-nest-close" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
    </div>
    <p style="margin: 5px 0; font-size: 14px;"><strong>${videoInfo.title}</strong></p>
    <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.9;">Educational content detected! 🎓</p>
  `;
  
  document.body.appendChild(notification);
  
  // Close button functionality
  document.getElementById('smart-nest-close').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto-remove after 8 seconds
  setTimeout(() => notification.remove(), 8000);
}

// STEP 4: Main function that checks and notifies
function checkVideoAndNotify() {
  const videoInfo = getYouTubeVideoInfo();
  
  if (videoInfo && isEducationalVideo(videoInfo)) {
    console.log('📚 Educational video detected:', videoInfo.title);
    showUpdateNotification(videoInfo);
  }
}

// STEP 5: Watch for YouTube navigation (they don't reload pages)
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    setTimeout(checkVideoAndNotify, 2000);
  }
}).observe(document, { subtree: true, childList: true });

// Run when page loads
setTimeout(checkVideoAndNotify, 3000);