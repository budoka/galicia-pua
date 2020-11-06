import { Button, Col, DatePicker, Form, Input, Row, Select, Tag } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import moment from 'moment';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getCajasPendientes } from 'src/actions/cajas/caja-pendientes';
import { ContenidoCaja } from 'src/actions/cajas/interfaces';
import { IColumn, Table } from 'src/components/table';
import { Wrapper } from 'src/components/wrapper';
import { DATE_DEFAULT_FORMAT } from 'src/constants/constants';
import { RootState } from 'src/reducers';
import { compare } from 'src/utils/string';
import styles from './style.module.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

const _columns = [
  {
    key: 'a',
    dataIndex: 'a',
    title: 'a',
    width: 200,
    editable: true,
    dataType: 'fecha',
    inputType: 'date',
    // rules: [{ max: 5 }],
    sorter: { compare: (a, b) => compare(+a.key, +b.key), multiple: -1 },
  },
  {
    key: 'b',
    dataIndex: 'b',
    title: 'b',
    width: 150,
    style: {},
    inputType: 'select',
    options: [
      {
        value: 1,
        label: (
          <Tag className="ellipsis" style={{ width: '100%', marginRight: 0 }}>
            ASDASDASDAASDASDASDAASDASDASDAASDASDASDAASDASDASDAASDASDASDAASDASDASDAASDASDASDAASDASDASDA
          </Tag>
        ),
      },
      { value: 2, label: 'EDF' },
      { value: 3, label: 'ASDASDASDAASDASDASDAASDASDASDAASDASDASDAASDASDASDAASDASDASDAASDASDASDAASDASDASDAASDASDASDA' },
    ],
    editable: true,
  },
  {
    key: 'c',
    dataIndex: 'c',
    title: 'c',
    width: 40,
    inputType: 'checkbox',
    dataType: 'boolean',
    editable: true,
  },
] as IColumn<ContenidoCaja>[];

export const Cajas: React.FC = (props) => {
  const dispatch = useDispatch();
  const cajasPendientes = useSelector((state: RootState) => state.cajas.pendientes);

  console.log(cajasPendientes.detallesCaja);

  const [columns, setColumns] = useState(_columns);
  const [dataSource, setDataSource] = useState(cajasPendientes.detallesCaja);
  const [form] = useForm();

  // useEffect(() => console.log('render cajas'));

  useEffect(() => {
    // Fetch cajas
    const expiration = dayjs().add(15, 'second').unix();

    dispatch(getCajasPendientes({ idUsuario: 3, centroCosto: 1243, roles: ['Administrador'], estado: 'PendienteCierre' }, expiration));
  }, []);

  const onFinish = (values: any) => {};

  const onReset = () => {
    form.resetFields();
  };

  const Filtros = React.useMemo(() => {
    return (
      <Form form={form} name="filter" style={{ display: 'flex', width: '100%' }} onFinish={onFinish}>
        <Form.Item name="sector" /* label="Sector"*/ style={{ width: 170, paddingRight: 10 }}>
          <Select placeholder="Sector" allowClear>
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>

        <Form.Item name="fecha" /*label="Fecha"*/ style={{ width: 250, paddingRight: 10 }}>
          <RangePicker
            format={DATE_DEFAULT_FORMAT}
            ranges={{
              Hoy: [moment(), moment()],
              'Este mes': [moment().startOf('month'), moment().endOf('month')],
            }}
            allowClear
          />
        </Form.Item>

        <Form.Item name="usuario" /*label="Usuario"*/ style={{ width: 170 }}>
          <Input placeholder="Usuario" allowClear />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="button">
            Filtrar
          </Button>

          <Button htmlType="button" onClick={onReset}>
            Limpiar
          </Button>
        </Form.Item>
      </Form>
    );
  }, []);

  const Tabla = React.useMemo(() => {
    return (
      <Wrapper direction="row" horizontal="center" style={{ width: '100%' }}>
        <Table<any>
          className={styles.table}
          bordered
          size={'small'}
          fill
          columns={columns as ColumnsType<ContenidoCaja>}
          dataSource={dataSource}
          loading={cajasPendientes.isRunning}
          hideRowSelection
          extraColumns={{ showKeyColumn: true, showActionsColumn: false }}
          extraComponents={[
            {
              key: 'filters',
              node: () => Filtros,
              position: 'top',
              style: { flexGrow: 2 },
            },
            {
              key: 'refresh-button',
              node: 'refresh-button',
              position: 'top',
            },
            {
              key: 'records-count',
              node: 'records-count',
              position: 'top',
            },
          ]}
          sortable
          pagination={{ pageSize: 20 }}
          setData={setDataSource}
          scroll={{ y: 300 }}
        />
      </Wrapper>
    );
  }, [cajasPendientes.isRunning, columns, dataSource]);

  return (
    <Wrapper contentWrapper unselectable direction="column" horizontal="center" style={{ minWidth: 1024 }}>
      {Tabla}
      {/*renderActionButtons()*/}
    </Wrapper>
  );
};
