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
import { Loading } from 'src/components/loading';
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
  /*   setFechaVigencia,
  setTipoCaja,
  setTipoContenido,
  setTipoPlantilla, */
  setInputs,
  setUI,
} from 'src/features/ingresar-caja/ingresar-caja.slice';
import { Filtro, VistaPreviaCajaDetalle, VistaPreviaCajaDocumento, VistaPreviaCajaEtiqueta } from 'src/features/ingresar-caja/types';
import { RootState } from 'src/reducers';
import { useAppDispatch } from 'src/store';
import { Reglas } from 'src/types';
import { goTo } from 'src/utils/history';
import { compare, splitStringByWords } from 'src/utils/string';
import styles from './style.module.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;

interface UIState {
  selectTipoContenido?: { visible: boolean };
  selectTipoPlantilla?: { visible: boolean };
  datePickerFechaVigencia?: { visible: boolean };
  labelFechaVigencia?: { visible: boolean };
  inputDescripcion?: { visible: boolean };
  checkboxRestringida?: { visible: boolean };
  preview?: { visible: boolean };
  buttonCrear?: { visible: boolean };
}

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
    span: 9,
  } as ColProps,
  wrapperCol: {
    span: 15,
  } as ColProps,
};

const tailLayout = {
  wrapperCol: { offset: layout.labelCol.span, span: layout.wrapperCol.span },
};

