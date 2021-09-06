import * as React from 'react';
import {CustomizeComponent, GetComponent, GetRowKey, Key, GetComponentProps, ColumnType } from "../interface";
import TableContext from "../context/TableContext";
import BodyContext from "../context/BodyContext";
import {getColumnsKey} from "../utils/valueUtil";
import Cell from '../cell';

export interface BodyRowProps<RecordType> {
  record: RecordType;
  index: number;
  className?: string;
  style?: React.CSSProperties;
  recordKey: Key;
  expandedKeys: Set<Key>;
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  onRow: GetComponentProps<RecordType>;
  rowExpandable: (record: RecordType) => boolean;
  indent?: number;
  rowKey: React.Key;
  getRowKey: GetRowKey<RecordType>;
  childrenColumnName: string;
}

function BodyRow<RecordType extends { children?: readonly RecordType[] }> (
  props: BodyRowProps<RecordType>
) {
  const {
    className,
    style,
    record,
    index,
    rowKey,
    rowExpandable,
    expandedKeys,
    onRow,
    indent = 0,
    rowComponent: RowComponent,
    cellComponent,
    childrenColumnName
  } = props;
  const {flattenColumns} = React.useContext(BodyContext);

  let additionalProps: React.HTMLAttributes<HTMLElement>;
  if (onRow) {
    additionalProps = onRow(record, index);
  }
  const onClick: React.MouseEventHandler<HTMLElement> = (event, ...args) => {
    if (additionalProps && additionalProps.onClick) {
      additionalProps.onClick(event, ...args);
    }
  }

  const columnsKey = getColumnsKey(flattenColumns);
  const baseRowNode = (
    <RowComponent
      onClick={onClick}
    >
      {flattenColumns.map((column: ColumnType<RecordType>, colIndex) => {
        const {render, dataIndex, className: columnClassName} = column;
        const key = columnsKey[colIndex];
        // const fixedInfo = fixedInfoList[colIndex];

        let additionalCellProps: React.HTMLAttributes<HTMLElement>;
        if (column.onCell) {
          additionalCellProps = column.onCell(record, index);
        }

        return (
          <Cell
            component={cellComponent}
            key={key}
            record={record}
            index={index}
            dataIndex={dataIndex}
            render={render}
            additionalProps={additionalCellProps}
          />
        )
      })}
    </RowComponent>
  )

  return (
    <>
      {baseRowNode}
    </>
  )

}

export default BodyRow;