import { Button, Form, Popconfirm } from 'antd';
import Table, { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { SorterResult } from 'antd/lib/table/interface';
import _ from 'lodash';
import React, { ReactNode, useEffect, useState } from 'react';
import { IElement } from 'src/interfaces';
import { compare } from 'src/utils/string';
import { Wrapper } from '../wrapper';
import { EditableCell, EditableCellProps, MemoizedEditableCell } from './editable-cell';
import { EditableColumn } from './editable-column';
import styles from './style.module.less';

export type DataType = 'texto' | 'entero' | 'fecha' | 'boolean';
export type InputType = 'text' | 'select' | 'checkbox';
export type CurrentAction = 'idle' | 'adding' | 'editing';

// Column properties
export interface IColumn<RecordType> extends ColumnType<RecordType> {
  forceEditing?: boolean;
  editable?: boolean;
  dataType?: DataType;
  inputType?: InputType;
  required?: boolean;
  length?: number;
  order?: number;
  minWidth?: number;
  maxWidth?: number;
}

// Table properties
export interface EditableTableProps<RecordType> extends TableProps<RecordType> {
  moreColumns?: { key?: boolean; actions?: boolean };
  moreActions?: ReactNode; // [{actions: ReactNode, position: ['header' | 'footer']}]
  setData?: React.Dispatch<React.SetStateAction<RecordType[]>>;

  sortable: boolean;
  noTitle?: boolean;
  noEditableCell?: boolean;
  noRowSelection?: boolean;
  noPagination?: boolean;
}

export const EditableTable = <RecordType extends IElement = any>(props: EditableTableProps<RecordType>) => {
  const keyColumn = {
    key: 'key',
    dataIndex: 'key',
    title: '#',
    minWidth: 60,
    width: 60,
    sorter: props.sortable && { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
  } as IColumn<RecordType>;

  const actionColumn = {
    key: 'actions',
    dataIndex: 'actions',
    title: 'Acciones',
    fixed: 'right',
    width: 210,
    //minWidth: 210,
    //maxWidth: 210,
  } as IColumn<RecordType>;

  useEffect(() => console.log('render table'));

  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | undefined>((props.pagination && props.pagination.pageSize) || 10);
  const [refresh, setRefresh] = useState(false);
  const [editingRow, setEditingRow] = useState<React.Key>();
  const [currentAction, setCurrentAction] = useState<CurrentAction>('idle');
  const [sort, setSort] = useState<SorterResult<RecordType>[]>([]);

  const dataSource = props.dataSource ?? [];

  const columns = buildColumns(props.columns);

  const { setData } = props;

  function buildColumns(columns: ColumnsType<RecordType> | undefined) {
    console.log('buildColumns ...');

    if (!columns || columns.length === 0) return;

    // Create a dictionary to check if key and actions columns already exist.
    const columnsDict = _.keyBy(columns, 'key');

    if (props.moreColumns?.key && columns && !columnsDict['key']) columns = [keyColumn, ...columns];
    if (props.moreColumns?.actions && columns && !columnsDict['actions']) columns = [...columns, actionColumn];

    let isInputFocused = false;

    columns = (columns as IColumn<RecordType>[]).map((col, index) => {
      return {
        ...col,
        // key: index + 5,
        align: 'center',
        /*   shouldCellUpdate: (record, prevRecord) => {
          console.log(record);
          console.log(prevRecord);
          return record !== prevRecord;
        },*/
        onHeaderCell: (column: IColumn<RecordType>) => ({
          //width: col.width,
          width: column.width,
          style: { fontWeight: 'bold' },
          // style: { minWidth: col.minWidth, maxWidth: col.maxWidth },
          // onResize: handleColumnResize(index),
        }),
        onCell: (record: RecordType) => {
          const shouldFocusInput = !isInputFocused && col.editable && isEditing(record);
          if (shouldFocusInput) isInputFocused = true;

          return {
            key: index,
            dataIndex: col.dataIndex,
            editing: col.forceEditing || (col.editable && isEditing(record)),
            inputType: col.inputType,
            hasFocus: shouldFocusInput,
            rules: [{ required: true }],
            hasFeedback: true,
            style: undefined,
            //className:
            // style: { padding: col.align || 'center' ? '0px 18px' : undefined },
          } as EditableCellProps;
        },
        render: col.render
          ? col.render
          : (value, record, index) => {
              if (col.key === 'key') return dataSource!.indexOf(record) + 1;
              else if (col.key === 'actions') return renderActions(record);
              else if (!value) return '-';
              else return value;
            },
      } as IColumn<RecordType>;
    });

    return columns;
  }

  const isEditing = (record: RecordType) => {
    return record.key === editingRow;
  };

  const handleAddRecord = () => {
    if (!setData) return;

    // Revisar -- form validate no es necesario??
    form
      .validateFields()
      .then(async () => {
        if (dataSource.length === 0) return;

        const sort: SorterResult<RecordType> = { columnKey: 'key', order: 'descend' };
        setSort([sort]);

        form.resetFields();
        setCurrentPage(Math.ceil((dataSource.length + 1) / pageSize!));

        const key = dataSource.length;
        const record: RecordType = { key } as RecordType;

        setData([...dataSource, record]);
        setSelectedRows([key]);
        setEditingRow(key);
        setCurrentAction('adding');
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const handleSaveRecord = async (key: React.Key) => {
    if (!setData) return;

    try {
      const record = (await form.validateFields()) as RecordType;

      const index = dataSource.findIndex((record) => key === record.key);

      if (index === -1) return;

      const records = [...dataSource];
      records[index] = { ...records[index], ...record };

      setData(records);
      setEditingRow('');
      setCurrentAction('idle');
    } catch (err) {
      console.log('Validate Failed:', err);
    }
  };

  const handleEditRecord = (record: RecordType) => {
    setEditingRow(record.key);
    setCurrentAction('editing');
    setSelectedRows([record.key]);
    form.setFieldsValue({ ...record });
  };

  const handleDeleteRecord = (keys: React.Key[]) => {
    if (dataSource.length === 0 || !setData) return;
    const records = _.reject(dataSource, (e) => _.includes(keys, e.key));
    setData(records);
    setEditingRow('');
    setCurrentAction('idle');
    setSelectedRows([]);
  };

  const handleCancelRecord = () => {
    if (dataSource.length === 0 || !setData) return;
    const records = dataSource.slice(0, dataSource.length - 1);
    setData(records);
    setEditingRow('');
    setCurrentAction('idle');
    setSelectedRows([]);
  };

  const renderActions = (record: RecordType) => {
    return isEditing(record) ? (
      <div className={styles.cellActions}>
        {renderButtonSave()} {renderDivider()} {renderButtonCancel()}
      </div>
    ) : (
      <div className={styles.cellActions}>
        {renderButtonEdit()} {renderDivider()} {renderButtonDelete()}
      </div>
    );

    function renderButtonEdit() {
      return (
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.buttonEdit}
            disabled={currentAction !== 'idle'}
            type="link"
            onClick={() => {
              handleEditRecord(record);
            }}>
            Editar
          </Button>
        </div>
      );
    }

    function renderButtonDelete() {
      return (
        <div className={styles.buttonWrapper}>
          <Popconfirm
            placement="left"
            disabled={currentAction !== 'idle'}
            title="¿Desea eliminar la fila?"
            onConfirm={() => {
              handleDeleteRecord([record.key]);
            }}
            okText="Sí"
            cancelText="No">
            <Button className={styles.buttonDelete} disabled={currentAction !== 'idle'} type="link">
              Eliminar
            </Button>
          </Popconfirm>
        </div>
      );
    }

    function renderButtonSave() {
      return (
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.buttonSave}
            type="link"
            onClick={() => {
              handleSaveRecord(record.key);
            }}>
            Guardar
          </Button>
        </div>
      );
    }

    function renderButtonCancel() {
      return (
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.buttonCancel}
            type="link"
            onClick={() => {
              handleCancelRecord();
            }}>
            Cancelar
          </Button>
        </div>
      );
    }

    function renderDivider() {
      return (
        <Button type="link" disabled style={{ cursor: 'default', color: 'gray', margin: 0, padding: 0 }}>
          |
        </Button>
      );
    }
  };

  return (
    <Wrapper className={styles.tableWrapper} unselectable direction="column" horizontal="center">
      {/*props.noTitle ? undefined : renderHeader()*/}

      <Form form={form} component={false}>
        <Table
          {...props}
          components={{
            header: {
              cell: EditableColumn,
            },
            body: {
              cell: props.noEditableCell ? undefined : MemoizedEditableCell,
            },
          }}
          columns={columns}
          dataSource={dataSource}
          onRow={(record, index) => ({
            record,
            onChange: () => console.log(record),
          })}
        />
      </Form>
    </Wrapper>
  );
};
