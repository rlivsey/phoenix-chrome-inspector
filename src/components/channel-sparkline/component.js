import React, { Component } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

export default class ChannelSparkline extends Component {

  componentDidMount() {
    this._timer = setInterval(self.tick.bind(self), 100);
  }

  componentWillUnmount() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  tick() {
    this.setState({
      tick: new Date()
    });
  }

  // currently 1 item per second over the last minute
  // TODO - make configurable
  data() {
    const now = Math.floor(new Date().getTime() / 1000);

    const index = {};
    // TODO - reduce
    (this.props.messages || []).forEach(message => {
      const key = Math.floor(message.time.getTime() / 1000);
      index[key] = index[key] ? index[key] + 1 : 1;
    });

    const items = [];

    for (let i=0; i<60; i++) {
      const ts = now - i;
      items.push(index[ts] || 0);
    }

    return items.reverse();
  }

  render() {
    return (
      <Sparklines data={this.data()} limit={60} width={50} height={20}>
        <SparklinesLine color="blue" />
      </Sparklines>
    );
  }
}
