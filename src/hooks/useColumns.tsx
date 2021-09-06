import {ColumnsType, ColumnType} from "../interface";
import * as React from 'react';

/*export function convertChildrenToColumns<RecordType>(
  children: React.ReactNode
): ColumnsType<RecordType> {
  // return toArray(children)
}*/

function flatColumns<RecordType>(columns: ColumnsType<RecordType>): ColumnType<RecordType>[] {
  return columns.reduce((list, column) => {
    return [
      ...list,
      {
        ...column
      }
    ]
  }, [])
}

function useColumns<RecordType>(
  {
    columns
  }: {
    columns?: ColumnsType<RecordType>
  },
  transformColumns: (columns: ColumnsType<RecordType>) => ColumnsType<RecordType>
): [ColumnsType<RecordType>, readonly ColumnType<RecordType>[]] {
  const baseColumns = React.useMemo<ColumnsType<RecordType>>(
    () => columns /*|| convertChildrenToColumns(children)*/,
    [columns/*, children*/]
  );

  const withExpandColumns = React.useMemo<ColumnsType<RecordType>>(() => {
    return baseColumns;
  }, [baseColumns]);

  const mergedColumns = React.useMemo(() => {
    let finalColumns = withExpandColumns;
    if (transformColumns) {
      finalColumns = transformColumns(finalColumns);
    }

    if (!finalColumns.length) {
      finalColumns = [
        {
          render: () => null
        }
      ]
    }

    return finalColumns;
  }, [transformColumns, withExpandColumns]);

  const flattenColumns = React.useMemo(() => {
    return flatColumns(mergedColumns);
  }, [mergedColumns]);

  return [mergedColumns, flattenColumns];
}

export default useColumns;