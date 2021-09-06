import * as React from 'react';
import TableContext from "../context/TableContext";
import Summary from "./Summary";

export const SummaryContext = React.createContext<{

}>({})

export interface FooterProps<RecordType> {
  children?: React.ReactNode;
}

function Footer<RecordType>({children}: FooterProps<RecordType>) {
  const tableContext = React.useContext(TableContext);
  const {prefixCls} = tableContext;

  const summaryContext = React.useMemo(
    () => ({
    }),
    []
  );

  return (
    <SummaryContext.Provider value={summaryContext}>
      <tfoot className={`${prefixCls}-summary`}>{children}</tfoot>
    </SummaryContext.Provider>
  )
}

export default Footer;
export const FooterComponents = Summary;