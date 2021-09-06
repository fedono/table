import React from 'react';

export type Key = React.Key;

export type GetRowKey<RecordType> = (record: RecordType, index?: number) => Key;


export type DefaultRecordType = Record<string, any>;

// 待定吧，也不一定要现在来写，写到了这个功能的时候再来写
export interface LegacyExpandableProps<RecordType> {

}

export interface CellType<RecordType> {
  key?: Key;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;

  colSpan?: number;
  rowSpan?: number;
}

export interface RenderedCell<RecordType> {
  props?: CellType<RecordType>;
  children?: React.ReactNode;
}

interface ColumnShareType<RecordType> {
  title?: React.ReactNode;
  key?: Key;
  className?: string;

}

export interface ColumnType<RecordType> extends ColumnShareType<RecordType> {
  dataIndex?: DataIndex;
  render?: (
    value: any,
    record: RecordType,
    index: number
  ) => React.ReactNode | RenderedCell<RecordType>;
  width?: number | string;
  onCell?: GetComponentProps<RecordType>;
}

export interface ColumnGroupType<RecordType> extends ColumnShareType<RecordType> {
  children: ColumnsType<RecordType>;
}

export type ColumnsType<RecordType = unknown> = readonly (
  | ColumnGroupType<RecordType>
  | ColumnType<RecordType>
)[];

type Component<P> =
  | React.ComponentType<P>
  | React.ForwardRefExoticComponent<P>
  | React.FC<P>
  | keyof React.ReactHTML;

export type CustomizeComponent = Component<any>;

export type GetComponentProps<DataType> = (
  data: DataType,
  index?: number
) => React.HTMLAttributes<HTMLElement>;

export type GetComponent = (
  path: readonly string[],
  defaultComponent?: CustomizeComponent
) => CustomizeComponent;

export type DataIndex = string | number | readonly (string | number)[];

export type CustomizeScrollBody<RecordType> = {
  data: readonly RecordType[]
}

export interface TableComponents<RecordType> {
  table?: CustomizeComponent;
  header?: {

  };
  body?:
    | CustomizeScrollBody<RecordType>
    | {}
}