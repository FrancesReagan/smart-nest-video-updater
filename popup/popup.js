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

        
      }
    } )
  }) 
})