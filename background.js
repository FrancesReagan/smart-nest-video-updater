// background.js: background service worker script for SmartNest Video Updater//
console.log("SmartNest Video Updater background service worker started.");

// listen for when the extension is first installed or updated.//
//this is a good place to set inital extension status in storage//
chrome.runtime.onInstalled.addListener(() => {
  console.log("SmartNest Extension Installed/Updated. Setting initial status.");

  // example: use the storage API to save a default setting//
  chrome.storage.local.set({ extensionStatus: "active" });
});

// Listen for messages from content.js or popup.js scripts//
// this allows different parts of the extension to commuicate with each other//
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // check if the message is the one sent from content.js when a video is found//
    if (request.action === "logEducationalVideoDetected") {
      console.log("Background: Educational video detected ->", request.videoTitle);

      // I could update a counter in storage here if I wanted to track stats:
      // chrome.storage.local.get(["detectionCount"], (result) => { ... }); //

      // send a confirmation response back to the sender//
      sendResponse({ status: "logged successfully in background" });
    }

    // I could add  more listeners here for other actions if I need in the future//
    
  }
);