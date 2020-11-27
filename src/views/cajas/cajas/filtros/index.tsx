import { Button, DatePicker, Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFiltrosCajasPendientes } from 'src/actions/cajas/caja-pendientes-filtros';

import { DATE_DEFAULT_FORMAT } from 'src/constants/constants';
import { RootState } from 'src/reducers';
import { getExpirationTime } from 'src/utils/api';
import { FiltrosCajas } from 'src/features/cajas-pendientes/types';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const Filtros: React.FC = (props) => {
  const dispatch = useDispatch();
  const [form] = useForm<FiltrosCajas>();
  const sesion = useSelector((state: RootState) => state.sesion);
  const filtrosCajasPendientes = useSelector((state: RootState) => state.cajas.filtrosPendientes);

  useEffect(() => {
    form.setFieldsValue({ ...filtrosCajasPendientes });
  }, [filtrosCajasPendientes]);

  const onChangeFilter = (changedFields: any[], allFields: any[]) => {
    if (changedFields.length === 0) return;
    // console.log(changedFields);
    // console.log(allFields);
    dispatch(setFiltrosCajasPendientes(form.getFieldsValue()));
  };

  const onFilter = (values: FiltrosCajas) => {
    /*    const bodyRequest: CajasBodyRequest = {
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

    const expiration = getExpirationTime(15);

    dispatch(getCajasPendientes(bodyRequest, { expiration, force: true })); */
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      name="filter"
      style={{ display: 'flex', width: '100%' }}
      onFinish={onFilter}
      onFieldsChange={(changedFields: any[], allFields: any[]) => onChangeFilter(changedFields, allFields)}>
      <Form.Item name="estado" style={{ width: 190, paddingRight: 10 }}>
        <Select placeholder="Estado">
          <Option value="PendienteCierre">Pendiente de Cierre</Option>
          <Option value="PendienteRecepcion">Pendiente de Devolución</Option>
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

      <Form.Item name="sector" style={{ width: 170, paddingRight: 10 }}>
        <Select placeholder="Sector">
          <Option value="1243">1243</Option>
        </Select>
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
};
