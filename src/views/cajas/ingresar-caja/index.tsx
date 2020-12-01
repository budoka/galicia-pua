import { PayloadAction } from '@reduxjs/toolkit';
import { Button, Checkbox, Col, DatePicker, Divider, Empty, Form, message, Row, Select, Typography } from 'antd';
import { ColProps } from 'antd/lib/col';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import moment from 'moment';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Elemento } from 'src/actions/cajas/caja-filtros/interfaces';
import { CajaEtiqueta, ContenidoCaja } from 'src/actions/cajas/interfaces';
import { ContentInfo } from 'src/components/content-info';
import { ListCard } from 'src/components/list-card';
import { IListCardItem } from 'src/components/list-card/interfaces';
import { Loading, LoadingContent } from 'src/components/loading';
import { IColumn, Table } from 'src/components/table';
import { Wrapper } from 'src/components/wrapper';
import { CAJA_DETALLE, CAJA_DOCUMENTO, CAJA_ETIQUETA, DATE_DEFAULT_FORMAT } from 'src/constants/constants';
import {
  clearInputs,
  clearState,
  clearUI,
  fetchAñosVencimiento,
  fetchTiposCaja,
  fetchTiposContenido,
  fetchTiposPlantilla,
  fetchVistaPrevia,
  saveCaja,
  setInputs,
  setUI,
} from 'src/features/cajas/ingresar-caja/ingresar-caja.slice';
import {
  Filtro,
  Inputs,
  VistaPreviaCajaDetalle,
  VistaPreviaCajaDocumento,
  VistaPreviaCajaEtiqueta,
} from 'src/features/cajas/ingresar-caja/types';
import { RootState } from 'src/reducers';
import { useAppDispatch } from 'src/store';
import { Reglas } from 'src/types';
import { goTo } from 'src/utils/history';
import { compare, splitStringByWords } from 'src/utils/string';
import styles from './style.module.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;

const reglas: Reglas = {
  tipoCaja: [
    {
      required: true,
    },
  ],
  tipoContenido: [
    {
      required: true,
    },
  ],
  tipoPlantilla: [
    {
      required: true,
    },
  ],
  fechaVigencia: [
    {
      required: true,
    },
  ],
};

const layout = {
  labelCol: {
    span: 8,
  } as ColProps,
  wrapperCol: {
    span: 15,
  } as ColProps,
};

const tailLayout = {
  wrapperCol: { offset: layout.labelCol.span, span: layout.wrapperCol.span },
};

