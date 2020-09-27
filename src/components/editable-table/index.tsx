import { LoadingOutlined } from '@ant-design/icons';
import { Form, Spin } from 'antd';
import React, { useState } from 'react';
import classNames from 'classnames';
import { TableComponents } from 'rc-table/lib/interface';
import './style.less';
import Table, { ColumnType, TableProps } from 'antd/lib/table';
import { RootState } from 'src/reducers';
import { useSelector } from 'react-redux';

// Column extension
export interface IColumn<RecordType> extends ColumnType<RecordType> {
  dataType: 'texto' | 'entero' | 'fecha';
  required: boolean;
  length?: number;
  order?: number;
}

interface EditableTableProps<RecordType> extends TableProps<RecordType> {}

export const EditableTable = <RecordType extends object = any>(props: EditableTableProps<RecordType>) => {
  const boxes = useSelector((state: RootState) => state.boxes);

  const [form] = Form.useForm();

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const components: TableComponents<RecordType> = {
    body: {
      //cell: EditableCell,
    },
  };

  return (
    <div className={' unselectable'}>
      <Form form={form} component={false}>
        <Table
          {...props}
          bordered
          loading={boxes.templates.isRunning}
          pagination={{ position: ['bottomLeft'] }} /*components={components}*/
        />
      </Form>
    </div>
  );
};
