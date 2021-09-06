import * as React from 'react';
import useFlattenRecords from "../hooks/useFlattenRecords";
import TableContext from "../context/TableContext";
import {getColumnsKey} from "../utils/valueUtil";
import BodyContext from "../context/BodyContext";
import BodyRow from './BodyRow';

export interface BodyProps<RecordType> {
  data: readonly RecordType[];
}

function Body<RecordType>({
  data,
  getRowKey,
  measureColumnWidth,
  expandedKeys,
  onRow,
  rowExpandable,
  emptyNode,
  childrenColumnName
}): BodyProps<RecordType> {
  const { prefixCls, getComponent } = React.useContext(TableContext);
  const { flattenColumns } = React.useContext(BodyContext);

  const flattenData: { record: RecordType; indent: number}[] = useFlattenRecords<RecordType>(
      data,
      childrenColumnName,
      expandedKeys,
      getRowKey
    );

    return React.useMemo(() => {
      const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
      const trComponent = getComponent(['body', 'row'], 'tr');
      const tdComponent = getComponent(['body', 'cell'], 'td');

      let rows: React.ReactNode;
      if (data.length) {
        rows = flattenData.map((item, index) => {
          const { record, indent } = item;
          const key = getRowKey(record, index);

          return (
            <BodyRow
              record={record}
              rowComponent={trComponent}
              cellComponent={tdComponent}
              expandedKeys={expandedKeys}
              onRow={onRow}
              recordKey={key}
              rowKey={key}
              index={index}
              getRowKey={getRowKey}
              rowExpandable={rowExpandable}
              childrenColumnName={childrenColumnName}
              indent={indent}
            />
          )
        })
      }

      const columnsKey = getColumnsKey(flattenColumns);
      return (
        <WrapperComponent>
          {rows}
        </WrapperComponent>
      )
    }, [data, prefixCls, onRow, measureColumnWidth, expandedKeys, getComponent])
};

const MemoBody = React.memo(Body);
MemoBody.displayName = 'Body';

export default MemoBody;