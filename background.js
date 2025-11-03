// background.js: background service worker script for SmartNest Video Updater//
console.log("SmartNest Video Updater background service worker started.");

// listen for when the extension is first installed or updated.//
//this is a good place to set inital extension status in storage//
chrome.runtime.onInstalled.addListener(() => {
  console.log("SmartNest Extension Installed/Updated. Setting initial status.");

  // example: use the storage API to save a default setting//
  chrome.storage.local.set({ extensionStatus: "active" });
});

