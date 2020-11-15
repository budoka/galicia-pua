import { Button, DatePicker, Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCajasPendientes } from 'src/actions/cajas/caja-pendientes';
import { DATE_DEFAULT_FORMAT } from 'src/constants/constants';
import { getExpirationTime } from 'src/utils/api';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface FiltrosCaja {
  estado?: string;
  sector?: number;
  fecha?: moment.Moment[];
  usuario?: string;
}

type FiltrosProps = Pick<FiltrosCaja, 'estado' | 'sector'>;

export const Filtros: React.FC<FiltrosProps> = (props) => {
  const { estado, sector } = props;

  const dispatch = useDispatch();
  const [form] = useForm<FiltrosCaja>();

  useEffect(() => {
    console.log('rendering filtros');

    form.setFieldsValue({ estado, sector });
  }, []);

  const onFilter = (values: FiltrosCaja) => {
    const estado = values.estado;
    const centroCosto = values.sector;
    const fechaDesde = values.fecha && values.fecha.length > 0 ? values.fecha[0].format('YYYY-MM-DD') : undefined;
    const fechaHasta = values.fecha && values.fecha.length > 0 ? values.fecha[1].format('YYYY-MM-DD') : undefined;
    const nombre = values.usuario;
    const expiration = getExpirationTime(15);

    dispatch(
      getCajasPendientes(
        { estado, centroCosto, fechaDesde, fechaHasta, nombre, roles: ['Administrador'], idUsuario: 3 },
        { expiration, force: true },
      ),
    );
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} name="filter" style={{ display: 'flex', width: '100%' }} onFinish={onFilter}>
      <Form.Item name="estado" style={{ width: 190, paddingRight: 10 }}>
        <Select placeholder="Estado">
          <Option value="PendienteCierre">Pendiente de Cierre</Option>
          <Option value="PendienteRecepcion">Pendiente de Devolución</Option>
        </Select>
      </Form.Item>

      <Form.Item name="sector" style={{ width: 170, paddingRight: 10 }}>
        <Select placeholder="Sector">
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
};
