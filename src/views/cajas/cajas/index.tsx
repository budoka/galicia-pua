import { unwrapResult } from '@reduxjs/toolkit';
import { message, Tag } from 'antd';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ContentHeaderWithCart } from 'src/components/content-header';
import { ColumnTypeEx, Table } from 'src/components/table';
import { ExportButton } from 'src/components/table/extra/export-button';
import { Wrapper } from 'src/components/wrapper';
import { Texts } from 'src/constants/texts';
import { clearState, exportCajas, fetchCajas, setFilters } from 'src/features/cajas/cajas-pendientes/cajas-pendientes.slice';
import { DetalleCaja, EstadosCaja, FiltrosCajas } from 'src/features/cajas/cajas-pendientes/types';
import { RootState } from 'src/reducers';
import { useAppDispatch } from 'src/store';
import { useQuery } from 'src/utils/history';
import { compare } from 'src/utils/string';
import { Filtros } from './filtros';
import styles from './style.module.less';

export interface CajasProps {}

const columns = [
  {
    key: 'numero',
    dataIndex: 'numero',
    title: Texts.BOX,
    width: 100,
    sorter: { compare: (a, b) => compare(+a.numero, +b.numero), multiple: -1 },
  },
  {
    key: 'descripcion',
    dataIndex: 'descripcion',
    title: Texts.DESCRIPTION,
    width: 350,
    sorter: { compare: (a, b) => compare(a.descripcion, b.descripcion), multiple: -1 },
  },
  {
    key: 'estado',
    dataIndex: 'estado',
    title: Texts.STATUS,
    width: 200,
    sorter: { compare: (a, b) => compare(a.estado, b.estado), multiple: -1 },
    render: (value, record, index) => <Tag color="volcano">{value}</Tag>,
  },
  {
    key: 'fechaEmision',
    dataIndex: 'fechaEmision',
    title: Texts.ISSUE_DATE,
    width: 200,
    sorter: { compare: (a, b) => compare(a.fechaEmision, b.fechaEmision), multiple: -1 },
  },
  {
    key: 'sector',
    dataIndex: 'sector',
    title: Texts.SECTOR,
    width: 120,
    sorter: { compare: (a, b) => compare(+a.sector, +b.sector), multiple: -1 },
  },
  {
    key: 'usuario',
    dataIndex: 'usuario',
    title: Texts.USER,
    width: 250,
    sorter: { compare: (a, b) => compare(a.usuario, b.usuario), multiple: -1 },
  },
] as ColumnTypeEx<DetalleCaja>[];

export const Cajas: React.FC<CajasProps> = React.memo((props) => {
  const query = useQuery();

  const sesion = useSelector((state: RootState) => state.sesion);
  const cajasPendientes = useSelector((state: RootState) => state.cajas.pendientes);
  const dispatch = useAppDispatch();

  const queryEstado = query.get('estado');
  const estado = queryEstado ? (queryEstado as EstadosCaja) : undefined;

  useEffect(() => {
    const filtros: FiltrosCajas = {
      estado,
      sector: sesion.data?.idSector,
      fecha: undefined,
      usuario: sesion.data?.nombreUsuario,
    };
    dispatch(setFilters(filtros));
    dispatch(fetchCajas());
    return () => {
      dispatch(clearState());
    };
  }, []);

  const disabledExport = cajasPendientes.data.cajas.length <= 0;
  console.log(columns);
  console.log(cajasPendientes.data);

  const exportToExcel = () => {
    dispatch(exportCajas())
      .then(unwrapResult)
      .then(() => message.success(Texts.EXPORT_DATA_SUCCESS))
      .catch(() => message.error(Texts.EXPORT_DATA_FAILURE));
  };

  const Tabla = () => {
    return (
      <Table
        rowKey={'numero'}
        className={styles.table}
        size={'small'}
        fill
        columns={columns as ColumnsType<DetalleCaja>}
        dataSource={cajasPendientes.data.cajas}
        loading={cajasPendientes.loading.busqueda}
        hideRowSelection
        extraColumns={{ showKeyColumn: false, showActionsColumn: false }}
        extraComponents={[
          {
            key: 'filters',
            node: <Filtros />,
            position: 'top',
          },
          {
            key: 'export',
            node: <ExportButton disabled={disabledExport} loading={cajasPendientes.loading.exportacion} onClick={exportToExcel} />,
            position: 'top',
            style: { marginLeft: 'auto' },
          },
          /*   {
              key: 'refresh',
              node: <RefreshButton  />,
              //node: 'export-button',
              //task: exportToExcel,
              position: 'top',
              style: { marginLeft: 'auto' },
            }, */
          {
            key: 'records-count-tag',
            node: 'records-count-tag',
            position: 'top',
          },
        ]}
        sortable
        pagination={{ pageSize: 20 }}
        //  setData={setDataSource}
      />
    );
  };

  return (
    <Wrapper contentWrapper unselectable direction="column" horizontal="center" style={{ minWidth: 1350 }}>
      <ContentHeaderWithCart />
      <Wrapper contentBody direction="row" horizontal="center">
        <Tabla />
      </Wrapper>
    </Wrapper>
  );
});
