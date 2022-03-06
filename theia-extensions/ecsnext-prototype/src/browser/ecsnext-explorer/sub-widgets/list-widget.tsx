import * as React from '@theia/core/shared/react';
import { List, ListRowProps, AutoSizer } from 'react-virtualized';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { loremIpsum } from 'lorem-ipsum';

import '../../../../src/browser/ecsnext-explorer/sub-widgets/list-widget.css';

const rowCount = 1000;

export class ListWidget extends React.Component<any> {
  list: Array<any> = [];

  constructor(props: any) {
    super(props);

    // this.state = { selectedProjectIndex: -1 };
    this.list = Array(rowCount)
      .fill(true)
      .map((val, idx) => ({
        id: idx,
        name: 'John Doe',
        image: 'http://via.placeholder.com/40',
        text: loremIpsum({
          count: 1,
          units: 'sentences',
          sentenceLowerBound: 4,
          sentenceUpperBound: 8,
        }),
      }));
  }

  render(): React.ReactNode {
    // const listHeight = 600;
    const rowHeight = 50;
    // const rowWidth = 800;

    return (
      <div className="list">
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowHeight={rowHeight}
              rowRenderer={this.renderRow}
              rowCount={this.list.length}
              overscanRowCount={3}
            />
          )}
        </AutoSizer>
      </div>
    );
  }

  protected renderRow = (props: ListRowProps): React.ReactNode => (
    <div key={props.key} style={props.style} className="row">
      <div className="content">
        <div>{this.list[props.index].name}</div>
        <div>{this.list[props.index].text}</div>
      </div>
    </div>
  );
}