export const IngresarCaja: React.FC = (props) => {
  const [form] = useForm<Inputs>();

  const dispatch = useAppDispatch();

  const ingresarCajas = useSelector((state: RootState) => state.ingresarCajas);

  const [columns, setColumns] = useState<IColumn<ContenidoCaja>[]>([]);
  const [list, setList] = useState<CajaEtiqueta[]>([]);

  // useEffects

  useEffect(() => {
    dispatch(fetchTiposCaja());
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    const { tipoCaja, tipoContenido, tipoPlantilla } = ingresarCajas.inputs;
    if (ingresarCajas.ui.vistaPrevia?.visible) dispatch(fetchVistaPrevia({ tipoCaja, tipoContenido, tipoPlantilla }));
  }, [ingresarCajas.ui.vistaPrevia]);

  useEffect(() => {
    const preview = ingresarCajas.data.vistaPrevia;
    console.log(preview);

    if (!preview || _.isEmpty(preview)) return;

    if ('inclusiones' in preview[0]) {
      const previewDocumento: VistaPreviaCajaDocumento[] = preview as VistaPreviaCajaDocumento[];

      const columns: IColumn<ContenidoCaja>[] = previewDocumento[0].inclusiones.map((preview, index) => {
        const title = splitStringByWords(preview.descripcion.split('Inclusion')[1])?.join(' ');

        return {
          id: preview.descripcion,
          title,
          sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
        } as IColumn<ContenidoCaja>;
      });

      setColumns(columns);
    } else if ('idPlantilla' in preview[0]) {
      const previewDetale: VistaPreviaCajaDetalle[] = preview as VistaPreviaCajaDetalle[];

      const columns: IColumn<ContenidoCaja>[] = previewDetale.map((preview) => {
        return {
          id: preview.id,
          title: preview.titulo,
        } as IColumn<ContenidoCaja>;
      });

      setColumns(columns);
    } else if ('legacy' in preview[0]) {
      const previewEtiqueta: VistaPreviaCajaEtiqueta[] = preview as VistaPreviaCajaEtiqueta[];

      const data: CajaEtiqueta[] = previewEtiqueta.map((preview, index) => {
        return {
          key: preview.id,
          id: preview.id,
          idEtiqueta: preview.id,
          descripcion: preview.descripcion,
        };
      });

      setList(data);
    }
  }, [ingresarCajas.data.vistaPrevia]);

  // handlers

  const handleTipoCaja = () => {
    const tipoCaja: Filtro = form.getFieldsValue().tipoCaja!;

    const fieldsToReset = ['tipoContenido', 'tipoPlantilla', 'fechaVigencia', 'descripcion', 'restringida'];
    form.resetFields(fieldsToReset);

    dispatch(setInputs({ tipoCaja }));
    dispatch(setUI({ selectTipoContenido: { visible: true } }));
    dispatch(fetchTiposContenido(tipoCaja));
  };

  const handleTipoContenido = (fieldValue: any) => {
    const tipoContenido: Filtro = form.getFieldsValue().tipoContenido!;
    const { label } = tipoContenido;

    // Se debe cambiar el servicio tipoDeContenido para que devuelva un objeto {id: number, descripcion: string}
    if (label === CAJA_ETIQUETA) tipoContenido.value = 0;
    else if (label === CAJA_DETALLE) tipoContenido.value = 1;
    else if (label === CAJA_DOCUMENTO) tipoContenido.value = 2;

    const fieldsToReset = ['tipoPlantilla', 'fechaVigencia', 'descripcion', 'restringida'];
    form.resetFields(fieldsToReset);

    const { tipoCaja } = ingresarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido }));

    if (label === CAJA_DETALLE) {
      dispatch(
        setUI({
          ...ingresarCajas.ui,
          selectTipoPlantilla: { visible: true },
          datePickerFechaVigencia: { visible: false },
          inputDescripcion: { visible: false },
          checkboxRestringida: { visible: false },
          vistaPrevia: { visible: false },
          buttonCrear: { visible: false },
        }),
      );
      dispatch(fetchTiposPlantilla());
    } else if (label === CAJA_ETIQUETA) {
      dispatch(
        setUI({
          ...ingresarCajas.ui,
          selectTipoPlantilla: { visible: false },
          datePickerFechaVigencia: { visible: true },
          inputDescripcion: { visible: false },
          checkboxRestringida: { visible: false },
          vistaPrevia: { visible: true },
          buttonCrear: { visible: false },
        }),
      );
    } else if (label === CAJA_DOCUMENTO) {
      dispatch(
        setUI({
          ...ingresarCajas.ui,
          selectTipoPlantilla: { visible: false },
          datePickerFechaVigencia: { visible: false },
          inputDescripcion: { visible: true },
          checkboxRestringida: { visible: true },
          vistaPrevia: { visible: true },
          buttonCrear: { visible: true },
        }),
      );
    }
  };

  const handleTipoPlantilla = (fieldValue: any) => {
    const tipoPlantilla: Filtro = form.getFieldsValue().tipoPlantilla!;

    const { tipoCaja, tipoContenido, fechaVigencia } = ingresarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido, tipoPlantilla, fechaVigencia }));
    dispatch(
      setUI({
        ...ingresarCajas.ui,
        datePickerFechaVigencia: { visible: true },
        vistaPrevia: { visible: true },
      }),
    );
  };

  const handleFechaVigencia = (fieldValue: any) => {
    const fechaVigencia = fieldValue ? (fieldValue as moment.Moment[]).map((f) => f.toISOString()) : null;
    const { tipoCaja, tipoContenido, tipoPlantilla } = ingresarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido, tipoPlantilla, fechaVigencia }));
    dispatch(
      setUI({
        ...ingresarCajas.ui,
        labelFechaVencimiento: { visible: true },
        inputDescripcion: { visible: true },
        checkboxRestringida: { visible: true },
        buttonCrear: { visible: true },
      }),
    );
    if (fechaVigencia) dispatch(fetchAñosVencimiento({ tipoCaja, tipoContenido }));
  };

  const handleForm = () => {
    console.log('creando caja');

    const descripcion = form.getFieldsValue().descripcion;
    const restringida = form.getFieldsValue().restringida ? 1 : 0;
    const inputs = { ...ingresarCajas.inputs, descripcion, restringida };
    dispatch(setInputs(inputs));
    dispatch(saveCaja(inputs))
      .then((action) => {
        const id = action.payload;
        goTo(`/editar-caja/${id}`);
        message.success('Caja creada correctamente.');
      })
      .catch((err) => {
        message.error('Error al crear la caja.');
      });
  };

  const handleReset = () => {
    form.resetFields();
    dispatch(clearUI());
    dispatch(clearInputs());
  };

  // renders

  const renderOptions = (options?: Filtro[]) => {
    if (!options) return;

    return options.map((option, index) => (
      <Option key={option.key || option.value} value={option.value}>
        {option.label}
      </Option>
    ));
  };

  const renderForm = () => {
    return (
      <Form {...layout} className={styles.form} form={form} name="ingresarCaja" onFinish={handleForm}>
        <Form.Item label={'Tipo de Caja'} name={'tipoCaja'} rules={reglas['tipoCaja']} required>
          <Select
            labelInValue
            loading={ingresarCajas.loading.tiposCaja}
            placeholder="Seleccione un tipo de caja"
            disabled={ingresarCajas.loading.tiposCaja}
            onChange={handleTipoCaja}>
            {renderOptions(ingresarCajas.data.tiposCaja)}
          </Select>
        </Form.Item>

        {ingresarCajas.ui?.selectTipoContenido?.visible && (
          <Form.Item label={'Tipo de Contenido'} name={'tipoContenido'} rules={reglas['tipoContenido']} required>
            <Select
              labelInValue
              loading={ingresarCajas.loading.tiposContenido}
              placeholder="Seleccione un tipo de contenido"
              optionFilterProp="children"
              filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              disabled={ingresarCajas.loading.tiposContenido}
              onChange={handleTipoContenido}>
              {renderOptions(ingresarCajas.data.tiposContenido)}
            </Select>
          </Form.Item>
        )}

        {ingresarCajas.ui?.selectTipoPlantilla?.visible && (
          <Form.Item label={'Plantilla'} name={'tipoPlantilla'} rules={reglas['tipoPlantilla']} required>
            <Select
              labelInValue
              loading={ingresarCajas.loading.tiposPlantilla}
              placeholder="Seleccione una plantilla"
              optionFilterProp="children"
              disabled={ingresarCajas.loading.tiposPlantilla}
              onChange={handleTipoPlantilla}>
              {renderOptions(ingresarCajas.data.tiposPlantilla)}
            </Select>
          </Form.Item>
        )}

        {ingresarCajas.ui?.datePickerFechaVigencia?.visible && (
          <Form.Item label={'Fecha de Vigencia'} name={'fechaVigencia'} rules={reglas['fechaVigencia']} required>
            <RangePicker
              style={{ width: '100%' }}
              format={DATE_DEFAULT_FORMAT}
              ranges={{
                Hoy: [moment(), moment()],
                '1 Mes': [moment(), moment().add(1, 'month')],
                '3 Meses': [moment(), moment().add(3, 'month')],
                '6 Meses': [moment(), moment().add(6, 'month')],
                '1 Año': [moment(), moment().add(1, 'year')],
              }}
              allowClear
              onChange={handleFechaVigencia}
            />
          </Form.Item>
        )}

        {ingresarCajas.ui?.labelFechaVencimiento?.visible && (ingresarCajas.inputs.fechaVigencia || ingresarCajas.loading.añosVencimiento) && (
          <Form.Item name={'fechaVigencia'} wrapperCol={{ offset: layout.labelCol.span }}>
            {ingresarCajas.loading.añosVencimiento ? (
              <Loading text="Calculando fecha de vencimiento" />
            ) : (
              <Text strong>{`Fecha de vencimiento: ${moment(ingresarCajas.inputs.fechaVigencia![1])
                .add(ingresarCajas.data.añosVencimiento, 'year')
                .format('DD/MM/YYYY')}`}</Text>
            )}
          </Form.Item>
        )}

        {ingresarCajas.ui?.inputDescripcion?.visible && (
          <Form.Item label={'Descripción'} name={'descripcion'}>
            <TextArea placeholder="Ingrese una descripción" autoSize={{ minRows: 4, maxRows: 4 }} />
          </Form.Item>
        )}

        {ingresarCajas.ui?.checkboxRestringida?.visible && (
          <Form.Item label={'Restringir'} name={'restringida'} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        )}

        {ingresarCajas.ui?.buttonCrear?.visible && (
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Crear
            </Button>

            <Button type="link" htmlType="button" onClick={handleReset}>
              Limpiar
            </Button>
          </Form.Item>
        )}
      </Form>
    );
  };

  const renderPreview = () => {
    return (
      <>
        {!ingresarCajas.ui?.vistaPrevia?.visible ? undefined : (
          <Wrapper direction="row" horizontal="center">
            {ingresarCajas.inputs.tipoContenido?.label === CAJA_ETIQUETA ? (
              <ListCard
                scrollHeight={326}
                className={styles.previewList}
                hoverable={false}
                header="Etiquetas"
                items={list.map((item) => {
                  return {
                    description: item.descripcion,
                  } as IListCardItem;
                })}
              />
            ) : (
              <Table<ContenidoCaja>
                className={styles.previewTable}
                size={'small'}
                columns={columns as ColumnsType<ContenidoCaja>}
                dataSource={[]}
                loading={ingresarCajas.loading.vistaPrevia}
                hideRowSelection
                hideHeader
                hideFooter
                hidePagination
                locale={{ emptyText: <Empty description="Vista preliminar" /> }}
              />
            )}
          </Wrapper>
        )}
      </>
    );
  };

  const loadingContent = ingresarCajas.loading.tiposCaja;

  return (
    <Wrapper contentWrapper unselectable direction="column" horizontal="center" style={{ minWidth: loadingContent ? '100%' : 1315 }}>
      {loadingContent ? (
        <LoadingContent />
      ) : (
        <>
          <ContentInfo />
          <Row justify="center" style={{ width: '100%', height: '100%' }}>
            <Col span={layout.labelCol.span}>{renderForm()}</Col>
            <Col>
              <Divider style={{ height: '100%', marginLeft: 20, marginRight: 20 }} type="vertical" />
            </Col>
            <Col span={layout.wrapperCol.span}>{renderPreview()}</Col>
          </Row>
        </>
      )}
    </Wrapper>
  );
};
