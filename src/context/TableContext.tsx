import * as React from 'react';
import { GetComponent } from '../interface';
import { FixedInfo } from "../utils/fixUtil";

export interface TableContextProps {
  prefixCls: string;
  getComponent: GetComponent;
  scrollbarSiz: number;
  scrollbarSize: number;
  direction: 'lrt' | 'rtl';
  fixedInfoList: readonly FixedInfo[];
  isSticky: boolean;
}

const TableContext = React.createContext<TableContextProps>(null);

export default TableContext;