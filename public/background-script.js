/*global chrome*/

(function() {
  "use strict";

  var connections = {};
  chrome.runtime.onConnect.addListener(function(port) {
    var tabId;

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(function(message, sender, sendResponse) {
      console.log("received message in background-script", message, sender, sendResponse);

      // The original connection event doesn't include the tab ID of the
      // DevTools page, so we need to send it explicitly.
      if (message.name === "init") {
        connections[message.tabId] = port;
        tabId = message.tabId;
        port.onDisconnect.addListener(function() {
          delete connections[tabId];
        });
      }

      console.log("sending message on to content script", tabId, message, connections);
      chrome.tabs.sendMessage(tabId, message);
    });
  });

  // Receive message from content script and relay to the devTools page for the
  // current tab
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("received message", request, sender, sendResponse);
    // Messages from content scripts should have sender.tab set
    if (sender.tab) {
      var tabId = sender.tab.id;
      if (tabId in connections) {
        connections[tabId].postMessage(request);
      } else {
        console.log("Tab not found in connection list.");
      }
    } else {
      console.log("sender.tab not defined.");
    }
    return true;
  });
}());