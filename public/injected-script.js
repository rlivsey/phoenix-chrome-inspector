(function() {
  // runs in the context of the page & looks for phoenix
  // currently expects it to be available at window._phoenixSocket
  // but need a more robust way of finding it

  var socket;
  detectSocket();

  function detectSocket() {
    if (window._phoenixSocket) {
      socket = window._phoenixSocket;
      setupSocketListeners();
      pollChannels();
    } else {
      // TODO - give up after x tries
      setTimeout(detectSocket, 1000);
    }
  }

  function pollChannels() {
    const channels = socket.channels.map(channel => ({
      topic: channel.topic,
      state: channel.state
    }));

    window.postMessage({phoenix: true, data: {channels}}, '*');

    setTimeout(pollChannels, 1000);
  }

  function setupSocketListeners() {
    window.postMessage({phoenix: true, data: {socket: true}}, '*');

    socket.onOpen((...args) => {
      console.log("socket open", ...args);
    });

    socket.onClose((...args) => {
      console.log("socket closed", ...args);
    });

    socket.onError((...args) => {
      console.log("socket error", ...args);
    });

    socket.onMessage((...args) => {
      console.log("socket message", ...args);
    });
  }

})();