import * as React from 'react';
import classNames from 'classnames';
import {getPathValue, validateValue} from "../utils/valueUtil";
import {supportRef} from "../utils/ref";
import {CellType, ColumnType, CustomizeComponent, DataIndex, DefaultRecordType, RenderedCell} from "../interface";

function isRenderCell<RecordType>(
  data: React.ReactNode | RenderedCell<RecordType>
): data is RenderedCell<RecordType> {
  return data && typeof data === 'object' && !Array.isArray(data) && !React.isValidElement(data);
}

function isRefComponent(component: CustomizeComponent) {
  if (typeof component === 'string') {
    return true;
  }
  return supportRef(component);
}

export interface CellProps<RecordType extends DefaultRecordType> {
  className?: string;
  record?: RecordType;
  index?: number;
  dataIndex?: DataIndex;
  render?: ColumnType<RecordType>['render'];
  component?: CustomizeComponent;
  children?: React.ReactNode;
  additionalProps?: React.HTMLAttributes<HTMLElement>;

  shouldCellUpdate?: (record: RecordType, prevRecord: RecordType) => boolean;

  colSpan?: number;
  rowSpan?: number;
}

function Cell<RecordType extends DefaultRecordType>(
  {
    className,
    record,
    index,
    dataIndex,
    render,
    children,
    component: Component = 'td',
    additionalProps = {},
    colSpan,
    rowSpan
  }: CellProps<RecordType>,
  ref: React.Ref<any>
): React.ReactElement {

  let cellProps: CellType<RecordType>;
  let childNode: React.ReactNode;

  if (validateValue(children)) {
    childNode = children;
  } else {
    const value = getPathValue<object | React.ReactNode, RecordType>(record, dataIndex);

    childNode = value;
    if (render) {
      const renderData = render(value, record, index);

      if (isRenderCell(renderData)) {
        childNode = renderData.children;
        cellProps = renderData.props;
      } else {
        childNode = renderData;
      }
    }
  }

  if (
    typeof childNode === 'object' &&
    !Array.isArray(childNode) &&
    !React.isValidElement(childNode)
  ) {
    childNode = null;
  }

  const {
    colSpan: cellColSpan,
    rowSpan: cellRowSpan,
    style: cellStyle,
    className: cellClassName,
    ...restCellProps
  } = cellProps || {};
  const mergedColSpan = cellColSpan !== undefined ? cellColSpan : colSpan;
  const mergedRowSpan = cellRowSpan !== undefined ? cellRowSpan : rowSpan;
  const componentProps = {
   title: '',
   ...additionalProps,
   colSpan: mergedColSpan && mergedColSpan !== 1? mergedColSpan : null,
   rowSpan: mergedRowSpan && mergedRowSpan !== 1 ? mergedRowSpan : null,
   style: { ...additionalProps.style, ...cellStyle},
    ref: isRefComponent(Component) ? ref : null
  }

  return (
    <Component {...componentProps}>
      {childNode}
    </Component>
  )
}

const RefCell = React.forwardRef<any, CellProps<any>>(Cell);
RefCell.displayName = 'Cell';

const MemoCell = React.memo(RefCell, (prev: CellProps<any>, next: CellProps<any>) => {
  if (next.shouldCellUpdate) {
    return (
      !next.shouldCellUpdate(next.record, prev.record)
    )
  }

  return false;
});

export default MemoCell;