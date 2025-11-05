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

      // call OpenAI API -- magic!!..//
      const response = await fetch(OPENAI_API_URL,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${OPENAI_API_KEY}`
        },

        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert at analyzing educational content freshness. Always respond with valid JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ],
// temp lower means more consistent responses and for tokens this number limits response length so lower cost//
          temperature: 0.3, 
          max_tokens: 300
        })
      });

      // checking if API call was successfull//
      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      console.log("🤖 Raw AI response:", aiResponse);

      // parse the JSON response from AI//
      let analysis;
      try {
        analysis = JSON.parse(aiResponse);
      }catch (parseError) {
        console.error("❌ Failed to parse AI response as JSON:",parseError);

        // fallback if AI doe not return valid JSON//
        analysis = {
          isLikelyOutdated: false,
          confidence: "low",
          reasoning: "AI response was not in the expected format",
          technology: "Unknown",
          recommendedUpdate: null
        
        };
      }

      // update the analysis counter in storage//
      chrome.storage.local.get(["aiAnalysisCount"], (result) => {
       const newCount = (result.aiAnalysisCount || 0) + 1;
       chrome.storage.local.set({aiAnalysisCount: newCount});
      console.log(`📊 Total AI analyses performed: ${newCount}`);
  });

  return {
    success: true,
    analysis: analysis,
    // approx. cost per analysis//
    apiCost:"~$0.0003"
  }; 
} catch (error) {
  console.error("❌ Error analyzing video with AI:", error);
  return {
    success : false,
    error:error.message,
    hint: error.message.includes("API key")
    ?"Check your OpenAI API key"
    :"Check your internet connection"
  }; 
 }
}


// Listen for messages from content.js or popup.js scripts//
// this allows different parts of the extension to commuicate with each other//
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // check if the message is the one sent from content.js when a video is found//
    if (request.action === "logEducationalVideoDetected") {
      console.log("📚Background: Educational video detected ->",request.videoTitle);

      // I could update a counter in storage here if I wanted to track stats:
      chrome.storage.local.get(["detectionCount"], (result) => {
        const newCount = (result.detectionCount || 0) + 1;  
        chrome.storage.local.set({detectionCount: newCount}); 
      });
      // send a confirmation response back to the sender//
      sendResponse({ status: "logged successfully in background" });
    }

    // handle AI analysis requests from content.js//
    if (request.action === "analyzeVideo") {
      console.log("🔍 Background: Received AI analysis request for:",
        request.videoInfo?.title);

        // call the AI analysis function//
        analyzeVideoWithAI(request.videoInfo)
        .then(result => {
          console.log("✅ Background: Analysis complete, sending results");
          sendResponse(result);
        })
        .catch(error => {
          console.error("❌ Background: Analysis failed:", error);
          sendResponse({
            success : false,
            error : error.message
          });
        });
