import { ReloadOutlined } from '@ant-design/icons';
import { Button, Form, Popconfirm, Tooltip } from 'antd';
import Table, { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { SorterResult, TableRowSelection } from 'antd/lib/table/interface';
import React, { useEffect, useState } from 'react';
import { ResizeCallbackData } from 'react-resizable';
import { IElement } from 'src/interfaces';
import { EditableCell, EditableCellProps } from './editable-cell';
import { EditableColumn } from './editable-column';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './style.module.less';
import { useKeyPress } from 'src/utils/hooks';
import _ from 'lodash';
import classNames from 'classnames';
import { Wrapper } from '../wrapper';

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
  minWidth?: number;
  maxWidth?: number;
}

export interface EditableTableProps<RecordType> extends TableProps<RecordType> {
  wrapperClassName?: string;
  hasKeyColumn?: boolean;
  hasActionColumn?: boolean;
  onDataChange: Function;
  onColumnChange: Function;
  noTitle?: boolean;
  noRowSelection?: boolean;
  noPagination?: boolean;
  extraActions?: (disabled: boolean) => {};
}

export const EditableTable = <RecordType extends IElement = any>(props: EditableTableProps<RecordType>) => {
  const keyColumn = {
    key: 'key',
    dataIndex: 'key',
    title: '#',
    minWidth: 60,
    width: 60,
    // sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
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

  const [form] = Form.useForm();
  const [data, setData] = useState<RecordType[]>(props.dataSource ?? []);

  const mergedColumns = buildColumns(props.columns);

  const [columnsS, setColumns] = useState(mergedColumns);
  /*const [columnsS, setColumns] = useState(() => {
    return buildColumns(props.columns);
  });*/

  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | undefined>((props.pagination && props.pagination.pageSize) || 10);
  const [refresh, setRefresh] = useState(false);
  const [editingRow, setEditingRow] = useState<React.Key>();
  const [sort, setSort] = useState<SorterResult<RecordType>[]>([]);

  useEffect(() => {
    const r = setTimeout(() => setRefresh(false), 1000);
    return () => {
      clearTimeout(r);
    };
  }, [refresh]);

  function buildColumns(columns: ColumnsType<RecordType> | undefined) {
    console.log('building...');
    if (!columns || columns.length === 0) return;

    if (props.hasKeyColumn && columns && !columns.some((c) => c.key === 'key')) addColumn(keyColumn, 'start');
    if (props.hasActionColumn && columns && !columns.some((c) => c.key === 'actions')) addColumn(actionColumn, 'end');

    let isInputFocused = false;

    columns = (columns as IColumn<RecordType>[]).map((col, index) => {
      return {
        ...col,
        // align: 'center',
        title: index,
        onHeaderCell: (column: IColumn<RecordType>) => ({
          //width: col.width,
          width: column.width,
          style: { fontWeight: 'bold' },
          // style: { minWidth: col.minWidth, maxWidth: col.maxWidth },
          // onResize: handleColumnResize(index),
        }),
        render: col.render
          ? col.render
          : (value, record, index) => {
              if (col.key === 'key') return data!.indexOf(record) + 1;
              else if (col.key === 'actions') return renderActions(record);
              else if (!value) return '-';
              else return value;
            },
        onCell: (record: RecordType) => {
          const shouldFocusInput = !isInputFocused && col.editable && isEditing(record);
          if (shouldFocusInput) isInputFocused = true;

          return {
            dataIndex: col.dataIndex,
            record,
            editing: col.forceEditing || (col.editable && isEditing(record)),
            inputType: col.inputType,
            shouldFocus: shouldFocusInput,
            //className:
            // style: { padding: col.align || 'center' ? '0px 18px' : undefined },
          } as EditableCellProps<RecordType>;
        },
      } as IColumn<RecordType>;
    });

    //console.table(columns);

    return columns;

    function addColumn(column: IColumn<RecordType>, addTo: 'start' | 'end') {
      //console.log('addColumn: ' + addTo);

      if (addTo === 'start') columns = [column, ...columns!];
      else columns = [...columns!, column];
    }
  }

  /* const mergedColumns = (columnsS as IColumn<RecordType>[]).map((col, index) => {
    //console.log('mergedColumns...');
    return {
      ...col,
      // align: col.align ?? 'left',
      /*  onHeaderCell: (column: IColumn<RecordType>) => ({
        //width: col.width,
        width: column.width,
        style: { minWidth: col.minWidth, maxWidth: col.maxWidth },
        onResize: handleColumnResize(index),
      }),
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
  });*/

  const handleColumnResize = (index: number) => (e: React.SyntheticEvent<Element, Event>, data: ResizeCallbackData) => {
    //const width = data.size.width < 50 ? 50 : data.size.width > 200 ? 200 : data.size.width;
    const width = data.size.width;
    const _columns = [...columnsS!];
    _columns[index] = { ..._columns[index], width };

    setColumns(_columns);
    /*setColumns(() => {
      const width = data.size.width;
      const _columns = [...columnsS!];
      _columns[index] = { ..._columns[index], width };

      return _columns;
    });*/
  };

  /* const getRows = async (type: RecordTypeName, id?: RecordType['id']) => {
    await dispatch(getRecords(type, id));
  };*/

  const isNewRow = (record: RecordType) => {
    // return record.id === editingRow && editingRow?.isNew;
  };

  const isEditing = (record: RecordType) => {
    return record.key === editingRow;
  };

  const createRow = () => {
    form
      .validateFields()
      .then(async () => {
        if (data.length === 0) return;

        const sort: SorterResult<RecordType> = { columnKey: 'key', order: 'descend' };
        setSort([sort]);

        form.resetFields();
        setCurrentPage(1);

        const key = data.length;
        //const key = data.length > 0 ? _.maxBy(data, 'key')?.id! + 1 : 1;
        const newData: RecordType = { key } as RecordType;
        // const newData: RecordType = { key };

        // await dispatch(createRecord(type!, addedRecord));
        setData([...data, newData]);
        setSelectedRows([key]);
        // setEditingRow({ key, isNew: true });
        setEditingRow(key);
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const cleanRow = async () => {
    // await dispatch(cleanRecord(type!));
    setEditingRow('');
  };

  const handleAddRow = () => {
    createRow();
  };

  const handleEditRow = (record: IElement) => {
    setEditingRow(record.key);
    form.setFieldsValue({ ...record });
  };

  const handleCancelRow = () => setEditingRow('');

  const handleSaveRow = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as RecordType;

      const newData = [...data!];
      //const newData = [...data!];
      const index = newData.findIndex((element) => key === element.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        props.onDataChange(newData);
        //   setData(newData);
        setEditingRow('');
      } else {
        newData.push(row);
        props.onDataChange(newData);
        // setData(newData);
        setEditingRow('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDeleteRows = (keys: React.Key[]) => {
    if (data.length === 0) return;
    const newData = _.reject(data, (e) => _.includes(keys, e.key));
    setData(newData);
    setEditingRow('');
    setSelectedRows([]);
  };

  const rowSelection: TableRowSelection<RecordType> = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys);
      const keys: React.Key[] = selectedRows.map((r) => r.key);
      console.log(keys);
      setSelectedRows(keys);
    },
    getCheckboxProps: (record: RecordType) => ({
      //* name: record.name,
      //name: record.id + '',
    }),
  };

  const renderHeader = () => {
    const disableRemove = selectedRows.length === 0;

    return (
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderLeft}>
          {!editingRow ? (
            <Button type="primary" onClick={() => handleAddRow()}>
              Agregar
            </Button>
          ) : (
            <Button type="ghost" onClick={() => handleCancelRow()}>
              Cancelar
            </Button>
          )}
          <Popconfirm
            title="¿Desea eliminar las filas seleccionadas?"
            onConfirm={() => {
              handleDeleteRows(selectedRows);
              //handleDeleteRecords(props.state.list.filter(e => e.selected).map(e => e.id));
            }}
            okText="Sí"
            cancelText="No"
            disabled={disableRemove}>
            <Button type="primary" danger disabled={disableRemove}>
              Eliminar
            </Button>
          </Popconfirm>
          <Tooltip title="Actualizar">
            <Button
              disabled={refresh || editingRow !== null}
              type="link"
              icon={<ReloadOutlined spin={refresh} />}
              onClick={() => {
                setRefresh(true);
                //type && getRows(type);
                //setTimeout(() => setRefresh(false), 1000);
              }}></Button>
          </Tooltip>
          {props.extraActions && props.extraActions(!!editingRow)}
        </div>
        <div className={styles.tableHeaderRight}>
          <span className={styles.tableHeaderInfo}>{`Registros: ${data.length}`}</span>
        </div>
      </div>
    );
  };

  const renderActions = (record: RecordType) => {
    const renderButtonEdit = () => {
      return (
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.buttonEdit}
            disabled={isEditing(record)}
            type="link"
            onClick={() => {
              handleEditRow(record);
            }}>
            Editar
          </Button>
        </div>
      );
    };

    const renderButtonDelete = () => {
      return (
        <div className={styles.buttonWrapper}>
          <Popconfirm
            placement="left"
            disabled={isEditing(record)}
            title="¿Desea eliminar la fila?"
            onConfirm={() => {
              handleDeleteRows([record.key]);
            }}
            okText="Sí"
            cancelText="No">
            <Button className={styles.buttonDelete} disabled={isEditing(record)} type="link">
              Eliminar
            </Button>
          </Popconfirm>
        </div>
      );
    };

    const renderButtonSave = () => {
      return (
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.buttonSave}
            type="link"
            onClick={() => {
              handleSaveRow(record.key);
            }}>
            Guardar
          </Button>
        </div>
      );
    };

    const renderButtonCancel = () => {
      return (
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.buttonCancel}
            type="link"
            onClick={() => {
              handleCancelRow();
            }}>
            Cancelar
          </Button>
        </div>
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
    <Wrapper className={styles.tableWrapper} unselectable direction="column" horizontal="center">
      {props.noTitle ? undefined : renderHeader()}
      <Form form={form} component={false}>
        <Table
          {...props}
          components={{
            header: {
              cell: EditableColumn,
            },
            body: {
              cell: EditableCell,
            },
          }}
          //title={props.noTitle ? undefined : () => renderHeader()}
          pagination={
            props.noPagination
              ? false
              : {
                  position: ['topCenter', 'bottomCenter'],
                  current: currentPage,
                  pageSize,
                  pageSizeOptions: ['10', '20', '30', '50'],
                  showSizeChanger: true,
                  onChange: (page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                    setEditingRow('');
                  },
                }
          }
          //  columns={columnsS}
          // dataSource={data}
          //columns={columnsS}
          //columns={buildColumns(columnsS) as ColumnType<RecordType>[]}
          dataSource={data}
          columns={mergedColumns}
          rowSelection={props.noRowSelection ? undefined : rowSelection}
        />
      </Form>
    </Wrapper>
  );
};
