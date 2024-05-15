import utils from "../shared/utils";

type Message = {
  text: string;
};

type Response = {
  type: "link";
  link: string;
};

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse: (response: Response) => void) => {
  if (!message || !message.text) {
    console.error("Received invalid message", message);
    sendResponse({ type: "link", link: "Invalid request" });
    return true;  
  }

  getAPIKey().then(apiKey => {
    utils
      .createPaste(apiKey, message.text)
      .then(pastebinLink => {
        sendResponse({ type: "link", link: pastebinLink });
      })
      .catch(error => {
        console.error("Error creating Pastebin paste:", error);
        sendResponse({ type: "link", link: "Error creating link" });
      });
  }).catch(error => {
    console.error("Failed to retrieve API key:", error);
    sendResponse({ type: "link", link: "Error retrieving API key" });
  });

  return true; 
});

async function getAPIKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['API_KEY'], function(result) {
        if (result.API_KEY) {
          resolve(result.API_KEY);
        } else {
          reject('API key not found');
        }
      });
    });
  }
  

