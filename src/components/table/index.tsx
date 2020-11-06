import { ReloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Popconfirm, Tag, Tooltip } from 'antd';
import { Rule } from 'antd/lib/form';
import { LabeledValue } from 'antd/lib/select';
import TableAnt, { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { SorterResult, TableCurrentDataSource, TablePaginationConfig, TableRowSelection } from 'antd/lib/table/interface';
import classNames from 'classnames';
import _ from 'lodash';
import React, { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { SHADOW, UNSELECTABLE } from 'src/constants/constants';
import { IElement } from 'src/interfaces';
import { compare } from 'src/utils/string';
import { Wrapper } from '../wrapper';
import { Cell, ICellProps } from './cell';
import { Column } from './column';
import styles from './style.module.less';

export type DataType = 'texto' | 'entero' | 'fecha' | 'boolean';
export type InputType = 'text' | 'date' | 'select' | 'checkbox';
export type State = 'idle' | 'adding' | 'editing' | 'deleting';
export type ActionNode = 'add-button' | 'delete-button' | 'refresh-button' | 'records-count';
export type Position = 'top' | 'bottom' | 'both';

// Column properties
export interface IColumn<RecordType> extends ColumnType<RecordType> {
  editable?: boolean;
  forceEditing?: boolean;
  dataType?: DataType;
  inputType?: InputType;
  options?: LabeledValue[];
  rules?: Rule[];
  // required?: boolean;
  // order?: number;
  //minWidth?: number;
  style?: CSSProperties;
}

// Table properties
export interface ITableProps<RecordType> extends TableProps<RecordType> {
  sortable?: boolean;
  hideRowSelection?: boolean;
  hidePagination?: boolean;
  fill?: boolean;
  extraColumns?: { showKeyColumn?: boolean; showActionsColumn?: boolean };
  extraComponents?: {
    key?: React.Key;
    node: ActionNode | ((records: RecordType[]) => ReactNode);
    position: Position;
    order?: (number | null)[];
    style?: CSSProperties;
  }[];
  setData?: React.Dispatch<React.SetStateAction<RecordType[]>>;
}

export const Table = <RecordType extends IElement = any>(props: ITableProps<RecordType>) => {
  const [form] = Form.useForm();

  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | undefined>((props.pagination && props.pagination.pageSize) || 10);
  const [refresh, setRefresh] = useState(false);
  const [editingRow, setEditingRow] = useState<{ previous?: React.Key; current?: React.Key }>();
  const [state, setState] = useState<{ previous?: State; current?: State }>({ current: 'idle' });
  const [sort, setSort] = useState<SorterResult<RecordType>[]>([]);

  const keyColumn = {
    key: 'key',
    dataIndex: 'key',
    title: '#',
    width: 60,
    sorter: state.current === 'idle' && { compare: (a, b) => compare(+a.key, +b.key), multiple: -1 },
  } as IColumn<RecordType>;

  const actionColumn = {
    key: 'actions',
    dataIndex: 'actions',
    title: 'Acciones',
    fixed: 'right',
    width: 210,
  } as IColumn<RecordType>;

  const {
    dataSource: _dataSource,
    columns: _columns,
    setData,
    extraColumns,
    extraComponents,
    sortable,
    fill,
    hideRowSelection,
    hidePagination,
    ...restProps
  } = props;

  const className = classNames(styles.tableWrapper, UNSELECTABLE, SHADOW, props.className);

  const dataSource = _dataSource ?? [];
  const columns = buildColumns(_columns);

  function buildColumns(columns: ColumnsType<RecordType> | undefined) {
    //console.log('buildColumns ...');

    if (!columns || columns.length === 0) return;

    // Create a dictionary to check if key and actions columns already exist.
    const columnsDict = _.keyBy(columns, 'keyColumn');

    if (extraColumns?.showKeyColumn && columns && !columnsDict['keyColumn']) columns = [keyColumn, ...columns];
    if (extraColumns?.showActionsColumn && columns && !columnsDict['actions']) columns = [...columns, actionColumn];
    if (props.fill) columns = [...columns, { style: { border: 'none' /* backgroundColor: '#fafafa'*/ } } as IColumn<RecordType>];

    let isInputFocused = false;

    columns = (columns as IColumn<RecordType>[]).map((col, index) => {
      return {
        ...col,
        align: 'center',
        ellipsis: true,
        sorter: sortable && state.current === 'idle' && col.sorter,
        //width: col.minWidth,
        shouldCellUpdate: (record, prevRecord) => {
          // Ignore fill cell
          if (record.key === undefined) return false;
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
            // width: column.width,
            style: { fontWeight: 'bold' },
          };
        },
        onCell: (record: RecordType) => {
          const dataIndex = col.dataIndex as string;
          const { forceEditing, editable, inputType, options, rules } = col;

          const shouldFocusInput = !isInputFocused && editable && isEditing(record);
          if (shouldFocusInput) isInputFocused = true;

          // console.log((record.a as Dayjs).format('DD/MM/YYYY'));

          return {
            key: dataIndex,
            dataIndex: dataIndex,
            value: record[dataIndex],
            editing: forceEditing || (editable && isEditing(record)),
            inputType,
            options,
            hasFocus: shouldFocusInput,
            rules,
            hasFeedback: true,
            form,
            style: col.style,
          } as ICellProps;
        },
        render: col.render
          ? col.render
          : (value, record, index) => {
              if (col.key === 'key') return dataSource.indexOf(record) + 1;
              else if (col.key === 'actions') return renderActionsColumn(record);
              else return value;
            },
      } as IColumn<RecordType>;
    });

    return columns;
  }

  useEffect(() => {
    if (state.current === 'idle') form.resetFields();
  }, [state]);

  useEffect(() => {
    // console.log('reseting selected rows');
    setSelectedRows([]);
  }, [currentPage, sort]);

  const renderComponents = (position: RegExp) => {
    const index = +(String(position) === String(/bottom|both/)); // header/both = 0, footer/both = 1

    return extraComponents
      ?.filter((component) => position.test(component.position))
      .sort((a, b) => compare(_.isEmpty(a.order) ? null : a.order![index], _.isEmpty(b.order) ? null : b.order![index]))
      .map((component) => {
        const { key, style } = component;
        switch (component.node) {
          case 'add-button':
            return { key, component: AddButton, style };

          case 'delete-button':
            return { key, component: DeleteButton, style };

          case 'refresh-button':
            return { key, component: RefreshButton, style };

          case 'records-count':
            return { key, component: RecordsCount, style };

          default:
            return { key, component: component.node(dataSource), style };
        }
      })
      .map(({ key, component, style }) => (
        <Wrapper key={key} className={styles.extraComponent} style={style} horizontal="center" vertical="middle">
          {component}
        </Wrapper>
      ));
  };

  const AddButton = React.useMemo(() => {
    return !editingRow?.current ? (
      <Button type="primary" onClick={() => handleAddRecord()}>
        Agregar
      </Button>
    ) : (
      <Button type="ghost" onClick={() => handleCancelRecord()}>
        Cancelar
      </Button>
    );
  }, [editingRow]);

  const DeleteButton = React.useMemo(() => {
    const disabledRemove = !(selectedRows.length > 0 && state.current !== 'adding');

    return (
      <Popconfirm
        title="¿Desea eliminar las filas seleccionadas?"
        onConfirm={() => {
          handleDeleteRecord(selectedRows);
        }}
        okText="Sí"
        cancelText="No"
        disabled={disabledRemove}>
        <Button type="primary" danger disabled={disabledRemove}>
          Eliminar
        </Button>
      </Popconfirm>
    );
  }, [selectedRows, state]);

  const RefreshButton = React.useMemo(() => {
    return (
      <Tooltip title="Actualizar">
        <Button
          style={{ paddingTop: 0 }}
          disabled={refresh || state.current !== 'idle'}
          type="link"
          icon={<ReloadOutlined spin={refresh} />}
          onClick={() => {
            setRefresh(true);
          }}
        />
      </Tooltip>
    );
  }, [refresh, state]);

  const RecordsCount = React.useMemo(() => {
    return <Tag color="volcano">Registros: {dataSource.length}</Tag>;
  }, [dataSource]);

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
        setEditingRow({ previous: editingRow?.current, current: key });
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

      setData(records);
      setEditingRow({ previous: editingRow?.current, current: undefined });
      setState({ previous: state.current, current: 'idle' });
    } catch (err) {
      console.log('Validate Failed:', err);
    }
  };

  const handleEditRecord = (record: RecordType) => {
    setEditingRow({ previous: editingRow?.current, current: record.key });
    setState({ previous: state.current, current: 'editing' });
    setSelectedRows([record.key]);
    form.setFieldsValue({ ...record });
  };

  const handleDeleteRecord = (keys: React.Key[]) => {
    if (dataSource.length === 0 || !setData) return;
    const records = _.reject(dataSource, (e) => _.includes(keys, e.key));

    setData(records);
    setEditingRow({ previous: editingRow?.current, current: undefined });
    setState({ previous: 'deleting', current: 'idle' });
    setSelectedRows([]);
  };

  const handleCancelRecord = () => {
    if (dataSource.length === 0 || !setData) return;
    if (state.current === 'adding') {
      const records = dataSource.slice(0, dataSource.length - 1);
      setData(records);
    }
    setEditingRow({ previous: editingRow?.current, current: undefined });
    setState({ previous: state.current, current: 'idle' });
    setSelectedRows([]);
  };

  const handleChangeTable = (
    pagination: TablePaginationConfig,
    filters: Record<string, React.ReactText[] | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => {
    setSort(Array.isArray(sorter) ? sorter : [sorter]);
  };

  const rowSelection: TableRowSelection<RecordType> = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys, selectedRows) => {
      //console.log(selectedRowKeys);
      if (state.current !== 'idle') return;
      const keys: React.Key[] = selectedRows.map((r) => r.key);
      //console.log(keys);
      setSelectedRows(keys);
    },
    getCheckboxProps: (record: RecordType) => ({
      //* name: record.name,
      //name: record.id + '',
      disabled: state.current !== 'idle' && !isEditing(record),
    }),
  };

  const preventFocus = (e: React.FocusEvent<any>) => {
    e.stopPropagation();
  };

  const renderActionsColumn = (record: RecordType) => {
    return isEditing(record) ? (
      <>
        {renderButtonSave()} {renderDivider()} {renderButtonCancel()}
      </>
    ) : (
      <>
        {renderButtonEdit()} {renderDivider()} {renderButtonDelete()}
      </>
    );

    function renderButtonEdit() {
      return (
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.buttonEdit}
            disabled={state.current !== 'idle'}
            type="link"
            onFocus={preventFocus}
            onClick={(e) => {
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
            okText="Sí"
            cancelText="No"
            okButtonProps={{ onFocus: preventFocus }}
            cancelButtonProps={{ onFocus: preventFocus }}
            onConfirm={(e) => {
              handleDeleteRecord([record.key]);
            }}>
            <Button
              className={styles.buttonDelete}
              disabled={state.current !== 'idle'}
              type="link"
              onFocus={(e) => {
                e.stopPropagation();
              }}>
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
            onFocus={preventFocus}
            onClick={(e) => {
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
            onFocus={preventFocus}
            onClick={(e) => {
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

  const Loading = React.useMemo(() => {
    return <LoadingOutlined />;
  }, []);

  return (
    <Form form={form} component={false}>
      <TableAnt
        {...restProps}
        loading={restProps.loading ? { indicator: Loading, tip: 'Cargando' } : restProps.loading}
        className={className}
        components={{
          header: {
            cell: Column,
          },
          body: {
            cell: Cell,
          },
        }}
        columns={columns}
        dataSource={dataSource}
        title={
          extraComponents && extraComponents.filter((component) => /top|both/.test(component.position)).length > 0
            ? (records) => {
                const components = renderComponents(/top|both/);
                return _.isEmpty(components) ? undefined : components;
              }
            : undefined
        }
        footer={
          extraComponents && extraComponents.filter((component) => /botoom|both/.test(component.position)).length > 0
            ? (records) => {
                const components = renderComponents(/botoom|both/);
                return _.isEmpty(components) ? undefined : components;
              }
            : undefined
        }
        rowSelection={props.hideRowSelection ? undefined : rowSelection}
        pagination={
          hidePagination
            ? false
            : {
                disabled: state.current !== 'idle',
                position: ['bottomRight'],
                current: currentPage,
                pageSize,
                pageSizeOptions: ['10', '20', '30', '50'],
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                  setEditingRow({ previous: editingRow?.current, current: undefined });
                },
              }
        }
        onChange={(pagination, filters, sorter, extra) => {
          handleChangeTable(pagination, filters, sorter, extra);
        }}
      />
    </Form>
  );
};
