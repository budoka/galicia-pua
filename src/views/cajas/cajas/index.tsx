import { Tag } from 'antd';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { CajasBodyRequest, DetalleCaja, getCajasPendientes } from 'src/actions/cajas/caja-pendientes';
import { setFiltrosCajasPendientes } from 'src/actions/cajas/caja-pendientes-filtros';
import { ContentInfo } from 'src/components/content-info';
import { IColumn, Table } from 'src/components/table';
import { Wrapper } from 'src/components/wrapper';
import { RootState } from 'src/reducers';
import { getExpirationTime } from 'src/utils/api';
import { useQuery } from 'src/utils/history';
import { compare } from 'src/utils/string';
import { Filtros } from './filtros';

import styles from './style.module.less';
import { DetalleCaja } from 'src/actions/cajas/caja-pendientes';

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
    width: 120,
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

export const Cajas: React.FC<CajasProps> = React.memo((props) => {
  const query = useQuery();

  const sesion = useSelector((state: RootState) => state.sesion);
  const cajasPendientes = useSelector((state: RootState) => state.cajas.pendientes);
  const filtrosCajasPendientes = useSelector((state: RootState) => state.cajas.filtrosPendientes);
  const dispatch = useDispatch();

  const estado = query.get('estado') || undefined;
  const [fetch, setFetch] = useState(false);

  useEffect(() => {
    dispatch(
      setFiltrosCajasPendientes({
        estado,
        sector: sesion.infoSesion?.idSector,
        fecha: undefined,
        usuario: sesion.infoSesion?.nombreUsuario,
      }),
    );

    setFetch(true);
  }, []);

  useEffect(() => {
    if (!fetch) return;

    const expiration = getExpirationTime();

    /*     const bodyRequest: CajasBodyRequest = {
      idUsuario: sesion.infoSesion?.idUsuario!,
      roles: [sesion.infoSesion?.perfil!],
      centroCosto: filtrosCajasPendientes.sector,
      estado: filtrosCajasPendientes.estado,
      nombre: filtrosCajasPendientes.usuario,
    };
 */
    //   dispatch(getCajasPendientes(bodyRequest, { expiration }));
  }, [fetch]);

  /*   const onRefresh = async () => {
    const expiration = getExpirationTime();

    const bodyRequest: CajasBodyRequest = {
         idUsuario: sesion.infoSesion?.idUsuario!,
      roles: [sesion.infoSesion?.perfil!],
      centroCosto: filtrosCajasPendientes.sector,
      estado: filtrosCajasPendientes.estado,
      nombre: filtrosCajasPendientes.usuario,
      fechaDesde:
        filtrosCajasPendientes.fecha && filtrosCajasPendientes.fecha.length > 0
          ? filtrosCajasPendientes.fecha[0].format('YYYY-MM-DD')
          : undefined,
      fechaHasta:
        filtrosCajasPendientes.fecha && filtrosCajasPendientes.fecha.length > 1
          ? filtrosCajasPendientes.fecha[1].format('YYYY-MM-DD')
          : undefined,
    };

    dispatch(getCajasPendientes(bodyRequest, { expiration, force: true }));
  }; */

  const Tabla = () => {
    return (
      <Wrapper direction="row" horizontal="center" style={{ width: '100%' }}>
        <Table
          rowKey={'numero'}
          className={styles.table}
          // bordered
          size={'small'}
          fill
          //     columns={columns as ColumnsType<DetalleCaja>}
          //      dataSource={cajasPendientes.detallesCaja}
          loading={cajasPendientes.isRunning}
          hideRowSelection
          extraColumns={{ showKeyColumn: false, showActionsColumn: false }}
          extraComponents={[
            {
              key: 'filters',
              node: <Filtros />,
              position: 'top',
            },
            /*             {
              key: 'refresh-button',
              node: 'refresh-button',
              task: onRefresh,
              position: 'top',
            }, */
            {
              key: 'records-count',
              node: 'records-count',
              position: 'top',
              style: { marginLeft: 'auto' },
            },
          ]}
          sortable
          pagination={{ pageSize: 20 }}
          //  setData={setDataSource}
        />
      </Wrapper>
    );
  };

  return (
    <Wrapper contentWrapper unselectable direction="column" horizontal="center" style={{ minWidth: 1200 }}>
      <ContentInfo />
      {Tabla()}
    </Wrapper>
  );
});
