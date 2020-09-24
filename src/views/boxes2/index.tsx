import { Button, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getBoxTemplates } from 'src/actions/boxes/box-templates';
import { EditableTable } from 'src/components/editable-table';
import { createCajaPDF, IPDFData } from 'src/helpers/pdf';
import styles from './style.module.less';

interface IDataSet {
  data: IBoxObject[];
}

interface IBoxObject {
  key: string;
  [key: string]: IBoxColumnObject | string;
}

interface IBoxColumnObject {
  id: number;
  value: string;
}

// Estructura Tabla Ant
interface IColumn<RecordType> extends ColumnType<RecordType> {
  key: string;
  dataIndex: string;
  title: string;
}

const set1: IDataSet = {
  data: [
    {
      key: '1',
      col1: {
        id: 1,
        value: 'A1',
      },
      col2: {
        id: 2,
        value: 'A2',
      },
      col3: {
        id: 3,
        value: 'A3',
      },
    },
    {
      key: '2',
      col1: {
        id: 2,
        value: 'B1',
      },
      col2: {
        id: 2,
        value: 'B2',
      },
      col3: {
        id: 3,
        value: 'B3',
      },
    },
  ],
};

const set2: IDataSet = {
  data: [
    {
      key: '1',
      col1: {
        id: 1,
        value: 'A1',
      },
      col2: {
        id: 2,
        value: 'A2',
      },
    },
    {
      key: '2',
      col1: {
        id: 2,
        value: 'B1',
      },
      col2: {
        id: 2,
        value: 'B2',
      },
    },
  ],
};

const columns: IColumn<IBoxObject>[] = [
  {
    key: 'col1',
    dataIndex: '1',
    title: 'Name',
    render: (text, record, index) => {
      console.log(record);

      /* const mappedData = record.map((row) => {
        const props = Object.keys(row);
        console.log(props);
        return props.slice(1).map((prop, index) => (row[`col${index}`] as ICajaColumnaObject).value);
      });*/

      // const value: string = (record[`col${index}`] as ICajaColumnaObject).value;
      // console.log(value);
      // console.log((record[`col${index}`] as ICajaColumnaObject).value);
      return ' (record[`col${index}`] as ICajaColumnaObject).value';
    },
  },
  {
    key: 'col2',
    dataIndex: '2',
    title: 'Age',
  },
  {
    key: 'col3',
    dataIndex: '3',
    title: 'Address',
  },
  {
    key: 'col4',
    dataIndex: '4',
    title: 'Date',
  },
];

export const Boxes: React.FC = (props) => {
  const dispatch = useDispatch();

  const [dataSet, setDataSet] = useState<IDataSet>();

  /* const pdfData: IPDFData = {
    destino: 'Archivo Central OVERFLOWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    sector: 'INGENIERÍA DE PROCESOS',
    centroDeCostos: '1241',
    numeroDeCaja: '1094942',
    descripcion:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lacinia est. Nunc et nulla id dolor malesuada volutpat. Ut sed purus blandit, lobortis purus in, ullamcorper justo. In ante massa, condimentum a ligula sit amet, porta tempus augue. Nunc enim augue, egestas quis bibendum et, scelerisque nec ex. Etiam velit nulla, lacinia ac libero a, efficitur dictum purus. Ut malesuada accumsan leo, sed pellentesque massa tristique interdum.',
    filename: 'Caratula',
  };*/

  // createCajaPDF('code39', pdfData, 500);

  const updateData = () => {
    dispatch(getBoxTemplates);
    if (dataSet === set1) {
      /*const mappedData = set2.data.map((row) => {
        const props = Object.keys(row);
        console.log(props);
        return props.slice(1).map((prop, index) => (row[`col${index}`] as ICajaColumnaObject).value);
      });*/
      setDataSet(set2);
    } else setDataSet(set1);
  };
  const getColumns = (columns: IColumn<IBoxObject>[]) => {
    if (!dataSet || dataSet.data.length === 0) return [];

    const columnsKeys = columns.map((column) => column.key);

    const filteredColumns = columns.filter((column, index) => {
      /*console.log(dataSet.data[0]);
      console.log(Object.keys(dataSet.data[0]));
      console.log(columnsKeys[index]);
      console.log(Object.keys(dataSet.data[0]).indexOf(columnsKeys[index]));*/

      return Object.keys(dataSet.data[0]).indexOf(columnsKeys[index]) > -1;
    });

    console.log(filteredColumns);

    return filteredColumns;
  };

  return (
    <div className={`wrapper unselectable ${styles.content}`}>
      <Button type={'primary'} onClick={updateData}>
        Toggle
      </Button>
      <EditableTable<IBoxObject> dataSource={dataSet && dataSet.data} columns={getColumns(columns)} />
    </div>
  );
};
