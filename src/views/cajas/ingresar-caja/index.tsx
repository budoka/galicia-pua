import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Checkbox, Col, DatePicker, Divider, Empty, Form, message, Row, Select, Typography } from 'antd';
import { ColProps } from 'antd/lib/col';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import moment from 'moment';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ContentHeaderWithCart } from 'src/components/content-header';
import { ListCard } from 'src/components/list-card';
import { IListCardItem } from 'src/components/list-card/interfaces';
import { Loading, LoadingContent } from 'src/components/loading';
import { ColumnTypeEx, Table } from 'src/components/table';
import { Wrapper } from 'src/components/wrapper';
import { CAJA_DETALLE, CAJA_DOCUMENTO, CAJA_ETIQUETA, DATE_DD_MM_YYYY_FORMAT } from 'src/constants/constants';
import { Texts } from 'src/constants/texts';
import { CajaEtiqueta, ContenidoCaja } from 'src/features/cajas/editar-caja/types';
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
import { Rules } from 'src/types';
import { goTo } from 'src/utils/history';
import { compare, splitStringByWords } from 'src/utils/string';
import styles from './style.module.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;

const reglas: Rules = {
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
  fechaContenido: [
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
    span: 14,
  } as ColProps,
};

const tailLayout = {
  wrapperCol: { offset: layout.labelCol.span, span: layout.wrapperCol.span },
};

const columnsConfig = { width: 150 };

