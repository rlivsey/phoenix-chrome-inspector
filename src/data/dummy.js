const TOPICS = ["foo", "bar", "baz"];

export const CHANNELS = TOPICS.map(topic => ({
  topic, state: Math.random() > 0.75 ? "open" : "closed"
}));


function randomPayload(depth=0, request=false) {
  let payload = {};

  if (request) {
    payload.status = Math.random() > 0.3 ? "ok" : "error";
  }

  const numKeys = Math.floor(Math.random() * 10);
  for (let i=0; i<numKeys; i++) {
    payload[`key${i}`] = depth < 3 && Math.random() < 0.25 ? randomPayload(depth + 1) : Math.random();
  }

  return payload;
}

export const MESSAGES = (function() {
  let time = new Date();
  let total = 100;
  let prevTopic;
  let prevWasReply = false;

  let messages = {};
  TOPICS.forEach(topic => {
    messages[topic] = [];
  });

  for (let i=0; i<total; i++) {
    let ref = total - i;
    let event = "update";
    let topic;

    if (prevWasReply) {
      prevWasReply = false;
      topic = prevTopic;
      event = "request";
    } else {
      topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    }

    if (i % 2 === 0 && Math.random() < 0.5) {
      ref = (total - i) - 1;
      event = "phx_reply";
      prevWasReply = true;
    }

    prevTopic = topic;

    time = new Date(time.getTime() - (Math.random() * 1000));

    messages[topic].push({
      payload: randomPayload(0, event === "phx_reply"),
      event,
      ref,
      time,
      topic
    });
  }

  return messages;
})();