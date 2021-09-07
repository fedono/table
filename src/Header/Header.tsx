import * as React from 'react';
import {CellType, ColumnsType, ColumnType} from "../interface";
import TableContext from "../context/TableContext";
import HeaderRow from './HeaderRow';

function parseHeaderRows<RecordType>(
  rootColumns: ColumnsType<RecordType>
): CellType<RecordType>[][] {
  const rows: CellType<RecordType>[][] = [];

  function fillRowCells(
    columns: ColumnsType<RecordType>,
    colIndex: number,
    rowIndex: number = 0
  ): number[] {
    rows[rowIndex] = rows[rowIndex] || [];

    let currentColIndex = colIndex;
    const colSpans: number[] = columns.filter(Boolean).map(column => {
      const cell: CellType<RecordType> = {
        key: column.key,
        className: column.className || '',
        children: column.title,
        // column,
        colStart: currentColIndex
      };

      let colSpan: number = 1;

      if ('colSpan' in column) {
        ({colSpan} = column)
      }
      if ('rowSpan' in column) {
        cell.rowSpan = column.rowSpan;
      }

      cell.colSpan = colSpan;
      cell.colEnd = cell.colStart + colSpan - 1;
      rows[rowIndex].push(cell);

      currentColIndex += colSpan;

      return colSpan;
    });

    return colSpans;
  }

  fillRowCells(rootColumns, 0);

  const rowCount = rows.length;
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    rows[rowIndex].forEach(cell => {
      if (!('rowSpan' in cell)) {
        cell.rowSpan = rowCount - rowIndex;
      }
    });
  }

  return rows;
}

export interface HeaderProps<RecordType> {
  columns: ColumnsType<RecordType>;
  flattenColumns: readonly ColumnType<RecordType>[]
}

function Header<RecordType>({
  columns,
  flattenColumns
}: HeaderProps<RecordType>): React.ReactElement {
  const {prefixCls, getComponent} = React.useContext(TableContext);
  const rows: CellType<RecordType>[][] = React.useMemo(() => parseHeaderRows(columns), [columns]);

  const WrapperComponent = getComponent(['header', 'wrapper'], 'thead');
  const trComponent = getComponent(['header', 'row'], 'tr');
  const thComponent = getComponent(['header', 'cell'], 'th');

  return (
    <WrapperComponent>
      {rows.map((row, rowIndex) => {
        const rowNode = (
          <HeaderRow
            key={rowIndex}
            flattenColumns={flattenColumns}
            cells={row}
            rowComponent={trComponent}
            cellComponent={thComponent}
            index={rowIndex}
            />
        );
        return rowNode;
      })}
    </WrapperComponent>
  )
};

export default Header;