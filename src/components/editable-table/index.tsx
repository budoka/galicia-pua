import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import classNames from 'classnames';
import './style.less';
import Table, { ColumnType, TableProps } from 'antd/lib/table';

// Column extension
export interface IColumn<RecordType> extends ColumnType<RecordType> {
  ttt?: 'asd' | 'aaa';
}

interface EditableTableProps<RecordType> extends TableProps<RecordType> {}

export const EditableTable = <RecordType extends object = any>(props: EditableTableProps<RecordType>) => {
  return (
    <div className={' unselectable'}>
      <Table {...props} />
    </div>
  );
};
