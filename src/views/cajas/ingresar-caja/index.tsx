import { CaretRightOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Checkbox, Col, DatePicker, Divider, Empty, Form, List, Row, Select, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ColProps } from 'antd/lib/col';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import { LabeledValue } from 'antd/lib/select';
import dayjs from 'dayjs';
import _ from 'lodash';
import moment from 'moment';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Elemento } from 'src/actions/cajas/caja-filtros/interfaces';
import { saveCaja } from 'src/actions/cajas/caja-info';

import {
  PreviewCajaDetalleResponse,
  PreviewCajaDocumentoResponse,
  PreviewCajaEtiquetaResponse,
} from 'src/actions/cajas/caja-preview/interfaces';
import { CajaEtiqueta, ContenidoCaja, GuardarCajaBodyRequest, InfoCaja } from 'src/actions/cajas/interfaces';
import { ContentInfo } from 'src/components/content-info';
import { ListCard } from 'src/components/list-card';
import { IListCardItem } from 'src/components/list-card/interfaces';
import { Loading, LoadingContent } from 'src/components/loading';
import { IColumn, Table } from 'src/components/table';
import { Wrapper } from 'src/components/wrapper';
import { CAJA_DETALLE, CAJA_DOCUMENTO, CAJA_ETIQUETA, DATE_DEFAULT_FORMAT } from 'src/constants/constants';
import { IElement, Reglas } from 'src/interfaces';
import { RootState } from 'src/reducers';
import { deleteProps } from 'src/utils/object';
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
  checkboxRestringir?: { visible: boolean };
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
};

