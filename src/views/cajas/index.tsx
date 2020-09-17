import { Button, Table } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import styles from './style.module.less';

interface IDataSource {
  key: string;
  name?: string;
  age?: number;
  address?: string;
}

interface IColumn {
  key: string;
  dataIndex: string;
  title: string;
}

const dataSource: IDataSource[] = [
  {
    key: '1',
    name: 'AAA',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'BBBB',
    age: 42,
    address: '10 Downing Street',
  },
];

const dataSource2: IDataSource[] = [
  {
    key: '1',
    name: 'Mike',
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    address: '10 Downing Street',
  },
];

const columns: IColumn[] = [
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Name',
  },
  {
    key: 'age',
    dataIndex: 'age',
    title: 'Age',
  },
  {
    key: 'address',
    dataIndex: 'address',
    title: 'Address',
  },
];

export const Cajas: React.FC = (props) => {
  const [data, setData] = useState(dataSource);

  useEffect(() => {
    //setData(data);
    //console.log(data);
  }, [data]);

  const updateData = () => {
    if (data === dataSource) setData(dataSource2);
    else setData(dataSource);
  };

  const getColumns = (columns: IColumn[]) => {
    const columnsKeys = columns.map((column) => column.key);
    console.log(columns);
    console.log(columnsKeys);

    return columns.filter((column, index) => {
      return Object.keys(data[0]).indexOf(columnsKeys[index]) > -1;
    });
  };

  return (
    <div className={`wrapper unselectable ${styles.content}`}>
      <Button type={'primary'} onClick={updateData}>
        Toggle
      </Button>
      <Table dataSource={data} columns={getColumns(columns)} />
    </div>
  );
};
