const TOPICS = ["foo", "bar", "baz"];

export const CHANNELS = TOPICS.map(topic => ({
  topic, state: Math.random() > 0.75 ? "open" : "closed"
}));


function randomPayload(depth=0) {
  let payload = {};

  const numKeys = Math.floor(Math.random() * 10);
  for (let i=0; i<numKeys; i++) {
    payload[`key${i}`] = depth < 3 && Math.random() < 0.25 ? randomPayload(depth + 1) : Math.random();
  }

  return payload;
}

export const MESSAGES = (function() {
  let time = new Date();
  let total = 100;

  let messages = {};
  TOPICS.forEach(topic => {
    messages[topic] = [];
  });

  for (let i=0; i<total; i++) {
    let ref = total - i;
    time = new Date(time.getTime() - (Math.random() * 1000));
    let topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    messages[topic].push({
      event: "some:event",
      payload: randomPayload(),
      ref,
      time,
      topic
    });
  }

  return messages;
})();