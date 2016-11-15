const TOPICS = ["foo", "bar", "baz"];

export const CHANNELS = TOPICS.map(topic => ({
  topic, state: Math.random() > 0.75 ? "open" : "closed"
}));

export const MESSAGES = (function() {
  let time = new Date();
  let total = 100;

  const messages = {};
  TOPICS.forEach(topic => {
    messages[topic] = [];
  });

  for (let i=0; i<total; i++) {
    let ref = total - i;
    time = new Date(time.getTime() - (Math.random() * 1000));
    let topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    messages[topic].push({
      event: "some:event",
      payload: {foo: true, ref},
      ref,
      time,
      topic
    });
  }

  return messages;
})();