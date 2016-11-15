import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import filesize from 'filesize';
import {Table, Column, Cell} from 'fixed-data-table';

import './styles.css';

export default class MessagesTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tableWidth: 0,
      tableHeight: 0,
      columnWidths: {
        ref:     50,
        event:   200,
        size:    100,
        time:    100,
        payload: 400,
      },
    };

    this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this);
    this._onResize = this._onResize.bind(this);
    this._update = this._update.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize, false);
    this._update();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize)
  }

  _onResize() {
    clearTimeout(this._updateTimer);
    this._updateTimer = setTimeout(this._update, 16);
  }

  _update() {
    const { width, height } = this.tableWrapper.getBoundingClientRect();
    this.setState({
      tableWidth: width,
      tableHeight: height
    });
  }

  _onColumnResizeEndCallback(newColumnWidth, columnKey) {
    this.setState(({columnWidths}) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      }
    }));
  }

  render() {
    const { messages, selected, onSelect } = this.props;
    const { columnWidths, tableWidth, tableHeight } = this.state;

    const rows = sortMessages(messages);

    return (
      <div className="message-table-wrapper" ref={(table) => this.tableWrapper = table}>
        <Table
          rowHeight={39}
          rowsCount={rows.length}
          width={tableWidth}
          height={tableHeight}
          headerHeight={39}
          onColumnResizeEndCallback={this._onColumnResizeEndCallback}
          isColumnResizing={false}
          {...this.props}
        >
          <Column
            columnKey="ref"
            header={<Cell>Ref</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {rows[rowIndex].ref}
              </Cell>
            )}
            fixed={true}
            isResizable={true}
            width={columnWidths.ref}
          />
          <Column
            columnKey="event"
            header={<Cell>Event</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {rows[rowIndex].event}
              </Cell>
            )}
            isResizable={true}
            width={columnWidths.event}
          />
          <Column
            columnKey="time"
            header={<Cell>Time</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {durationFor(rows[rowIndex], messages)}
              </Cell>
            )}
            isResizable={true}
            width={columnWidths.time}
          />
          <Column
            columnKey="size"
            header={<Cell>Size</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {filesize(JSON.stringify(rows[rowIndex].payload).length)}
              </Cell>
            )}
            isResizable={true}
            width={columnWidths.size}
          />
          <Column
            columnKey="payload"
            header={<Cell>Payload</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                <div className="message-row-payload">{JSON.stringify(rows[rowIndex].payload)}</div>
              </Cell>
            )}
            isResizable={true}
            width={columnWidths.payload}
          />
        </Table>
      </div>
    )

    return (
      <table className="messages">
        <thead>
          <tr>
            <th>Ref</th>
            <th>Event</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Size</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          {sortMessages(messages).map(message => {
            const key = `${message.ref}-${message.event}`;
            const time = moment(message.time);

            const original = findOriginalFor(messages, message);
            let duration;
            if (original) {
              const diff = time.diff(moment(original.time));
              duration = `${diff}ms`;
            } else {
              duration = "-";
            }

            const itemClass = classNames({
              "message-row": true,
              selected: message === selected
            });

            const size = JSON.stringify(message.payload).length;

            return (
              <tr key={key} className={itemClass} onClick={(e) => onSelect(message)}>
                <td>{message.ref}</td>
                <td>{message.event}</td>
                <td>{time.format("HH:mm:ss.SSS")}</td>
                <td>{duration}</td>
                <td>{filesize(size)}</td>
                <td>
                  <div className="message-row-payload">
                    {JSON.stringify(message.payload)}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
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
}