const layout = {
  labelCol: {
    span: 8,
  } as ColProps,
  wrapperCol: {
    span: 16,
  } as ColProps,
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const IngresarCaja: React.FC = (props) => {
  const [form] = useForm();

  const dispatch = useDispatch();

  const sesion = useSelector((state: RootState) => state.sesion);
  const cajas = useSelector((state: RootState) => state.cajas);

  const [uIState, setUIState] = useState<UIState>();

  const [columns, setColumns] = useState<IColumn<ContenidoCaja>[]>([]);
  const [list, setList] = useState<CajaEtiqueta[]>([]);

  // useEffects

  useEffect(() => {
    //  dispatch(getTiposCaja());
  }, []);

  useEffect(() => {
    console.log('rendr ingresarcaja');
  });

  useEffect(() => {
    /*   if (uIState?.preview) {
      dispatch(getPreviewCaja(cajas.filtros.seleccionado));
    } */
  }, [uIState?.preview]);

  useEffect(() => {
    const preview = cajas.preview.preview;
    console.log(preview);

    if (_.isEmpty(preview)) return;

    if ('inclusiones' in preview[0]) {
      const previewDocumento: PreviewCajaDocumentoResponse[] = preview as PreviewCajaDocumentoResponse[];

      const columns: IColumn<ContenidoCaja>[] = previewDocumento[0].inclusiones.map((preview, index) => {
        const title = splitStringByWords(preview.descripcion.split('Inclusion')[1])?.join(' ');

        return {
          id: index,
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
      // setDataSource([]);
    } else if ('idPlantilla' in preview[0]) {
      const previewDetale: PreviewCajaDetalleResponse[] = preview as PreviewCajaDetalleResponse[];

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
      // setDataSource([]);
    } else if ('legacy' in preview[0]) {
      const previewEtiqueta: PreviewCajaEtiquetaResponse[] = preview as PreviewCajaEtiquetaResponse[];

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
          key: index,
          id: preview.id,
          idEtiqueta: preview.id,
          descripcion: preview.descripcion,
        };
      });

      setList(data);
      //setColumns(columns);
      //  setDataSource(data);
    }
  }, [cajas.preview.preview]);

  // handlers

  const handleTipoCaja = () => {
    const { value: id, label: descripcion } = form.getFieldValue('tipoCaja');
    const tipoCaja: Elemento = { id, descripcion };

    const fieldsToReset = ['tipoContenido', 'tipoPlantilla', 'fechaVigencia', 'descripcion', 'restringir'];
    form.resetFields(fieldsToReset);

    //  dispatch(setTipoCajaSeleccionado(tipoCaja)); // *
    // dispatch(getTiposContenidoCaja(tipoCaja));
    setUIState({ selectTipoContenido: { visible: true } });
  };

  const handleTipoContenido = () => {
    const { value: id, label: descripcion } = form.getFieldValue('tipoContenido');
    const tipoContenido: Elemento = { id, descripcion };

    // Se debe cambiar el servicio tipoDeContenido para que devuelva un objeto {id: number, descripcion: string}
    if (descripcion === CAJA_ETIQUETA) tipoContenido.id = 0;
    else if (descripcion === CAJA_DETALLE) tipoContenido.id = 1;
    else if (descripcion === CAJA_DOCUMENTO) tipoContenido.id = 2;

    const fieldsToReset = ['tipoPlantilla'];
    if (descripcion === CAJA_DETALLE) fieldsToReset.push('fechaVigencia');
    form.resetFields(fieldsToReset);

    //  dispatch(setTipoContenidoCajaSeleccionado(tipoContenido)); // *

    if (descripcion === CAJA_DETALLE) {
      //    dispatch(getTiposPlantilla(tipoContenido));
      setUIState((prev) => ({
        ...prev,
        selectTipoPlantilla: { visible: true },
        datePickerFechaVigencia: { visible: false },
        inputDescripcion: { visible: false },
        checkboxRestringir: { visible: false },
        preview: { visible: false },
        buttonCrear: { visible: false },
      }));
    } else if (descripcion === CAJA_ETIQUETA) {
      setUIState((prev) => ({
        ...prev,
        selectTipoPlantilla: { visible: false },
        datePickerFechaVigencia: { visible: true },
        inputDescripcion: { visible: false },
        checkboxRestringir: { visible: false },
        preview: { visible: false },
        buttonCrear: { visible: false },
      }));
    } else if (descripcion === CAJA_DOCUMENTO) {
      setUIState((prev) => ({
        ...prev,
        selectTipoPlantilla: { visible: false },
        datePickerFechaVigencia: { visible: true },
        inputDescripcion: { visible: true },
        checkboxRestringir: { visible: true },
        preview: { visible: true },
        buttonCrear: { visible: true },
      }));
    }
  };

  const handleTipoPlantilla = () => {
    const { value: id, label: descripcion } = form.getFieldValue('tipoPlantilla');
    const tipoPlantilla: Elemento = { id, descripcion };

    //  dispatch(setTipoPlantillaSeleccionado(tipoPlantilla)); // *

    setUIState((prev) => ({
      ...prev,
      datePickerFechaVigencia: { visible: true },
      preview: { visible: true },
    }));
  };

  const handleFechaVigencia = () => {
    const fieldValue = form.getFieldValue('fechaVigencia');
    if (fieldValue) {
      const { value: id, label: descripcion } = fieldValue;
      const fechaVigencia: Elemento = { id, descripcion };

      // dispatch(setTipoPlantillaSeleccionado(tipoPlantilla)); // *

      setUIState((prev) => ({
        ...prev,
        inputDescripcion: { visible: true },
        checkboxRestringir: { visible: true },
        buttonCrear: { visible: true },
      }));
    } else {
      setUIState((prev) => ({
        ...prev,
        inputDescripcion: { visible: false },
        checkboxRestringir: { visible: false },
        buttonCrear: { visible: false },
      }));
    }
  };

  const handleForm = () => {
    console.log('creando caja');

    const data: GuardarCajaBodyRequest = {
      idTipoCaja: +cajas.filtros.seleccionado.tipoCaja?.id!,
      idTipoContenido: +cajas.filtros.seleccionado.tipoContenido?.id!,
      idPlantilla: +cajas.filtros.seleccionado.tipoPlantilla?.id!,
      idUsuarioAlta: sesion.data?.idUsuario!,
      idSectorOrigen: sesion.data?.idSector!,
      restringida: form.getFieldValue('restringir') ? 1 : 0,
      descripcion: form.getFieldValue('descripcion'),
      fechaGeneracion: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      fechaVencimiento: dayjs().add(10, 'year').format('YYYY-MM-DD'),
      fechaDesde: dayjs().format('YYYY-MM-DD'),
      fechaHasta: dayjs().add(10, 'year').format('YYYY-MM-DD'),
    };

    dispatch(saveCaja(data));
  };

  const handleReset = () => {
    form.resetFields();
    setUIState({});
  };

  // renders

  const renderOptions = (options: Elemento[]) => {
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
            loading={cajas.filtros.isRunning}
            placeholder="Seleccione un tipo de caja"
            disabled={cajas.filtros.isRunning}
            onChange={handleTipoCaja}>
            {renderOptions(cajas.filtros.filtro.tiposCaja)}
          </Select>
        </Form.Item>

        {uIState?.selectTipoContenido?.visible && (
          <Form.Item label={'Tipo de Contenido'} name={'tipoContenido'} rules={reglas['tipoContenido']} required>
            <Select
              labelInValue
              loading={cajas.filtros.isRunning}
              placeholder="Seleccione un tipo de contenido"
              optionLabelProp="children"
              optionFilterProp="children"
              filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              disabled={cajas.filtros.isRunning}
              onChange={handleTipoContenido}>
              {renderOptions(cajas.filtros.filtro.tiposContenidoCaja)}
            </Select>
          </Form.Item>
        )}

        {uIState?.selectTipoPlantilla?.visible && (
          <Form.Item label={'Plantilla'} name={'tipoPlantilla'} rules={reglas['tipoPlantilla']} required>
            <Select
              labelInValue
              loading={cajas.filtros.isRunning}
              placeholder="Seleccione una plantilla"
              optionLabelProp="children"
              optionFilterProp="children"
              disabled={cajas.filtros.isRunning}
              onChange={handleTipoPlantilla}>
              {renderOptions(cajas.filtros.filtro.tiposPlantilla)}
            </Select>
          </Form.Item>
        )}

        {uIState?.datePickerFechaVigencia?.visible && (
          <Form.Item label={'Fecha Vigencia'} name={'fechaVigencia'} rules={reglas['fechaVigencia']} required>
            <RangePicker
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
            {uIState.labelFechaVigencia?.visible && <Text strong>Ant Design (strong)</Text>}
          </Form.Item>
        )}

        {uIState?.inputDescripcion?.visible && (
          <Form.Item label={'Descripción'} name={'descripcion'}>
            <TextArea placeholder="Ingrese una descripción" autoSize={{ minRows: 4, maxRows: 4 }} />
          </Form.Item>
        )}

        {uIState?.checkboxRestringir?.visible && (
          <Form.Item label={'Restringir'} name={'restringir'} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        )}

        {uIState?.buttonCrear?.visible && (
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
        {!uIState?.preview?.visible ? undefined : (
          <Wrapper direction="row" horizontal="center">
            {cajas.filtros.seleccionado.tipoContenido?.descripcion === CAJA_ETIQUETA ? (
              <ListCard
                scrollHeight={212}
                className={styles.previewList}
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
                loading={cajas.preview.isRunning}
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
