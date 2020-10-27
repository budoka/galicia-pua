import { Button, Form, Popconfirm } from 'antd';
import { Rule } from 'antd/lib/form';
import TableAnt, { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { SorterResult } from 'antd/lib/table/interface';
import _ from 'lodash';
import React, { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { ResizeCallbackData } from 'react-resizable';
import { IElement } from 'src/interfaces';
import { compare } from 'src/utils/string';
import { Wrapper } from '../wrapper';
import { Cell, ICellProps } from './cell';
import { Column } from './column';
import styles from './style.module.less';

export type DataType = 'texto' | 'entero' | 'fecha' | 'boolean';
export type InputType = 'text' | 'select' | 'checkbox';
export type State = 'idle' | 'adding' | 'editing' | 'deleting';
export type Position = 'header' | 'footer' | 'both';

// Column properties
export interface IColumn<RecordType> extends ColumnType<RecordType> {
  editable?: boolean;
  forceEditing?: boolean;
  dataType?: DataType;
  inputType?: InputType;
  rules?: Rule[];
  // required?: boolean;
  // order?: number;
  style?: CSSProperties;
}

// Table properties
export interface ITableProps<RecordType> extends TableProps<RecordType> {
  sortable?: boolean;
  noRowSelection?: boolean;
  noPagination?: boolean;
  extraColumns?: { key?: boolean; actions?: boolean };
  extraActions?: { actions: ReactNode; position: Position }[];
  setData?: React.Dispatch<React.SetStateAction<RecordType[]>>;
}

const keyColumn = {
  key: 'key',
  dataIndex: 'key',
  title: '#',
  minWidth: 60,
  width: 60,
  // sorter: props.sortable && { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
} as IColumn<any>;

const actionColumn = {
  key: 'actions',
  dataIndex: 'actions',
  title: 'Acciones',
  fixed: 'right',
  width: 210,
  //minWidth: 210,
  //maxWidth: 210,
} as IColumn<any>;

export const Table = <RecordType extends IElement = any>(props: ITableProps<RecordType>) => {
  const [form] = Form.useForm();

  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | undefined>((props.pagination && props.pagination.pageSize) || 10);
  const [refresh, setRefresh] = useState(false);
  const [editingRow, setEditingRow] = useState<{ previous?: React.Key; current?: React.Key }>();
  const [state, setState] = useState<{ previous?: State; current?: State }>({ current: 'idle' });
  const [sort, setSort] = useState<SorterResult<RecordType>[]>([]);

  const { dataSource: _dataSource, columns: _columns, setData, extraColumns: moreColumns, sortable, ...restProps } = props;

  const dataSource = _dataSource ?? [];
  const columns = buildColumns(_columns);

  function buildColumns(columns: ColumnsType<RecordType> | undefined) {
    console.log('buildColumns ...');

    if (!columns || columns.length === 0) return;

    // Create a dictionary to check if key and actions columns already exist.
    const columnsDict = _.keyBy(columns, 'key');

    if (props.extraColumns?.key && columns && !columnsDict['key']) columns = [keyColumn, ...columns];
    if (props.extraColumns?.actions && columns && !columnsDict['actions']) columns = [...columns, actionColumn];

    let isInputFocused = false;

    columns = (columns as IColumn<RecordType>[]).map((col, index) => {
      return {
        ...col,
        align: 'center',
        shouldCellUpdate: (record, prevRecord) => {
          // Update cell when a record was deleted.
          if (state.previous === 'deleting') return true;

          const isEditing = record.key === editingRow?.current || record.key === editingRow?.previous;

          const isActionColumn = col.dataIndex === 'actions';
          const shouldUpdateAction =
            isActionColumn &&
            (state.current === 'adding' || state.current === 'editing' || state.previous === 'adding' || state.previous === 'editing');

          if (shouldUpdateAction) return true;

          const columnName = col.dataIndex! as string;
          const prevValue = prevRecord[columnName];
          const nextValue = record[columnName];

          const shouldUpdate = prevValue !== nextValue || isEditing;

          return shouldUpdate;
        },
        onHeaderCell: (column: IColumn<RecordType>) => {
          return {
            //width: col.width,
            width: column.width,
            style: { fontWeight: 'bold' },
            // style: { minWidth: col.minWidth, maxWidth: col.maxWidth },
          };
        },
        onCell: (record: RecordType) => {
          const shouldFocusInput = !isInputFocused && col.editable && isEditing(record);
          if (shouldFocusInput) isInputFocused = true;

          return {
            key: col.dataIndex,
            dataIndex: col.dataIndex,
            editing: col.forceEditing || (col.editable && isEditing(record)),
            inputType: col.inputType,
            hasFocus: shouldFocusInput,
            rules: col.rules,
            hasFeedback: true,
          } as ICellProps;
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

  useEffect(() => {
    if (state.current === 'idle') form.resetFields();
  }, [state]);

  const isEditing = (record: RecordType) => {
    return record.key === editingRow?.current;
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
        // setEditingRow(key);
        setState({ previous: state.current, current: 'adding' });
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

      // console.log(records);

      setData(records);
      /*  setData((r) => {
        const records = [...r];
        records[index] = { ...records[index], ...record };
        return records;
      }); */

      setEditingRow({ previous: editingRow?.current, current: undefined });
      //setEditingRow('');
      setState({ previous: state.current, current: 'idle' });
    } catch (err) {
      console.log('Validate Failed:', err);
    }
  };

  const handleEditRecord = (record: RecordType) => {
    setEditingRow({ previous: editingRow?.current, current: record.key });
    //setEditingRow(record.key);
    setState({ previous: state.current, current: 'editing' });
    setSelectedRows([record.key]);
    form.setFieldsValue({ ...record });
  };

  const handleDeleteRecord = (keys: React.Key[]) => {
    if (dataSource.length === 0 || !setData) return;
    const records = _.reject(dataSource, (e) => _.includes(keys, e.key));

    setData(records);
    setEditingRow({ previous: editingRow?.current, current: undefined });
    //setEditingRow('');
    setState({ previous: 'deleting', current: 'idle' });
    //setState({ previous: state.current, current: 'idle' });
    setSelectedRows([]);
  };

  const handleCancelRecord = () => {
    if (dataSource.length === 0 || !setData) return;
    if (state.current === 'adding') {
      const records = dataSource.slice(0, dataSource.length - 1);
      setData(records);
    }
    setEditingRow({ previous: editingRow?.current, current: undefined });
    // setEditingRow('');
    setState({ previous: state.current, current: 'idle' });
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
            disabled={state.current !== 'idle'}
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
            disabled={state.current !== 'idle'}
            title="¿Desea eliminar la fila?"
            onConfirm={() => {
              handleDeleteRecord([record.key]);
            }}
            okText="Sí"
            cancelText="No">
            <Button className={styles.buttonDelete} disabled={state.current !== 'idle'} type="link">
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
      {/* {console.log(restProps)} */}
      <Form form={form} component={false}>
        <TableAnt
          {...restProps}
          components={{
            header: {
              cell: Column,
            },
            body: {
              cell: /*props.noEditableCell ? undefined : */ Cell,
            },
          }}
          columns={columns}
          dataSource={dataSource}
        />
      </Form>
    </Wrapper>
  );
};
