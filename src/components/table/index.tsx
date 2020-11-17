import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, message, Popconfirm, Tag } from 'antd';
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
import { AddButton } from './extra/add-button';
import { DeleteButton } from './extra/delete-button';
import { RecordsCounter } from './extra/record-counter';
import { RefreshButton } from './extra/refresh-button';
import styles from './style.module.less';

export type DataType = 'texto' | 'entero' | 'fecha' | 'boolean';
export type InputType = 'text' | 'date' | 'select' | 'checkbox';
export type Action = 'idle' | 'adding' | 'editing' | 'deleting';
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
  hideHeader?: boolean;
  hideFooter?: boolean;
  fill?: boolean;
  extraColumns?: { showKeyColumn?: boolean; showActionsColumn?: boolean };
  extraComponents?: {
    key?: React.Key;
    node: ActionNode | /*| ((records: RecordType[]) => ReactNode) */ ReactNode;
    position: Position;
    task?: () => Promise<void>;
    order?: (number | null)[];
    style?: CSSProperties;
  }[];
  setData?: React.Dispatch<React.SetStateAction<RecordType[]>>;
}

interface TableState<RecordType> {
  action: { previous?: Action; current?: Action };
  currentPage: number;
  editingRow: { previous?: React.Key; current?: React.Key };
  pageSize: number;
  selectedRows: React.Key[];
  sort: SorterResult<RecordType>[];
}