export const IngresarCaja: React.FC = (props) => {
  const [form] = useForm();

  const dispatch = useAppDispatch();

  const sesion = useSelector((state: RootState) => state.sesion);
  const cajas = useSelector((state: RootState) => state.cajas);

  const ingresarCajas = useSelector((state: RootState) => state.ingresarCajas);

  //const [uIState, setUIState] = useState<UIState>();

  const [columns, setColumns] = useState<IColumn<ContenidoCaja>[]>([]);
  const [list, setList] = useState<CajaEtiqueta[]>([]);

  // useEffects

  useEffect(() => {
    /* dispatch(clearUI());
    dispatch(clearInputs()); */
    dispatch(clearState());
    dispatch(fetchTiposCaja());
    console.log('asd');
  }, []);

  useEffect(() => {
    //console.log('rendr ingresarcaja');
  });

  useEffect(() => {
    if (ingresarCajas.ui.vistaPrevia?.visible) dispatch(fetchVistaPrevia());
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
          /*      dataType: preview.tipoDato,
          rules: [{ required: preview.requerido === 'R' }],

            required: !preview.opcional,
          length: preview.longitud,
          order: preview.orden,
          align: 'center',*/
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
          /*  dataType: preview.tipo,
          rules: [{ required: !preview.opcional, len: preview.longitud }],
          order: preview.orden,
          sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 }, */
        } as IColumn<ContenidoCaja>;
      });

      setColumns(columns);
    } else if ('legacy' in preview[0]) {
      const previewEtiqueta: VistaPreviaCajaEtiqueta[] = preview as VistaPreviaCajaEtiqueta[];

      /*     const columns: IColumn<ContenidoCaja>[] = [
        {
          key: 'etiqueta',
          dataIndex: 'etiqueta',
          title: 'Etiqueta',
          editable: true,
          dataType: 'texto',
          inputType: 'text',
          sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
        } as IColumn<ContenidoCaja>,
        {
          key: 'valor',
          dataIndex: 'valor',
          // title: 'Seleccionado',
          editable: true,
          forceEditing: true,
          dataType: 'boolean',
          inputType: 'checkbox',

          // render: (value) => <Checkbox onChange={() => console.log(value)} />,
        } as IColumn<ContenidoCaja>,
      ]; */

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

  /* useEffect(() => {
    if (ingresarCajas.ui.labelFechaVigencia?.visible && !ingresarCajas.inputs.fechaVigencia) {
      dispatch(
        setUI({
          ...ingresarCajas.ui,
          labelFechaVigencia: { visible: false },
        }),
      );
    }
  }, [ingresarCajas.inputs.fechaVigencia]); */

  /*   useEffect(() => {
    if (ingresarCajas.inputs.fechaVigencia) {
      dispatch(setUI({ ...ingresarCajas.ui, labelFechaVigencia: { visible: true } }));
    } else if (!ingresarCajas.loading.añosVencimiento && !ingresarCajas.data.añosVencimiento) {
      dispatch(setUI({ ...ingresarCajas.ui, labelFechaVigencia: { visible: false } }));
    }
  }, [ingresarCajas.loading.añosVencimiento]); */

  /*  useEffect(() => {
    if (ingresarCajas.data.añosVencimiento) {
      dispatch(
        setUI({
          ...ingresarCajas.ui,
          labelFechaVigencia: { visible: true },
          inputDescripcion: { visible: true },
          checkboxRestringir: { visible: true },
          buttonCrear: { visible: true },
        }),
      );
    } else {
      dispatch(
        setUI({
          ...ingresarCajas.ui,
          inputDescripcion: { visible: false },
          checkboxRestringir: { visible: false },
          buttonCrear: { visible: false },
        }),
      );
    }
  }, [ingresarCajas.data.añosVencimiento]); */

  // handlers

  const handleTipoCaja = () => {
    const { value: id, label: descripcion } = form.getFieldValue('tipoCaja');
    const tipoCaja: Filtro = { id, descripcion };

    const fieldsToReset = ['tipoContenido', 'tipoPlantilla', 'fechaVigencia', 'descripcion', 'restringida'];
    form.resetFields(fieldsToReset);

    dispatch(setInputs({ tipoCaja }));
    // dispatch(setTipoCaja(tipoCaja));
    dispatch(fetchTiposContenido());
    dispatch(setUI({ selectTipoContenido: { visible: true } }));
  };

  const handleTipoContenido = (fieldValue: any) => {
    const { value: id, label: descripcion } = fieldValue; //form.getFieldValue('tipoContenido');
    const tipoContenido: Filtro = { id, descripcion };

    // Se debe cambiar el servicio tipoDeContenido para que devuelva un objeto {id: number, descripcion: string}
    if (descripcion === CAJA_ETIQUETA) tipoContenido.id = 0;
    else if (descripcion === CAJA_DETALLE) tipoContenido.id = 1;
    else if (descripcion === CAJA_DOCUMENTO) tipoContenido.id = 2;

    const fieldsToReset = ['tipoPlantilla', 'fechaVigencia', 'descripcion', 'restringida'];
    form.resetFields(fieldsToReset);

    const { tipoCaja } = ingresarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido }));
    // dispatch(setTipoContenido(tipoContenido));

    if (descripcion === CAJA_DETALLE) {
      dispatch(fetchTiposPlantilla());
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
    } else if (descripcion === CAJA_ETIQUETA) {
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
    } else if (descripcion === CAJA_DOCUMENTO) {
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
    const { value: id, label: descripcion } = fieldValue;
    //const { value: id, label: descripcion } = form.getFieldValue('tipoPlantilla');
    const tipoPlantilla: Elemento = { id, descripcion };

    const { tipoCaja, tipoContenido, fechaVigencia } = ingresarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido, tipoPlantilla, fechaVigencia }));
    //dispatch(setTipoPlantilla(tipoPlantilla));
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
        labelFechaVigencia: { visible: true },
        inputDescripcion: { visible: true },
        checkboxRestringida: { visible: true },
        buttonCrear: { visible: true },
      }),
    );
    if (fechaVigencia) dispatch(fetchAñosVencimiento());
  };

  const handleForm = () => {
    console.log('creando caja');

    const descripcion = form.getFieldValue('descripcion');
    const restringida = form.getFieldValue('restringida') ? 1 : 0;
    dispatch(setInputs({ ...ingresarCajas.inputs, descripcion, restringida }));

    dispatch(saveCaja())
      .then((action) => {
        goTo(`/editar-caja/${action.payload}`);
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
      <Option key={option.id} value={option.id} id={option.id}>
        {option.descripcion}
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
              optionLabelProp="children"
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
              optionLabelProp="children"
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

        {ingresarCajas.ui?.labelFechaVigencia?.visible && (ingresarCajas.inputs.fechaVigencia || ingresarCajas.loading.añosVencimiento) && (
          <Form.Item /* label={'Fecha de Vencimiento'} */ name={'fechaVigencia'} wrapperCol={{ offset: layout.labelCol.span }}>
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
            {ingresarCajas.inputs.tipoContenido?.descripcion === CAJA_ETIQUETA ? (
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

  return (
    <Wrapper contentWrapper unselectable direction="column" horizontal="center" style={{ minWidth: 1200 }}>
      <ContentInfo />
      <Row justify="center" style={{ width: '100%', height: '100%' }}>
        <Col span={9}>{renderForm()}</Col>
        <Col>
          <Divider style={{ height: '100%', marginLeft: 20, marginRight: 20 }} type="vertical" />
        </Col>
        <Col span={14}>{renderPreview()}</Col>
      </Row>
    </Wrapper>
  );
};
