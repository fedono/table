import { Key, GetRowKey } from '../interface';
import * as React from 'react';

function flatRecord<T>(
  record: T,
  indent: number,
  childrenColumnName: string,
  expandedKeys: Set<Key>,
  getRowKey: GetRowKey<T>
) {
  const arr = [];

  arr.push({
    record,
    indent
  });

  const key = getRowKey(record);
  const expanded = expandedKeys?.has(key);

  if (record && Array.isArray(record[childrenColumnName]) && expanded) {
    for (let i = 0; i < record[childrenColumnName].length; i++) {
      const tempArr = flatRecord(
        record[childrenColumnName][i],
        indent + 1,
        childrenColumnName,
        expandedKeys,
        getRowKey
      );

      arr.push(...tempArr);
    }
  }

  return arr;
}

export default function useFlattenRecords<T>(
  data,
  childrenColumnName: string,
  expandedKeys: Set<Key>,
  getRowKey: GetRowKey<T>
) {
  const arr: { record: T; indent: number}[] = React.useMemo(() => {
    if (expandedKeys?.size) {
      const temp: {record: T; indent: number}[] = [];
      for (let i = 0; i < data?.length; i++) {
        const record = data[i];
        temp.push(...flatRecord<T>(record, 0, childrenColumnName, expandedKeys, getRowKey));
      }

      return temp;
    }

    return data?.map(item => {
      return {
        record: item,
        indent: 0
      }
    })
  }, [data, childrenColumnName, expandedKeys, getRowKey]);

  return arr;
}