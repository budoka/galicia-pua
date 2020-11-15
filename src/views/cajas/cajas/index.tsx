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
import { Filtros } from './filtros';
import styles from './style.module.less';

export interface CajasProps {}

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
  const cajasPendientes = useSelector((state: RootState) => state.cajas.pendientes);
  const dispatch = useDispatch();

  const estado = query.get('estado') || undefined;
  const [dataSource, setDataSource] = useState(cajasPendientes.detallesCaja);

  useEffect(() => {
    const expiration = getExpirationTime();
    dispatch(getCajasPendientes({ idUsuario: 3, centroCosto: 1243, roles: ['Administrador'], estado }, { expiration }));
  }, []);

  useEffect(() => {
    setDataSource(cajasPendientes.detallesCaja);
  }, [cajasPendientes.detallesCaja]);

  const onRefresh = async () => {
    const expiration = getExpirationTime();
    dispatch(getCajasPendientes({ idUsuario: 3, centroCosto: 1243, roles: ['Administrador'], estado }, { expiration, force: true }));
  };

  // const Filtro = () => <Filtros estado={estado} sector={1243} />;

  const Tabla = () => {
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
            /* {
              key: 'filters',
              node: <Filtros estado={estado} sector={1243} />,
              position: 'top',
            },*/
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
  };

  return (
    <Wrapper contentWrapper unselectable direction="column" horizontal="center" style={{ minWidth: 1200 }}>
      <Tabla />
    </Wrapper>
  );
};
