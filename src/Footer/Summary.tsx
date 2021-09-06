import * as React from 'react';

export interface SummaryProps {
  children?: React.ReactNode;
}

function Summary({children}: SummaryProps) {
  return children as React.ReactElement;
}

export default Summary;