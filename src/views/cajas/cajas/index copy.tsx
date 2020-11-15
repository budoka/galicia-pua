import { Button, Col, DatePicker, Form, Input, Row, Select, Tag } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import moment from 'moment';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { clearCajasPendientes, DetalleCaja, getCajasPendientes } from 'src/actions/cajas/caja-pendientes';
import { ContenidoCaja } from 'src/actions/cajas/interfaces';
import { IColumn, Table } from 'src/components/table';
import { Wrapper } from 'src/components/wrapper';
import { DATE_DEFAULT_FORMAT } from 'src/constants/constants';
import { RootState } from 'src/reducers';
import { getExpirationTime } from 'src/utils/api';
import { useQuery } from 'src/utils/history';
import { compare } from 'src/utils/string';
import styles from './style.module.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

export interface CajasProps {}

interface FiltroCajasPendientes {
  sector: number;
  fecha: moment.Moment[];
  usuario: string;
}

const columns = [
  {
    key: 'numero',
    dataIndex: 'numero',
    title: 'Número',
    width: 100,
    sorter: { compare: (a, b) => compare(+a.numero, +b.numero), multiple: -1 },
  },
  {
    key: 'descripcion',
    dataIndex: 'descripcion',
    title: 'Descripción',
    width: 300,
    sorter: { compare: (a, b) => compare(a.descripcion, b.descripcion), multiple: -1 },
  },
  {
    key: 'estado',
    dataIndex: 'estado',
    title: 'Estado',
    width: 200,
    sorter: { compare: (a, b) => compare(a.estado, b.estado), multiple: -1 },
    render: (value, record, index) => <Tag color="volcano">{value}</Tag>,
  },
  {
    key: 'fechaEmision',
    dataIndex: 'fechaEmision',
    title: 'Fecha emisión',
    width: 200,
    sorter: { compare: (a, b) => compare(a.fechaEmision, b.fechaEmision), multiple: -1 },
  },
  {
    key: 'sector',
    dataIndex: 'sector',
    title: 'Sector',
    width: 100,
    sorter: { compare: (a, b) => compare(+a.sector, +b.sector), multiple: -1 },
  },
  {
    key: 'usuario',
    dataIndex: 'usuario',
    title: 'Usuario',
    width: 250,
    sorter: { compare: (a, b) => compare(a.usuario, b.usuario), multiple: -1 },
  },
] as IColumn<DetalleCaja>[];

export const Cajas: React.FC<CajasProps> = (props) => {
  const query = useQuery();
  const estado = query.get('estado') || undefined;

  const dispatch = useDispatch();
  const cajasPendientes = useSelector((state: RootState) => state.cajas.pendientes);

  const [dataSource, setDataSource] = useState(cajasPendientes.detallesCaja);
  const [form] = useForm();

  useEffect(() => {
    const expiration = getExpirationTime(15);

    dispatch(getCajasPendientes({ idUsuario: 3, centroCosto: 1243, roles: ['Administrador'], estado }, { expiration }));
  }, []);

  useEffect(() => {
    setDataSource(cajasPendientes.detallesCaja);
  }, [cajasPendientes.detallesCaja]);

  const onFilter = (values: FiltroCajasPendientes) => {
    const centroCosto = values.sector;

    const fechaDesde = values.fecha && values.fecha.length > 0 ? values.fecha[0].format('YYYY-MM-DD') : undefined;
    const fechaHasta = values.fecha && values.fecha.length > 0 ? values.fecha[1].format('YYYY-MM-DD') : undefined;
    const nombre = values.usuario;
    const expiration = getExpirationTime(15);

    dispatch(
      getCajasPendientes(
        { idUsuario: 3, centroCosto, fechaDesde, fechaHasta, nombre, roles: ['Administrador'], estado },
        { expiration, force: true },
      ),
    );
  };

  const onReset = () => {
    form.resetFields();
  };

  const onRefresh = async () => {
    const expiration = getExpirationTime(15);

    dispatch(getCajasPendientes({ idUsuario: 3, centroCosto: 1243, roles: ['Administrador'], estado }, { expiration, force: true }));
  };

  const Filtros = React.useMemo(() => {
    return (
      <Form form={form} name="filter" style={{ display: 'flex', width: '100%' }} onFinish={onFilter}>
        <Form.Item name="sector" style={{ width: 170, paddingRight: 10 }}>
          <Select placeholder="Sector" allowClear>
            <Option value="1243">1243</Option>
          </Select>
        </Form.Item>

        <Form.Item name="fecha" style={{ width: 250, paddingRight: 10 }}>
          <RangePicker
            format={DATE_DEFAULT_FORMAT}
            ranges={{
              Hoy: [moment(), moment()],
              'Mes actual': [moment().startOf('month'), moment().endOf('month')],
              'Mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            }}
            allowClear
          />
        </Form.Item>

        <Form.Item name="usuario" style={{ width: 170 }}>
          <Input placeholder="Usuario" allowClear />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
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
        <Table
          rowKey={'numero'}
          className={styles.table}
          // bordered
          size={'small'}
          fill
          columns={columns as ColumnsType<DetalleCaja>}
          dataSource={dataSource}
          loading={cajasPendientes.isRunning}
          hideRowSelection
          extraColumns={{ showKeyColumn: false, showActionsColumn: false }}
          extraComponents={[
            {
              key: 'filters',
              node: () => Filtros,
              position: 'top',
            },
            {
              key: 'refresh-button',
              node: 'refresh-button',
              task: onRefresh,
              position: 'top',
            },
            {
              key: 'records-count',
              node: 'records-count',
              position: 'top',
              style: { marginLeft: 'auto' },
            },
          ]}
          sortable
          pagination={{ pageSize: 20 }}
          setData={setDataSource}
        />
      </Wrapper>
    );
  }, [cajasPendientes.isRunning, columns, dataSource]);

  return (
    <Wrapper contentWrapper unselectable direction="column" horizontal="center" style={{ minWidth: 1024 }}>
      {Tabla}
    </Wrapper>
  );
};
