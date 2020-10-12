import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Popconfirm, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { TableComponents } from 'rc-table/lib/interface';
import './style.less';
import Table, { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { RootState } from 'src/reducers';
import { useSelector } from 'react-redux';
import { EditableCell, EditableCellProps } from './editable-cell';
import { IElement } from 'src/interfaces';
import styles from './style.module.less';
import { compare } from 'src/utils/string';

export type DataType = 'texto' | 'entero' | 'fecha' | 'boolean';
export type InputType = 'text' | 'select' | 'checkbox';

// Column extension
export interface IColumn<RecordType> extends ColumnType<RecordType> {
  forceEditing?: boolean;
  editable?: boolean;
  dataType?: DataType;
  inputType?: InputType;
  required?: boolean;
  length?: number;
  order?: number;
}

export interface EditableTableProps<RecordType> extends TableProps<RecordType> {
  hasKeyColumn?: boolean;
  hasActionColumn?: boolean;
}

const keyColumn = {
  key: 'key',
  dataIndex: 'key',
  title: '#',
  sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
} as IColumn<any>;

const actionColumn = {
  key: 'actions',
  dataIndex: 'actions',
  title: 'Acciones',
  fixed: 'right',
  width: 100,
} as IColumn<any>;

export const EditableTable = <RecordType extends IElement = IElement>(props: EditableTableProps<RecordType>) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(props.dataSource);
  const [editingRow, setEditingRow] = useState<React.Key>();
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);

  useEffect(() => {
    //buildColumns(props.c)
    console.log('aaa');
  });

  const buildColumns = (columns: ColumnsType<RecordType> | undefined) => {
    if (!columns || columns.length === 0) return;

    if (props.hasKeyColumn) addColumn(keyColumn, 'start');
    if (props.hasActionColumn) addColumn(actionColumn, 'end');

    columns = (columns as IColumn<RecordType>[]).map((col) => {
      return {
        ...col,
        align: col.align ?? 'center',
        render: col.render
          ? col.render
          : (value, record, index) => {
              if (col.key === 'key') return props.dataSource!.indexOf(record) + 1;
              else if (col.key === 'actions') return renderActions(record);
              else if (!value) return '-';
              else return value;
            },
        onCell: (record: RecordType) =>
          ({
            dataIndex: col.dataIndex,
            record,
            editing: col.forceEditing || (col.editable && isEditing(record)),
            inputType: col.inputType,
          } as EditableCellProps<RecordType>),
      } as IColumn<RecordType>;
    });

    console.table(columns);

    return columns;

    function addColumn(column: IColumn<RecordType>, addTo: 'start' | 'end') {
      console.log('addColumn: ' + addTo);

      if (addTo === 'start') columns = [column, ...columns!];
      else columns = [...columns!, column];
    }
  };

  const isEditing = (record: IElement) => record.key === editingRow;

  const editRow = (record: IElement) => {
    setEditingRow(record.key);
    form.setFieldsValue({ ...record });
  };

  const cancelRow = () => setEditingRow('');

  const saveRow = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as RecordType;

      const newData = [...data!];
      const index = newData.findIndex((element) => key === element.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingRow('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingRow('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const renderTotal = (total: number) => {
    return `Total: ${total}`;
  };

  const renderActions = (record: RecordType) => {
    const renderButtonEdit = () => {
      return (
        <Button
          disabled={isEditing(record)}
          type="link"
          style={{ padding: 0, width: '50%' }}
          onClick={() => {
            editRow(record);
          }}>
          Editar
        </Button>
      );
    };

    const renderButtonDelete = () => {
      return (
        <Popconfirm
          placement="left"
          disabled={isEditing(record)}
          title="¿Desea eliminar la fila?"
          onConfirm={() => {
            //    handleDeleteRecords([record.id]);
          }}
          okText="Sí"
          cancelText="No">
          <Button disabled={isEditing(record)} className={styles.buttonDelete} type="link" style={{ padding: 0, width: '50%' }}>
            Eliminar
          </Button>
        </Popconfirm>
      );
    };

    const renderButtonSave = () => {
      return (
        <Button
          className={styles.buttonSave}
          type="link"
          style={{ padding: 0, width: '50%' }}
          onClick={() => {
            saveRow(record.key);
          }}>
          Guardar
        </Button>
      );
    };

    const renderButtonCancel = () => {
      return (
        <Button
          className={styles.buttonCancel}
          type="link"
          style={{ padding: 0, width: '50%' }}
          onClick={() => {
            cancelRow();
          }}>
          Cancelar
        </Button>
      );
    };

    const renderDivider = () => {
      return (
        <Button type="link" disabled style={{ cursor: 'default', color: 'gray', margin: 0, padding: 0 }}>
          |
        </Button>
      );
    };

    return isEditing(record) ? (
      <div className={styles.cellActions}>
        {renderButtonSave()} {renderDivider()} {renderButtonCancel()}
      </div>
    ) : (
      <div className={styles.cellActions}>
        {renderButtonEdit()} {renderDivider()} {renderButtonDelete()}
      </div>
    );
  };

  return (
    <div className={`${styles.tableWrapper}`}>
      <Form className={'tableForm'} form={form} component={false}>
        <Table
          {...props}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          pagination={{
            position: ['bottomCenter'],
            //hideOnSinglePage: true,
            showTotal: (total, range) => renderTotal(total),
          }}
          columns={buildColumns(props.columns) as ColumnType<RecordType>[]}
          scroll={{ x: 1500, y: 300 }}
          //columns={buildColumns(props.columns) as ColumnType<RecordType>[]}
        />
      </Form>
    </div>
  );
};
