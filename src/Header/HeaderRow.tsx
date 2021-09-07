import * as React from 'react';
import {CellType, CustomizeComponent, ColumnType} from '../interface'
import TableContext from "../context/TableContext";
import Cell from '../cell';

export interface RowProps<RecordType> {
  key: string | number;
  cells: readonly CellType<RecordType>[];
  flattenColumns: readonly ColumnType<RecordType>[];
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  index: number;
}

function HeaderRow<RecordType>({
  cells,
  flattenColumns,
  rowComponent: RowComponent,
  cellComponent: CellComponent,
  index
}: RowProps<RecordType>) {
  const {prefixCls} = React.useContext(TableContext);

  return (
    <RowComponent>
      {cells.map((cell: CellType<RecordType>, cellIndex) => {
        // const {column} = cell;
        return (
          <Cell
            {...cell}
            component={CellComponent}
            />
        )
      })}
    </RowComponent>
  )
}

export default HeaderRow;