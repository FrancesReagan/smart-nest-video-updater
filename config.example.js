// config.example.js - configuation template//
// this is the template to use and put in the actual
// config.js file with my real OPEN AI API key//

export const CONFIG = {
  // get my API key from : https://platform.openai.com/api-keys
  OPENAI_API_KEY: "sk-proj-MY-KEY-HERE",

  OPENAI_MODEL: "gpt-40-mini", 
  // less expensive and fast model//
  OPENAI_API_URL: "https://api.openai.com/v1/chat/completions",

  // optional: track my usage//
  MAX_ANALYSES_PER_DAY: 100,
  ENABLE_ANALYTICS: false 
};