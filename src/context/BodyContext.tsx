import * as React from 'react';
import {DefaultRecordType} from "../interface";

export interface BodyContextProps<RecordType = DefaultRecordType> {

}

const BodyContext = React.createContext<BodyContextProps>(null);

export default BodyContext;