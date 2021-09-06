import React from 'react';
import ReactDOM from "react-dom";
import Table from './src/index';

function App() {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 100,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200,
    },
    {
      title: 'Operations',
      dataIndex: '',
      key: 'operations',
      render: () => <a href="#">Delete</a>,
    },
  ];

  const data = [
    { name: 'Jack', age: 28, address: 'some where', key: '1' },
    { name: 'Rose', age: 36, address: 'some where', key: '2' },
  ];

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