export const IngresarCaja: React.FC = (props) => {
  const [form] = useForm<Inputs>();

  const dispatch = useAppDispatch();

  const ingresarCajas = useSelector((state: RootState) => state.cajas.creacion);

  const [columns, setColumns] = useState<ColumnTypeEx<ContenidoCaja>[]>([]);
  const [list, setList] = useState<CajaEtiqueta[]>([]);

  const documentColumn = {
    key: 'document',
    dataIndex: 'document',
    title: 'Documento',
    inputType: 'select',
    rules: [{ required: true }],
    editable: true,
    width: columnsConfig.width,
    align: 'center',
    sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
  } as ColumnTypeEx<ContenidoCaja>;

  // useEffects

  useEffect(() => {
    dispatch(fetchTiposCaja());
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    const { tipoCaja, tipoContenido, tipoPlantilla } = ingresarCajas.inputs;
    if (ingresarCajas.ui.vistaPrevia?.visible) dispatch(fetchVistaPrevia({ data: { tipoCaja, tipoContenido, tipoPlantilla } }));
  }, [ingresarCajas.ui.vistaPrevia]);

  useEffect(() => {
    const preview = ingresarCajas.data.vistaPrevia;
    console.log(preview);

    if (!preview || _.isEmpty(preview)) return;

    if ('inclusiones' in preview[0]) {
      const previewDocumento: VistaPreviaCajaDocumento[] = preview as VistaPreviaCajaDocumento[];

      let columns: ColumnTypeEx<ContenidoCaja>[] = previewDocumento[0].inclusiones.map((preview, index) => {
        const title = splitStringByWords(preview.descripcion.split('Inclusion')[1])?.join(' ');

        return {
          id: preview.descripcion,
          title,
          width: columnsConfig.width,
          sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
        } as ColumnTypeEx<ContenidoCaja>;
      });

      columns = [documentColumn, ...columns];

      setColumns(columns);
    } else if ('idPlantilla' in preview[0]) {
      const previewDetale: VistaPreviaCajaDetalle[] = preview as VistaPreviaCajaDetalle[];

      const columns: ColumnTypeEx<ContenidoCaja>[] = previewDetale.map((preview) => {
        return {
          id: preview.id,
          title: preview.titulo,
        } as ColumnTypeEx<ContenidoCaja>;
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

    const fieldsToReset = ['tipoContenido', 'tipoPlantilla', 'fechaContenido', 'descripcion', 'restringida'];
    form.resetFields(fieldsToReset);

    dispatch(setInputs({ tipoCaja }));
    dispatch(setUI({ selectTipoContenido: { visible: true } }));
    dispatch(fetchTiposContenido({ data: tipoCaja }));
  };

  const handleTipoContenido = (fieldValue: any) => {
    const tipoContenido: Filtro = form.getFieldsValue().tipoContenido!;
    const { label } = tipoContenido;

    // Se debe cambiar el servicio tipoDeContenido para que devuelva un objeto {id: number, descripcion: string}
    if (label === CAJA_ETIQUETA) tipoContenido.value = 0;
    else if (label === CAJA_DETALLE) tipoContenido.value = 1;
    else if (label === CAJA_DOCUMENTO) tipoContenido.value = 2;

    const fieldsToReset = ['tipoPlantilla', 'fechaContenido', 'descripcion', 'restringida'];
    form.resetFields(fieldsToReset);

    const { tipoCaja } = ingresarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido }));

    if (label === CAJA_DETALLE) {
      dispatch(
        setUI({
          ...ingresarCajas.ui,
          selectTipoPlantilla: { visible: true },
          datePickerFechaContenido: { visible: false },
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
          datePickerFechaContenido: { visible: true },
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
          datePickerFechaContenido: { visible: false },
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

    const { tipoCaja, tipoContenido, fechaContenido } = ingresarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido, tipoPlantilla, fechaContenido }));
    dispatch(
      setUI({
        ...ingresarCajas.ui,
        datePickerFechaContenido: { visible: true },
        vistaPrevia: { visible: true },
      }),
    );
  };

  const handleFechaContenido = (fieldValue: any) => {
    const fechaContenido = fieldValue ? (fieldValue as moment.Moment[]).map((f) => f.toISOString()) : null;
    const { tipoCaja, tipoContenido, tipoPlantilla } = ingresarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido, tipoPlantilla, fechaContenido }));
    dispatch(
      setUI({
        ...ingresarCajas.ui,
        labelFechaVencimiento: { visible: true },
        inputDescripcion: { visible: true },
        checkboxRestringida: { visible: true },
        buttonCrear: { visible: true },
      }),
    );
    if (fechaContenido) dispatch(fetchAñosVencimiento({ data: { tipoCaja, tipoContenido } }));
  };

  const handleForm = () => {
    const descripcion = form.getFieldsValue().descripcion;
    const restringida = form.getFieldsValue().restringida ? 1 : 0;
    const inputs = { ...ingresarCajas.inputs, descripcion, restringida };
    dispatch(setInputs(inputs));
    dispatch(saveCaja({ data: inputs }))
      .then(unwrapResult)
      .then((id) => {
        goTo(`/editar-caja/${id}`);
        message.success(Texts.SAVE_BOX_SUCCESS);
      })
      .catch((err) => {
        message.error(Texts.SAVE_BOX_FAILURE);
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
        <Form.Item label={Texts.BOX_TYPE} name={'tipoCaja'} rules={reglas['tipoCaja']} required>
          <Select
            labelInValue
            loading={ingresarCajas.loading.tiposCaja}
            placeholder={Texts.SELECT_BOX_TYPE}
            disabled={ingresarCajas.loading.tiposCaja}
            onChange={handleTipoCaja}>
            {renderOptions(ingresarCajas.data.tiposCaja)}
          </Select>
        </Form.Item>

        {ingresarCajas.ui?.selectTipoContenido?.visible && (
          <Form.Item label={Texts.CONTENT_TYPE} name={'tipoContenido'} rules={reglas['tipoContenido']} required>
            <Select
              labelInValue
              loading={ingresarCajas.loading.tiposContenido}
              placeholder={Texts.SELECT_CONTENT_TYPE}
              optionFilterProp="children"
              filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              disabled={ingresarCajas.loading.tiposContenido}
              onChange={handleTipoContenido}>
              {renderOptions(ingresarCajas.data.tiposContenido)}
            </Select>
          </Form.Item>
        )}

        {ingresarCajas.ui?.selectTipoPlantilla?.visible && (
          <Form.Item label={Texts.TEMPLATE} name={'tipoPlantilla'} rules={reglas['tipoPlantilla']} required>
            <Select
              labelInValue
              loading={ingresarCajas.loading.tiposPlantilla}
              placeholder={Texts.SELECT_TEMPLATE}
              optionFilterProp="children"
              disabled={ingresarCajas.loading.tiposPlantilla}
              onChange={handleTipoPlantilla}>
              {renderOptions(ingresarCajas.data.tiposPlantilla)}
            </Select>
          </Form.Item>
        )}

        {ingresarCajas.ui?.datePickerFechaContenido?.visible && (
          <Form.Item label={Texts.CONTENT_DATE} name={'fechaContenido'} rules={reglas['fechaContenido']} required>
            <RangePicker
              style={{ width: '100%' }}
              format={DATE_DD_MM_YYYY_FORMAT}
              ranges={{
                Hoy: [moment(), moment()],
                [`1 ${Texts.MONTH}`]: [moment(), moment().add(1, 'month')],
                [`3 ${Texts.MONTHS}`]: [moment(), moment().add(3, 'month')],
                [`6 ${Texts.MONTHS}`]: [moment(), moment().add(6, 'month')],
                [`1 ${Texts.YEAR}`]: [moment(), moment().add(1, 'year')],
              }}
              allowClear
              onChange={handleFechaContenido}
            />
          </Form.Item>
        )}

        {ingresarCajas.ui?.labelFechaVencimiento?.visible &&
          (ingresarCajas.inputs.fechaContenido || ingresarCajas.loading.añosVencimiento) && (
            <Form.Item name={'fechaContenido'} wrapperCol={{ offset: layout.labelCol.span }}>
              {ingresarCajas.loading.añosVencimiento ? (
                <Loading text={Texts.GET_EXPIRATION_DATE} />
              ) : (
                <Text strong>{`${Texts.EXPIRATION_DATE}:  ${moment(ingresarCajas.inputs.fechaContenido![1])
                  .add(ingresarCajas.data.añosVencimiento, 'year')
                  .format(DATE_DD_MM_YYYY_FORMAT)}`}</Text>
              )}
            </Form.Item>
          )}

        {ingresarCajas.ui?.inputDescripcion?.visible && (
          <Form.Item label={Texts.DESCRIPTION} name={'descripcion'}>
            <TextArea placeholder={Texts.INSERT_DESCRIPTION} autoSize={{ minRows: 4, maxRows: 4 }} />
          </Form.Item>
        )}

        {ingresarCajas.ui?.checkboxRestringida?.visible && (
          <Form.Item label={Texts.RESTRICT} name={'restringida'} valuePropName="checked">
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
    );
  };

  const loadingContent = ingresarCajas.loading.tiposCaja;

  return (
    <Wrapper contentWrapper unselectable direction="column" horizontal="center" style={{ minWidth: loadingContent ? '100%' : 1315 }}>
      {loadingContent ? (
        <LoadingContent />
      ) : (
        <>
          <ContentHeaderWithCart />
          <Row justify="center" style={{ width: '100%', height: '100%' }}>
            <Col span={layout.labelCol.span}>{renderForm()}</Col>
            <Col span={1}>
              {ingresarCajas.ui.vistaPrevia && <Divider style={{ height: '100%', marginLeft: 20, marginRight: 20 }} type="vertical" />}
            </Col>
            <Col span={layout.wrapperCol.span}>{ingresarCajas.ui?.vistaPrevia?.visible && renderPreview()}</Col>
          </Row>
        </>
      )}
    </Wrapper>
  );
};
