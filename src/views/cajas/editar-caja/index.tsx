import { Badge, Button, Checkbox, Col, DatePicker, Descriptions, Divider, Empty, Form, message, Row, Select, Typography } from 'antd';
import { ColProps } from 'antd/lib/col';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import moment from 'moment';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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
  fetchInfoCaja,
  fetchTiposCaja,
  fetchTiposContenido,
  fetchTiposPlantilla,
  fetchVistaPrevia,
  loading,
  updateCaja,
  setInputs,
  setUI,
  setInfo,
} from 'src/features/editar-caja/editar-caja.slice';
import {
  FechaVigencia,
  Filtro,
  Inputs,
  TiposCaja,
  TiposContenido,
  TiposPlantilla,
  VistaPreviaCajaDetalle,
  VistaPreviaCajaDocumento,
  VistaPreviaCajaEtiqueta,
} from 'src/features/editar-caja/types';
import { RootState } from 'src/reducers';
import { useAppDispatch } from 'src/store';
import { Reglas } from 'src/types';
import { goTo } from 'src/utils/history';
import { compare, splitStringByWords } from 'src/utils/string';
import { NotFound } from 'src/components/not-found';
import styles from './style.module.less';
import dayjs from 'dayjs';

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
    span: 9,
  } as ColProps,
  wrapperCol: {
    span: 15,
  } as ColProps,
};

const tailLayout = {
  wrapperCol: { offset: layout.labelCol.span, span: layout.wrapperCol.span },
};

