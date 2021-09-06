import * as React from "react";
import shallowEqual from 'shallowequal';
import {
  LegacyExpandableProps,
  ColumnsType,
  DefaultRecordType,
  GetComponent,
  CustomizeComponent,
  GetRowKey,
  CustomizeScrollBody, GetComponentProps,
  PanelRender
} from "./interface";
import TableContext from "./context/TableContext";
import BodyContext from "./context/BodyContext";
import ResizeContext from "./context/ResizeContext";
import {getPathValue, mergeObject} from "./utils/valueUtil";
import useColumns from "./hooks/useColumns";
import Body from './Body';
import Panel from './Panel';
import Footer from "./Footer";

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
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  data?: readonly RecordType[];
  onRow?:GetComponentProps<RecordType>;
  columns?: ColumnsType<RecordType>;
  // qs 奇怪，一个 table 的 props，为什么要有这个属性
  components?: TableComponents<RecordType>;
  emptyText?: React.ReactNode | (() => React.ReactNode);
  rowKey?: string | GetRowKey<RecordType>;

  // Additional part
  title?: PanelRender<RecordType>;
  footer?: PanelRender<RecordType>;
  summary?: (data: readonly RecordType[]) => React.ReactNode;
}

const EMPTY_DATA = [];

function Table<RecordType extends DefaultRecordType>(props: TableProps<RecordType>) {
  const {
    prefixCls,
    components,
    data,
    onRow,
    rowKey,
    emptyText,

    title,
    footer,
    summary,

  } = props;

  const mergedData = data || EMPTY_DATA;
  const hasData = !!mergedData.length;

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

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: RecordType) => {
      const key = record && record[rowKey];
      return key;
    }
  });

  const emptyNode: React.ReactNode = React.useMemo(() => {
    if (hasData) {
      return null;
    }

    if (typeof emptyText === 'function') {
      return emptyText();
    }

    return emptyText;
  }, [hasData, emptyText]);

  // const mergedChildrenColumnName = childrenColumnName || 'children';
  const mergedChildrenColumnName = 'children';

  const [columns, flattenColumns] = useColumns(
    {
      ...props
    },
    null
  );
  console.log(columns, flattenColumns, '--- flatten columns')

  const columnContext = React.useMemo(
    () => ({
      columns,
      flattenColumns
    }),
    [columns, flattenColumns]
  )

  const bodyTable = (
    <Body
      data={mergedData}
      onRow={onRow}
      getRowKey={getRowKey}
      emptyNode={emptyNode}
      childrenColumnName={mergedChildrenColumnName}
    />
  );

  const TableComponent = getComponent(['table'], 'table');
  const summaryNode = summary?.(mergedData);
  groupTableNode = (
    <div>
      <TableComponent>
        {bodyTable}
        {summaryNode && (
          <Footer>
            {summaryNode}
          </Footer>
        )}
      </TableComponent>
    </div>
  )

  let fullTable = (
    <div>
      <MemoTableContent>
        {title && <Panel className={`${prefixCls}-title`}>{title(mergedData)}</Panel>}
        {groupTableNode}
        {footer && <Panel className={`${prefixCls}-footer`}>{footer(mergedData)}</Panel>}
      </MemoTableContent>
    </div>
  );

  const TableContextValue = React.useMemo(() => ({
    getComponent
  }), [
    getComponent
  ]);
  const BodyContextValue = React.useMemo(() => ({
    ...columnContext
  }), [
    columnContext
  ]);
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

Table.defaultProps = {
  rowKey: 'key',
  prefixCls: 'rc-table',
  emptyText: () => 'No Data'
};

export default Table;