export const Table = <RecordType extends IElement = any>(props: ITableProps<RecordType>) => {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log('rendering tableeee initt');
  }, []);

  const [state, setState] = useState<TableState<RecordType>>({
    action: { current: 'idle' },
    currentPage: 1,
    editingRow: {},
    pageSize: (props.pagination && props.pagination.pageSize) || 10,
    selectedRows: [],
    sort: [],
  });

  const [stateRefreshButton, setStateRefreshButton] = useState(false);

  const keyColumn = React.useMemo(
    () =>
      ({
        key: 'key',
        dataIndex: 'key',
        title: '#',
        width: 60,
        sorter: {
          compare: (a, b) => compare(+a.key, +b.key),
          multiple: -1,
        },
      } as IColumn<RecordType>),
    [],
  );

  const actionColumn = React.useMemo(
    () =>
      ({
        key: 'actions',
        dataIndex: 'actions',
        title: 'Acciones',
        fixed: 'right',
        width: 210,
      } as IColumn<RecordType>),
    [],
  );

  const className = classNames(styles.tableWrapper, UNSELECTABLE, SHADOW, props.className);
  const {
    setData,
    extraColumns,
    extraComponents,
    sortable,
    fill,
    hideRowSelection,
    hidePagination,
    hideHeader,
    hideFooter,
    ...restProps
  } = props;
  const dataSource = props.dataSource ?? [];

  const columns = React.useMemo(() => {
    // console.log('updating columns');
    let columns = props.columns;
    if (!columns || columns.length === 0) return;

    if (extraColumns?.showKeyColumn) columns = [keyColumn, ...columns];
    if (extraColumns?.showActionsColumn) columns = [...columns, actionColumn];

    if (props.fill)
      columns = [
        ...columns,
        {
          style: {
            /*  border: 'none' backgroundColor: '#fafafa'*/
          },
        } as IColumn<RecordType>,
      ];

    let isInputFocused = false;

    columns = (columns as IColumn<RecordType>[]).map((col, index) => {
      return {
        ...col,
        align: 'center',
        ellipsis: true,
        sorter: sortable && col.sorter,
        sortOrder: sortable && state.sort.length > 0 && state.sort.find((s) => s.columnKey === col.key)?.order,
        shouldCellUpdate: (record, prevRecord) => {
          // Ignore fill cell
          if (record.key === undefined) return false;
          // Update cell when a record was deleted.
          if (state.action.previous === 'deleting') return true;

          const isEditing = record.key === state.editingRow.current || record.key === state.editingRow.previous;

          const isActionColumn = col.dataIndex === 'actions';
          const shouldUpdateAction =
            isActionColumn &&
            (state.action.current === 'adding' ||
              state.action.current === 'editing' ||
              state.action.previous === 'adding' ||
              state.action.previous === 'editing');

          if (shouldUpdateAction) return true;

          const columnName = col.dataIndex! as string;
          const prevValue = prevRecord[columnName];
          const nextValue = record[columnName];

          const shouldUpdate = prevValue !== nextValue || isEditing;

          return shouldUpdate;
        },
        onHeaderCell: (column: IColumn<RecordType>) => {
          return {
            style: { fontWeight: 'bold' },
          };
        },
        onCell: (record: RecordType) => {
          const dataIndex = col.dataIndex as string;
          const { forceEditing, editable, inputType, options, rules } = col;

          const shouldFocusInput = !isInputFocused && editable && isEditing(record);
          if (shouldFocusInput) isInputFocused = true;

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

    // console.log(columns);

    return columns;
  }, [state]);

  useEffect(() => {
    // console.log(state);
  }, [state]);

  useEffect(() => {
    if (state.action.current === 'idle') form.resetFields();
  }, [state.action.current]);

  useEffect(() => {
    if (state.action.current !== 'adding') setState((prev) => ({ ...prev, selectedRows: [] }));
  }, [state.currentPage, state.sort]);

  const renderComponents = (position: RegExp) => {
    const index = +(String(position) === String(/bottom|both/)); // header/both = 0, footer/both = 1

    return extraComponents
      ?.filter((component) => position.test(component.position))
      .sort((a, b) => compare(_.isEmpty(a.order) ? null : a.order![index], _.isEmpty(b.order) ? null : b.order![index]))
      .map((component) => {
        const { key, style, task, node } = component;

        switch (node) {
          case 'add-button':
            return {
              key,
              component: <AddButton editing={!!state.editingRow.current} onAdd={handleAddRecord} onCancel={handleCancelRecord} />,
              style,
            };
          //   return { key, component: AddButton, style };

          case 'delete-button':
            const disabled = !(state.selectedRows.length > 0 && state.action.current !== 'adding');
            // console.log()
            return {
              key,
              component: <DeleteButton disabled={disabled} onDelete={() => handleDeleteRecord(state.selectedRows)} />,
              style,
            };
          //  return { key, component: DeleteButton, style };

          case 'refresh-button':
            return {
              key,
              component: (
                <RefreshButton
                  disabled={state.action.current !== 'idle' || stateRefreshButton}
                  running={stateRefreshButton}
                  setRefresh={setStateRefreshButton}
                  task={task}
                />
              ),
              style,
            };

          case 'records-count':
            return { key, component: <RecordsCounter count={dataSource.length} />, style };
          // return { key, component: RecordsCount, style };

          default:
            return { key, component: node, style };
        }
      })
      .map(({ key, component, style }) => {
        return (
          <Wrapper key={key} className={styles.extraComponent} style={style} horizontal="center" vertical="middle">
            {component}
          </Wrapper>
        );
      });
  };

  const isEditing = (record: RecordType) => record.key === state.editingRow.current;

  const handleAddRecord = () => {
    if (dataSource.length === 0) return;

    const key = dataSource.length + 1;
    const record: RecordType = { key } as RecordType;
    const sort: SorterResult<RecordType> = { columnKey: 'key', order: undefined };

    setData!([...dataSource, record]);

    setState((prev) => ({
      ...prev,
      action: { previous: state.action.current, current: 'adding' },
      currentPage: Math.ceil((dataSource.length + 1) / state.pageSize!),
      editingRow: { previous: state.editingRow.current, current: key },
      selectedRows: [key],
      sort: [sort],
    }));
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

      setState((prev) => ({
        ...prev,
        editingRow: { previous: state.editingRow.current, current: undefined },
        action: { previous: state.action.current, current: 'idle' },
      }));

      if (state.action.current === 'adding') message.success('Registro agregado correctamente');
      else if (state.action.current === 'editing') message.success('Registro actualizado correctamente');
    } catch (err) {
      console.log('Validate Failed:', err);
      message.error('Error al validar los campos: ' + err.errorFields.map((f: any) => f.name).join(', '));
    }
  };

  const handleEditRecord = (record: RecordType) => {
    setState((prev) => ({
      ...prev,
      selectedRows: [record.key],
      editingRow: { previous: state.editingRow.current, current: record.key },
      action: { previous: state.action.current, current: 'editing' },
    }));

    //*setEditingRow({ previous: stateT.editingRow.current, current: record.key });
    //*setState({ previous: stateT.state.current, current: 'editing' });
    //*setSelectedRows([record.key]);
    form.setFieldsValue({ ...record });
  };

  const handleDeleteRecord = (keys: React.Key[]) => {
    if (dataSource.length === 0 || !setData) return;
    const records = _.reject(dataSource, (e) => _.includes(keys, e.key));

    setData(records);

    setState((prev) => ({
      ...prev,
      selectedRows: [],
      editingRow: { previous: state.editingRow.current, current: undefined },
      action: { previous: 'deleting', current: 'idle' },
    }));

    //*setEditingRow({ previous: stateT.editingRow.current, current: undefined });
    //*setState({ previous: 'deleting', current: 'idle' });
    //*setSelectedRows([]);
  };

  const handleCancelRecord = () => {
    if (dataSource.length === 0 || !setData) return;

    if (state.action.current === 'adding') {
      const records = dataSource.slice(0, dataSource.length - 1);
      setData(records);
    }

    setState((prev) => ({
      ...prev,
      selectedRows: [],
      editingRow: { previous: state.editingRow.current, current: undefined },
      action: { previous: state.action.current, current: 'idle' },
    }));
  };

  const handleChangeTable = (
    pagination: TablePaginationConfig,
    filters: Record<string, React.ReactText[] | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => {
    setState((prev) => ({
      ...prev,
      sort: Array.isArray(sorter) ? sorter : [sorter],
    }));

    handleCancelRecord();
  };

  const rowSelection: TableRowSelection<RecordType> = {
    selectedRowKeys: state.selectedRows,
    onChange: (selectedRowKeys, selectedRows) => {
      //console.log(selectedRowKeys);
      if (state.action.current !== 'idle') return;
      const keys: React.Key[] = selectedRows.map((r) => r.key);
      //console.log(keys);

      setState((prev) => ({
        ...prev,
        selectedRows: keys,
      }));

      //* setSelectedRows(keys);
    },
    getCheckboxProps: (record: RecordType) => ({
      //* name: record.name,
      //name: record.id + '',
      disabled: state.action.current !== 'idle' && !isEditing(record),
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
            disabled={state.action.current !== 'idle'}
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
            disabled={state.action.current !== 'idle'}
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
              disabled={state.action.current !== 'idle'}
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

  const Loading = React.memo(() => <LoadingOutlined />);

  /*   const renderHeader = React.useMemo(() => {
    const regex = /top|both/;
    const hasComponents = extraComponents && extraComponents.filter((component) => regex.test(component.position)).length > 0;

    const components = renderComponents(regex);
    return hasComponents && !_.isEmpty(components) ? (
      <Wrapper className={styles.header} direction="row" horizontal="left" vertical="middle" style={{ width: '100%' }}>
        {components}
      </Wrapper>
    ) : undefined;
  }, [extraComponents]); */

  const renderTitle = () => {
    const regex = /top|both/;
    const hasComponents = extraComponents && extraComponents.filter((component) => regex.test(component.position)).length > 0;
    console.log(extraComponents);
    const components = renderComponents(regex);
    return hasComponents && !_.isEmpty(components) ? components : undefined;
  };

  const renderFooter = () => {
    const regex = /bottom|both/;
    const hasComponents = extraComponents && extraComponents.filter((component) => regex.test(component.position)).length > 0;

    const components = renderComponents(regex);
    return hasComponents && !_.isEmpty(components) ? components : undefined;
  };

  return (
    <Wrapper direction="column" horizontal="center" style={{ width: '100%' }}>
      <Form form={form} component={false}>
        <TableAnt
          {...restProps}
          loading={restProps.loading ? { indicator: <Loading />, tip: 'Cargando' } : restProps.loading}
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
          scroll={{ y: 0 }}
          showSorterTooltip={false}
          title={hideHeader ? undefined : renderTitle}
          footer={hideFooter ? undefined : renderFooter}
          rowSelection={props.hideRowSelection ? undefined : rowSelection}
          pagination={
            hidePagination
              ? false
              : {
                  style: { marginRight: 12 },
                  disabled: state.action.current !== 'idle',
                  position: ['bottomRight'],
                  current: state.currentPage,
                  pageSize: state.pageSize,
                  pageSizeOptions: ['10', '20', '30', '50'],
                  showSizeChanger: true,
                  onChange: (page, pageSize) => {
                    setState((prev) => ({
                      ...prev,
                      currentPage: page,
                      pageSize: pageSize!,
                      editingRow: { previous: state.editingRow.current, current: undefined },
                    }));
                    //* setCurrentPage(page);
                    //*  setPageSize(pageSize);
                    //*  setEditingRow({ previous: stateT.editingRow.current, current: undefined });
                  },
                }
          }
          onChange={(pagination, filters, sorter, extra) => {
            handleChangeTable(pagination, filters, sorter, extra);
          }}
        />
      </Form>
    </Wrapper>
  );
};

export const MemoizedTable = React.memo<any>(Table);
