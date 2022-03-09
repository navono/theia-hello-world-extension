import '../../style/project-explorer.css';
import * as React from 'react';
import { List, AutoSizer, ListRowRenderer } from 'react-virtualized';

interface AutoSizeListProps {
  key?: number;
  totalHeight: number;
  rowCount: number;
  rowHeight: number;
  rowRenderer: ListRowRenderer;
}

export const AutoSizeList = (props: AutoSizeListProps): JSX.Element => {
  const { totalHeight, rowCount, rowHeight, rowRenderer } = props;

  return (
    <div className="explorer-opened-project">
      <div className="explorer-opened-project-content">
        <AutoSizer>
          {({ width }) => (
            <List
              height={totalHeight}
              width={width}
              rowCount={rowCount}
              rowHeight={rowHeight}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
