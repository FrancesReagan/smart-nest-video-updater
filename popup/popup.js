// popup.js: handles interactivity for the extension's popup window//
document.addEventListener("DOMContentLoaded", () => {
  const statusElement = document.getElementById("status");
  const checkButton = document.getElementById("checkButton");

  // initial status update//
  statusElement.textContent = "Ready";
  statusElement.style.color = "#764ba2";

  // add a click listener to the button//
  checkButton.addEventListener("click", () => {
    statusElement.textContent = "Checking...";
    statusElement.style.color = "#FFA500"; 

    // find the active tab and send a message to its content script//
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTabId = tabs[0].id;

        // send a custom message asking for the content script to perform a check//
        chrome.tabs.sendMessage(activeTabId, { action:"triggerVideoCheck" }, (response) => {
          if (chrome.runtime.lastError) {
            // handle cases where the content script might not be running (e.g. non-youtube page)//
            statusElement.textContent = "Not on YouTube or script failed to load.";
            statusElement.style.color = "#D9534F"; 
          } else if (response && response.status === "check initiated") {
            statusElement.textContent = "Check initiated in the tab.";
            statusElement.style.color = "#28a745";
          } else {
            statusElement.textContent = "No educational content found.";
            statusElement.style.color = "#333";
          }
          });
          }
        });
      });
    });