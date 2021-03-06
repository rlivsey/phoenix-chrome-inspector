import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import filesize from 'filesize';
import {Table, Column, Cell} from 'fixed-data-table';

import './styles.css';

function MessageCell({messages, selected, rowIndex, data, col, ...props}) {
  const message = messages[rowIndex];
  const payload = message.payload || {};

  const messageClass = classNames({
    selected:       selected === message,
    "status-ok":    payload.status === "ok",
    "status-error": payload.status === "error"
  });

  return (
    <Cell className={messageClass} {...props}>
      {props.children}
    </Cell>
  )
}

export default class MessagesTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tableWidth: 0,
      tableHeight: 0,
      columnWidths: {
        ref:      50,
        event:    100,
        size:     75,
        time:     100,
        duration: 75,
        payload:  400,
      },
    };

    this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this);
    this._onResize = this._onResize.bind(this);
    this._checkDimensions = this._checkDimensions.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize, false);
    this._checkDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize)
  }

  _onResize() {
    clearTimeout(this._checkDimensionsTimer);
    this._checkDimensionsTimer = setTimeout(this._checkDimensions, 16);
  }

  _checkDimensions() {
    const { width, height } = this.tableWrapper.getBoundingClientRect();
    if (this.state.tableWidth !== width || this.state.tableHeight !== height) {
      this.setState({
        tableWidth: width,
        tableHeight: height
      });
    }
  }

  _onColumnResizeEndCallback(newColumnWidth, columnKey) {
    this.setState(({columnWidths}) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      }
    }));
  }

  // TODO - should move the size calculating upwards to the ChannelInfoComponent
  //        as this one shouldn't know/care about it
  componentDidUpdate() {
    this._checkDimensions();
  }

  render() {
    const { messages, selected, onSelect } = this.props;
    const { columnWidths, tableWidth, tableHeight } = this.state;

    const rows = sortMessages(messages);

    return (
      <div className="message-table-wrapper" ref={(table) => this.tableWrapper = table}>
        <Table
          rowHeight={35}
          rowsCount={rows.length}
          width={tableWidth}
          height={tableHeight}
          headerHeight={36}
          onColumnResizeEndCallback={this._onColumnResizeEndCallback}
          onRowClick={(e, index) => onSelect(rows[index])}
          isColumnResizing={false}
          {...this.props}
        >
          <Column
            columnKey="ref"
            header={<Cell>Ref</Cell>}
            cell={({rowIndex, ...props}) => (
              <MessageCell messages={messages} selected={selected} rowIndex={rowIndex} {...props}>
                {rows[rowIndex].ref || '-'}
              </MessageCell>
            )}
            fixed={true}
            isResizable={true}
            width={columnWidths.ref}
          />
          <Column
            columnKey="event"
            header={<Cell>Event</Cell>}
            cell={({rowIndex, ...props}) => (
              <MessageCell messages={messages} selected={selected} rowIndex={rowIndex} {...props}>
                {rows[rowIndex].event}
              </MessageCell>
            )}
            isResizable={true}
            width={columnWidths.event}
          />
          <Column
            columnKey="time"
            header={<Cell>Time</Cell>}
            cell={({rowIndex, ...props}) => (
              <MessageCell messages={messages} selected={selected} rowIndex={rowIndex} {...props}>
                {moment(rows[rowIndex].time).format("HH:mm:ss.SSS")}
              </MessageCell>
            )}
            isResizable={true}
            width={columnWidths.time}
          />
          <Column
            columnKey="duration"
            header={<Cell>Duration</Cell>}
            cell={({rowIndex, ...props}) => (
              <MessageCell messages={messages} selected={selected} rowIndex={rowIndex} {...props}>
                {durationFor(rows[rowIndex], messages)}
              </MessageCell>
            )}
            isResizable={true}
            width={columnWidths.duration}
          />
          <Column
            columnKey="size"
            header={<Cell>Size</Cell>}
            cell={({rowIndex, ...props}) => (
              <MessageCell messages={messages} selected={selected} rowIndex={rowIndex} {...props}>
                {filesize(JSON.stringify(rows[rowIndex].payload).length)}
              </MessageCell>
            )}
            isResizable={true}
            width={columnWidths.size}
          />
          <Column
            columnKey="payload"
            header={<Cell>Payload</Cell>}
            cell={({rowIndex, ...props}) => (
              <MessageCell messages={messages} selected={selected} rowIndex={rowIndex} {...props}>
                <div className="message-row-payload">{JSON.stringify(rows[rowIndex].payload)}</div>
              </MessageCell>
            )}
            flexGrow={1}
            isResizable={true}
            width={columnWidths.payload}
          />
        </Table>
      </div>
    )
  }
}

function findOriginalFor(messages, message) {
  if (message.event !== "phx_reply") {
    return;
  }

  return messages.find(m => m.ref === message.ref && m !== message);
}

// Currently sorts by ref & time, so replies are next to requests
// in future we should allow clicking the table header to re-order etc
function sortMessages(messages) {
  return messages.sort((a, b) => {
    if (a.ref === b.ref) {
      return compare(a.time, b.time);
    } else {
      return compare(a.ref, b.ref);
    }
  });
}

function compare(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

function durationFor(message, messages) {
  const time = moment(message.time);

  const original = findOriginalFor(messages, message);
  let duration;
  if (original) {
    const diff = time.diff(moment(original.time));
    duration = `${diff}ms`;
  } else {
    duration = "-";
  }
  return duration;
}