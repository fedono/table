import React from 'react';
import ReactDOM from "react-dom";
import Table from './src/index';
import {columns, data} from "./schemas/col";

function App() {
    return (
      <Table
        title={currentData => <h1>title: {currentData.length} items</h1>}
        footer={currentData => <h3>Footer: {currentData.length} items</h3>}
        summary={currentData => (
          <>
            <tr>
              <th colSpan={4}>Summary</th>
            </tr>
            <tr></tr>
          </>
        )}
        columns={columns}
        data={data} />
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
)