export const EditarCaja: React.FC = React.memo((props) => {
  const [form] = useForm<Inputs>();

  const dispatch = useAppDispatch();

  const editarCajas = useSelector((state: RootState) => state.editarCajas);

  const [columns, setColumns] = useState<IColumn<ContenidoCaja>[]>([]);
  const [list, setList] = useState<CajaEtiqueta[]>([]);

  const { id } = useParams<Record<string, string | undefined>>();

  // useEffects

  useEffect(() => {
    dispatch(loading(true));
    dispatch(fetchInfoCaja(id!));
    /*  (async () => {
      await dispatch(fetchInfoCaja(id!));
    })(); */
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (editarCajas.data.caja) {
      const {
        id,
        estado,
        nombre,
        legajo,
        nombreSector,
        idSectorOrigen,
        fechaGeneracion,
        fechaUltimaTransicion: fechaModificacion,
        fechaVencimiento,
      } = editarCajas.data.caja;
      dispatch(
        setInfo({
          caja: id,
          estado,
          usuario: { nombre, legajo },
          sector: { nombre: nombreSector, id: idSectorOrigen },
          fechaGeneracion,
          fechaModificacion,
          fechaVencimiento,
        }),
      );
      (async () => {
        let inputs: Inputs = {};
        // Fetch Tipo Caja
        await dispatch(fetchTiposCaja()).then(async (action) => {
          const tiposCaja = action.payload as TiposCaja;
          const tipoCaja = tiposCaja.find((t) => t.value === editarCajas.data.caja?.idTipoCaja);
          inputs = { tipoCaja };
          // Fetch Tipo Contenido
          await dispatch(fetchTiposContenido(tipoCaja as Filtro)).then(async (action) => {
            const tiposContenido = action.payload as TiposContenido;
            const tipoContenido = tiposContenido.find((t) => t.value === editarCajas.data.caja?.tipoContenido);
            inputs = { ...inputs, tipoContenido };
            // Fetch Tipo Plantilla
            if (tipoContenido?.value === 1) {
              await dispatch(fetchTiposPlantilla()).then((action) => {
                const tiposPlantilla = action.payload as TiposPlantilla;
                console.log(tiposPlantilla);
                const tipoPlantilla = tiposPlantilla?.find((t) => t.value === editarCajas.data.caja?.idPlantilla);
                inputs = { ...inputs, tipoPlantilla };
              });
            }

            const { fechaDesde, fechaHasta, descripcion, restringida } = editarCajas.data.caja!;
            const fechaVigencia = fechaDesde ? [fechaDesde!, fechaHasta!] : null;
            const fechaVigenciaMoment: FechaVigencia = fechaVigencia?.map((f) => moment(f))!;

            if (fechaVigencia) dispatch(fetchAñosVencimiento({ tipoCaja, tipoContenido }));

            dispatch(setInputs({ ...inputs, fechaVigencia, descripcion, restringida }));
            form.setFieldsValue({ ...inputs, fechaVigencia: fechaVigenciaMoment, descripcion, restringida });
            dispatch(
              setUI({
                selectTipoContenido: { visible: true },
                selectTipoPlantilla: { visible: !!inputs.tipoPlantilla },
                datePickerFechaVigencia: { visible: !!fechaVigencia },
                labelFechaVencimiento: { visible: true },
                inputDescripcion: { visible: true },
                checkboxRestringida: { visible: true },
                buttonCrear: { visible: true },
              }),
            );
            dispatch(loading(false));
          });
        });
      })();
    }
  }, [editarCajas.data.caja]);

  useEffect(() => {
    const { tipoCaja, tipoContenido, tipoPlantilla } = editarCajas.inputs;
    if (editarCajas.ui.vistaPrevia?.visible) dispatch(fetchVistaPrevia({ tipoCaja, tipoContenido, tipoPlantilla }));
  }, [editarCajas.ui.vistaPrevia]);

  useEffect(() => {
    const preview = editarCajas.data.vistaPrevia;

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
  }, [editarCajas.data.vistaPrevia]);

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

    const { tipoCaja } = editarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido }));

    if (label === CAJA_DETALLE) {
      dispatch(
        setUI({
          ...editarCajas.ui,
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
          ...editarCajas.ui,
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
          ...editarCajas.ui,
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

    const { tipoCaja, tipoContenido, fechaVigencia } = editarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido, tipoPlantilla, fechaVigencia }));
    dispatch(
      setUI({
        ...editarCajas.ui,
        datePickerFechaVigencia: { visible: true },
        vistaPrevia: { visible: true },
      }),
    );
  };

  const handleFechaVigencia = (fieldValue: any) => {
    const fechaVigencia = fieldValue ? (fieldValue as moment.Moment[]).map((f) => f.toISOString()) : null;
    const { tipoCaja, tipoContenido, tipoPlantilla } = editarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido, tipoPlantilla, fechaVigencia }));
    dispatch(
      setUI({
        ...editarCajas.ui,
        labelFechaVencimiento: { visible: true },
        inputDescripcion: { visible: true },
        checkboxRestringida: { visible: true },
        buttonCrear: { visible: true },
      }),
    );
    if (fechaVigencia) dispatch(fetchAñosVencimiento({ tipoCaja, tipoContenido }));
  };

  const handleForm = () => {
    console.log('modificando caja');

    const descripcion = form.getFieldsValue().descripcion;
    const restringida = form.getFieldsValue().restringida ? 1 : 0;
    const inputs = { ...editarCajas.inputs, descripcion, restringida };
    dispatch(setInputs(inputs));
    dispatch(updateCaja(inputs))
      .then(() => {
        message.success('Caja modificada correctamente.');
      })
      .catch((err) => {
        message.error('Error al modificar la caja.');
      });
  };

  const handleReset = () => {
    form.resetFields();
    dispatch(clearUI());
    dispatch(clearInputs());
  };

  // helpers

  /* const getFechaVencimiento = () => {
    if(!editarCajas.data.caja?.fechaVencimiento) return 'N/A';
    return moment()
  } */

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
            loading={editarCajas.loading.tiposCaja}
            placeholder="Seleccione un tipo de caja"
            disabled={editarCajas.loading.tiposCaja}
            onChange={handleTipoCaja}>
            {renderOptions(editarCajas.data.tiposCaja)}
          </Select>
        </Form.Item>

        {editarCajas.ui?.selectTipoContenido?.visible && (
          <Form.Item label={'Tipo de Contenido'} name={'tipoContenido'} rules={reglas['tipoContenido']} required>
            <Select
              labelInValue
              loading={editarCajas.loading.tiposContenido}
              placeholder="Seleccione un tipo de contenido"
              optionFilterProp="children"
              filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              disabled={editarCajas.loading.tiposContenido}
              onChange={handleTipoContenido}>
              {renderOptions(editarCajas.data.tiposContenido)}
            </Select>
          </Form.Item>
        )}

        {editarCajas.ui?.selectTipoPlantilla?.visible && (
          <Form.Item label={'Plantilla'} name={'tipoPlantilla'} rules={reglas['tipoPlantilla']} required>
            <Select
              labelInValue
              loading={editarCajas.loading.tiposPlantilla}
              placeholder="Seleccione una plantilla"
              optionFilterProp="children"
              disabled={editarCajas.loading.tiposPlantilla}
              onChange={handleTipoPlantilla}>
              {renderOptions(editarCajas.data.tiposPlantilla)}
            </Select>
          </Form.Item>
        )}

        {editarCajas.ui?.datePickerFechaVigencia?.visible && (
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

        {editarCajas.ui?.labelFechaVencimiento?.visible && (editarCajas.inputs.fechaVigencia || editarCajas.loading.añosVencimiento) && (
          <Form.Item name={'fechaVigencia'} wrapperCol={{ offset: layout.labelCol.span }}>
            {editarCajas.loading.añosVencimiento ? (
              <Loading text="Calculando fecha de vencimiento" />
            ) : (
              <Text strong>{`Fecha de vencimiento: ${moment(editarCajas.inputs.fechaVigencia![1])
                .add(editarCajas.data.añosVencimiento, 'year')
                .format('DD/MM/YYYY')}`}</Text>
            )}
          </Form.Item>
        )}

        {editarCajas.ui?.inputDescripcion?.visible && (
          <Form.Item label={'Descripción'} name={'descripcion'}>
            <TextArea placeholder="Ingrese una descripción" autoSize={{ minRows: 4, maxRows: 4 }} />
          </Form.Item>
        )}

        {editarCajas.ui?.checkboxRestringida?.visible && (
          <Form.Item label={'Restringir'} name={'restringida'} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        )}

        {editarCajas.ui?.buttonCrear?.visible && (
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Modificar
            </Button>

            <Button type="link" htmlType="button" onClick={handleReset}>
              Limpiar
            </Button>
          </Form.Item>
        )}
      </Form>
    );
  };

  const renderInfo = () => {
    return (
      <Descriptions /* title="User Info"  */ column={2} bordered>
        <Descriptions.Item label="Caja">{editarCajas.info.caja}</Descriptions.Item>
        <Descriptions.Item label="Estado">
          {editarCajas.info.estado && splitStringByWords(editarCajas.info.estado)?.join(' ')}
        </Descriptions.Item>
        <Descriptions.Item label="Usuario">
          {editarCajas.info.usuario?.nombre}
          <br />
          {`(${editarCajas.info.usuario?.legajo})`}
        </Descriptions.Item>
        <Descriptions.Item label="Sector">
          {editarCajas.info.sector?.nombre}
          <br />
          {`(${editarCajas.info.sector?.id})`}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de generación">
          {moment(editarCajas.info.fechaGeneracion).format('DD/MM/YYYY HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de modificación">
          {moment(editarCajas.info.fechaModificacion).format('DD/MM/YYYY HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de vencimiento">
          {editarCajas.info.fechaVencimiento ? moment(editarCajas.info.fechaVencimiento).format('DD/MM/YYYY') : 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const renderInfo2 = () => {
    return (
      <Descriptions /* title="User Info"  */ column={2} bordered>
        <Descriptions.Item label="Caja">{editarCajas.data.caja?.id}</Descriptions.Item>
        <Descriptions.Item label="Estado">{splitStringByWords(editarCajas.data.caja?.estado!)?.join(' ')}</Descriptions.Item>
        <Descriptions.Item label="Usuario">
          {editarCajas.data.caja?.nombre}
          <br />
          {`(${editarCajas.data.caja?.legajo})`}
        </Descriptions.Item>
        <Descriptions.Item label="Sector">
          {editarCajas.data.caja?.nombreSector}
          <br />
          {`(${editarCajas.data.caja?.idSectorOrigen})`}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de generación">
          {moment(editarCajas.data.caja?.fechaGeneracion).format('DD/MM/YYYY HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de modificación">
          {moment(editarCajas.data.caja?.fechaUltimaTransicion).format('DD/MM/YYYY HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de vencimiento">
          {editarCajas.data.caja?.fechaVencimiento ? moment(editarCajas.data.caja?.fechaVencimiento).format('DD/MM/YYYY') : 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const renderPreview = () => {
    return (
      <>
        {!editarCajas.ui?.vistaPrevia?.visible ? undefined : (
          <Wrapper direction="row" horizontal="center">
            {editarCajas.inputs.tipoContenido?.label === CAJA_ETIQUETA ? (
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
                loading={editarCajas.loading.vistaPrevia}
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
    <Wrapper contentWrapper unselectable direction="column" horizontal="center" style={{ minWidth: 1460 }}>
      {_.isEmpty(editarCajas.loading) || editarCajas.loading.datos ? (
        <LoadingContent />
      ) : editarCajas.ui.notFound ? (
        <NotFound />
      ) : editarCajas.ui.unavailable ? (
        <NotFound />
      ) : (
        <>
          <ContentInfo />
          <Row justify="center" style={{ width: '100%', height: '100%' }}>
            <Col span={9}>{renderForm()}</Col>
            <Col>
              <Divider style={{ height: '100%', marginLeft: 20, marginRight: 20 }} type="vertical" />
            </Col>
            <Col span={14}>{renderInfo()}</Col>
          </Row>

          <Divider />

          <Row>
            <Col offset={2} span={20}>
              {renderPreview()}
            </Col>
          </Row>
        </>
      )}
    </Wrapper>
  );
});
