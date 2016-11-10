(function() {
  "use strict";

  // messages from the browser
  window.addEventListener('message', function(event) {
    if (event.data.phoenix) {
      console.log("-->", event.data);
      chrome.runtime.sendMessage(event.data);
    }
  });

  // messages from the inspector panel
  chrome.runtime.onMessage.addListener(function(message) {
    console.log("GOT MESSAGE FROM INSPECTOR", message);
    if (message.name === "init") {
      injectInPageScript();
    }
  });

  function injectInPageScript() {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = chrome.extension.getURL("injected-script.js");
    if (document.body && document.contentType !== "application/pdf") {
      document.body.appendChild(script);
      script.onload = function() {
        document.body.removeChild(script);
      };
    }
  }

}());