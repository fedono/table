import * as React from 'react';

export interface BodyProps<RecordType> {
  data: readonly RecordType[];
}

function Body<RecordType>({

}): BodyProps<RecordType> {
  return React.useMemo(() => {

  })
};

const MemoBody = React.memo(Body);
MemoBody.displayName = 'Body';

export default MemoBody;