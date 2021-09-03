import * as React from "react";
import shallowEqual from 'shallowequal';
import {
  LegacyExpandableProps,
  ColumnsType,
  DefaultRecordType,
  GetComponent,
  CustomizeComponent,
  CustomizeScrollBody
} from "./interface";
import TableContext from "./context/TableContext";
import BodyContext from "./context/BodyContext";
import ResizeContext from "./context/ResizeContext";
import {getPathValue, mergeObject} from "./utils/valueUtil";
import Body from './Body';

interface MemoTableContentProps {
  children: React.ReactNode;
  props: any;
}

const MemoTableContent = React.memo<MemoTableContentProps>(
  ({children}) => children as React.ReactElement,
  (prev, next) => {
    if (!shallowEqual(prev.props, next.props)) {
      return false;
    }

    return prev.pingLeft !== next.pingLeft || prev.pingRight !== next.pingRight;
  }
)

export interface TableComponents<RecordType> {
  table?: CustomizeComponent;
  header?: {};
  body?:
    | CustomizeScrollBody<RecordType>
}

export interface TableProps<RecordType = unknown> extends LegacyExpandableProps<RecordType> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  columns?: ColumnsType<RecordType>;
  // qs 奇怪，一个 table 的 props，为什么要有这个属性
  components?: TableComponents<RecordType>
}

function Table<RecordType extends DefaultRecordType>(props: TableProps<RecordType>) {
  const {
    components
  } = props;

  let groupTableNode: React.ReactNode;
  const mergedComponents = React.useMemo(
    () => mergeObject<TableComponents<RecordType>>(components, {}),
    [components]
  )
  const getComponent = React.useCallback<GetComponent>(
    (path, defaultComponent) =>
      getPathValue<CustomizeComponent, TableComponents<RecordType>>(mergedComponents, path) ||
      defaultComponent,
    [mergedComponents]
  );

  const bodyTable = (
    <Body/>
  );

  const TableComponent = getComponent(['table'], 'table');
  groupTableNode = (
    <div>
      <TableComponent>
        {bodyTable}
      </TableComponent>
    </div>
  )

  let fullTable = (
    <div>
      <MemoTableContent>
        {groupTableNode}
      </MemoTableContent>
    </div>
  );

  const TableContextValue = React.useMemo(() => ({}));
  const BodyContextValue = React.useMemo(() => ({}));
  const ResizeContextValue = React.useMemo(() => ({}));
  return (
    <TableContext.Provider value={TableContextValue}>
      <BodyContext.Provider value={BodyContextValue}>
        <ResizeContext.Provider value={ResizeContextValue}>
          {fullTable}
        </ResizeContext.Provider>
      </BodyContext.Provider>
    </TableContext.Provider>
  )
}