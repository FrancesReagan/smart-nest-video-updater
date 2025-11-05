// add openai integration for intelligent video analysis//
// add import config.js here...//


// background.js: background service worker script for SmartNest Video Updater//
// now includes OpenAI integration for smart video analysis//

(function() {
  "use strict";

console.log("SmartNest Video Updater background service worker started.");

// When ready --- ? don't ? REPLACE with MY OpenAI API key from https://platform.openai.com/api-keys//
const OPENAI_API_KEY = "sk-proj-my-actual-api-key-here";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";


// listen for when the extension is first installed or updated.//
//this is a good place to set inital extension status in storage//
chrome.runtime.onInstalled.addListener(() => {
  console.log("SmartNest Extension Installed/Updated. Setting initial status.");

  //  use the storage API to save a default setting//
  chrome.storage.local.set({ 
    extensionStatus: "active",
    // tracking how many AI analyses it has done//
  aiAnalysisCount:0 });
});

// analyze a video using OpenAI to determine if the content is truly outdated.
// @param {object} videoInfo - information about the video from content.js //
// @returns {Promise<object>} Analysis results with recommendations//

async function analyzeVideoWithAI(videoInfo) {
  try {
    console.log("🤖 Commencing AI analysis for:", videoInfo.title);

    // create the prompt for OpenAI - this will tell the AI what it is to do:)//
    const prompt = `You are an expert at analyzing educational technology content freshness, newness, latest iteration.
    
    Video Title: "${videoInfo.title}"
    Platform: ${videoInfo.platform}
    Task: Determine if the educational video might be outdated based on the title.
    
    Consider:
    -Is this about a specific software/framework/tool that updates frequently?
    -Are there version numbers or years in the title that suggest it's old?
    -What technology is being taught and how fast does it change?
    
    Examples of outdated indicators:
    -"React 16" (React is now at version 19)
    -"Python 2" (Python 3 is current)
    -"Figma Version 125.4.9" (Figma 125.9.10 or higher is current)
    -"2021 tutorial" (likely outdated if about fast-changing tech)
    
    Respond ONLY with valid JSON in this exact format:
    {
      "isLikelyOutdated": true or false,
      "confidence": "high" or "medium" or "low",
      "reasoning": "Brief 1-2 sentence explanation",
      "technology": "Name of main technology",
      "recommendedUpdate": "What likely changed(if outdated)" or null
      }`;

      
  }
}


// Listen for messages from content.js or popup.js scripts//
// this allows different parts of the extension to commuicate with each other//
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // check if the message is the one sent from content.js when a video is found//
    if (request.action === "logEducationalVideoDetected") {
      console.log("Background: Educational video detected ->",request.videoTitle);

      // I could update a counter in storage here if I wanted to track stats:
      // chrome.storage.local.get(["detectionCount"], (result) => { ... }); //

      // send a confirmation response back to the sender//
      sendResponse({ status: "logged successfully in background" });
    }

    // I could add  more listeners here for other actions if I need in the future//
    
  }
);