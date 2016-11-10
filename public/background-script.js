/*global chrome*/

(function() {
  "use strict";

  let connections = {};
  chrome.runtime.onConnect.addListener(function(port) {
    let tabId;

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(function(message, sender, sendResponse) {
      console.debug("received message in background-script", message, sender, sendResponse);

      // The original connection event doesn't include the tab ID of the
      // DevTools page, so we need to send it explicitly.
      if (message.name === "init") {
        connections[message.tabId] = port;
        tabId = message.tabId;
        port.onDisconnect.addListener(function() {
          delete connections[tabId];
        });
      }

      console.debug("sending message on to content script", tabId, message, connections);
      chrome.tabs.sendMessage(tabId, message);
    });
  });

  // Receive message from content script and relay to the devTools page for the current tab
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.debug("received message", request, sender, sendResponse);
    if (!sender.tab) {
      return;
    }

    let tab = connections[sender.tab.id];
    if (!tab) {
      return;
    }

    tab.postMessage(request);
    return true;
  });
}());