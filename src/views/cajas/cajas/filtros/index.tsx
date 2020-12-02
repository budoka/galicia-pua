import { Button, DatePicker, Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DATE_DD_MM_YYYY_FORMAT } from 'src/constants/constants';
import { fetchCajas, setFilters } from 'src/features/cajas/cajas-pendientes/cajas-pendientes.slice';
import { FiltrosCajas } from 'src/features/cajas/cajas-pendientes/types';
import { RootState } from 'src/reducers';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const Filtros: React.FC = (props) => {
  const dispatch = useDispatch();
  const [form] = useForm<FiltrosCajas>();
  const sesion = useSelector((state: RootState) => state.sesion);
  const filtros = useSelector((state: RootState) => state.cajas.pendientes.filters);

  useEffect(() => {
    form.setFieldsValue({ ...filtros });
  }, [filtros]);

  /*  const onChangeFilter = (changedFields: any[], allFields: any[]) => {
    if (changedFields.length === 0) return;
    // console.log(changedFields);
    // console.log(allFields);
    dispatch(setFilters(form.getFieldsValue()));
  }; */

  const onFilter = (values: FiltrosCajas) => {
    dispatch(setFilters(values));
    dispatch(fetchCajas());
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
      /*  onFieldsChange={(changedFields: any[], allFields: any[]) => onChangeFilter(changedFields, allFields)} */
    >
      <Form.Item name="estado" style={{ width: 190, paddingRight: 10 }}>
        <Select placeholder="Estado">
          <Option value="PendienteCierre">Pendiente de Cierre</Option>
          <Option value="PendienteRecepcion">Pendiente de Devolución</Option>
        </Select>
      </Form.Item>

      <Form.Item name="fecha" style={{ width: 250, paddingRight: 10 }}>
        <RangePicker
          format={DATE_DD_MM_YYYY_FORMAT}
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
