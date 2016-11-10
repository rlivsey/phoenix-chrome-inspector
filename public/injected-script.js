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

  // TODO - use a message channel instead?
  function sendMessage(name, data) {
    window.postMessage({phoenix: true, name, data}, '*');
  }

  // TODO - instead of polling, can we listen and update on socket messages or something?
  function pollChannels() {
    const channels = socket.channels.map(channel => ({
      topic: channel.topic,
      state: channel.state
    }));

    sendMessage("channel-list", channels);
    setTimeout(pollChannels, 1000);
  }

  function setupSocketListeners() {
    sendMessage("init", {socket: true});

    socket.onMessage(({event, ref, topic, payload }) => {
      sendMessage("message-received", {event, ref, topic, payload: deepClone(payload)});
    });

    // TODO - nicer way of hooking into socket.push?
    var origPush = socket.push;
    socket.push = function(data) {
      const {event, ref, topic, payload} = data;
      sendMessage("message-sent", {event, ref, topic, payload: deepClone(payload)});
      return origPush.call(socket, data);
    }
  }

  function deepClone(obj) {
    if (!obj) { return; }
    return JSON.parse(JSON.stringify(obj));
  }

})();