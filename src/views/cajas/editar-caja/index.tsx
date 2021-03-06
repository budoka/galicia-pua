import { unwrapResult } from '@reduxjs/toolkit';
import { ClearOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Empty,
  Form,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { ColProps } from 'antd/lib/col';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import { LabeledValue } from 'antd/lib/select';
import _ from 'lodash';
import moment from 'moment';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ContentHeaderWithCart } from 'src/components/content-header';
import { ListCard } from 'src/components/list-card';
import { IListCardItem } from 'src/components/list-card/interfaces';
import { Loading, LoadingContent } from 'src/components/loading';
import { NotFound } from 'src/components/not-found';
import { TableAction, ColumnTypeEx, Table } from 'src/components/table';
import { Wrapper } from 'src/components/wrapper';
import { CAJA_DETALLE, CAJA_DOCUMENTO, CAJA_ETIQUETA, DATETIME_HH_MM_SS_FORMAT, DATE_DD_MM_YYYY_FORMAT } from 'src/constants/constants';
import { Texts } from 'src/constants/texts';
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
  setInfo,
  setInputs,
  setUI,
  updateCaja,
} from 'src/features/cajas/editar-caja/editar-caja.slice';
import {
  CajaDocumento,
  CajaEtiqueta,
  ContenidoCaja,
  FechaContenido,
  Filtro,
  Inputs,
  TiposCaja,
  TiposContenido,
  TiposPlantilla,
  VistaPreviaCajaDetalle,
  VistaPreviaCajaDocumento,
  VistaPreviaCajaEtiqueta,
} from 'src/features/cajas/editar-caja/types';
import { RootState } from 'src/reducers';
import { useAppDispatch } from 'src/store';
import { Rules } from 'src/types';
import { inferPattern, inferType } from 'src/utils/galicia';
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

const columnsConfig = { width: 200 };

export const EditarCaja: React.FC = React.memo((props) => {
  const [form] = useForm<Inputs>();

  const dispatch = useAppDispatch();

  const editarCajas = useSelector((state: RootState) => state.cajas.edicion);

  // pasar a slice
  const [data, setData] = useState<ContenidoCaja[]>([
    { key: 'A', detalle: 'detalle a', fechaCierre: moment('10/12/2020') },
    { key: 'B', idTipoDocumento: 1000, detalle: 'detalle b', fechaCierre: moment('10/12/2022') },
    { key: 'C', idTipoDocumento: 1011, detalle: 'detalle c', fechaCierre: moment('10/12/2022'), fechaDocumental: moment('12/12/2022') },
  ] as CajaDocumento[]);
  const [documentType, setDocumentType] = useState<number>();
  const [editingContent, setEditingContent] = useState<{ action: TableAction; data: ContenidoCaja[]; columnKey?: React.Key }>();

  const [columns, setColumns] = useState<ColumnTypeEx<ContenidoCaja>[]>([]);
  const [list, setList] = useState<CajaEtiqueta[]>([]);

  const { id } = useParams<Record<string, string | undefined>>();

  let documentColumn = {
    key: 'idTipoDocumento',
    dataIndex: 'idTipoDocumento',
    title: 'Documento',
    validationTitle: 'Documento',
    inputType: 'select',
    rules: [{ required: true }],
    editable: true,
    width: columnsConfig.width,
    align: 'center',
    sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
    onSelectChange: (value, option) => {
      console.log(value);
      const preview = editarCajas.data.vistaPrevia;
      const previewDocumento: VistaPreviaCajaDocumento[] = preview as VistaPreviaCajaDocumento[];
      const documentType = previewDocumento.findIndex((doc) => doc.id === value);
      console.log(documentType);
      setDocumentType(documentType);
    },
  } as ColumnTypeEx<ContenidoCaja>;

  // useEffects

  useEffect(() => {
    console.log(documentType);
  }, [documentType]);

  useEffect(() => {
    dispatch(loading(true));
    dispatch(fetchInfoCaja({ data: id! }));
    /*  (async () => {
      await dispatch(fetchInfoCaja(id!));
    })(); */
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    // Loading data
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

      // Display table

      // Fetch Lists and set inputs
      (async () => {
        let inputs: Inputs = {};
        // Fetch Tipo Caja
        await dispatch(fetchTiposCaja()).then(async (action) => {
          const tiposCaja = action.payload as TiposCaja;
          const tipoCaja = tiposCaja.find((t) => t.value === editarCajas.data.caja?.idTipoCaja);
          inputs = { tipoCaja };
          // Fetch Tipo Contenido
          await dispatch(fetchTiposContenido({ data: tipoCaja as Filtro })).then(async (action) => {
            const tiposContenido = action.payload as TiposContenido;
            const tipoContenido = tiposContenido.find((t) => t.value === editarCajas.data.caja?.tipoContenido);
            inputs = { ...inputs, tipoContenido };
            // Fetch Tipo Plantilla
            if (tipoContenido?.value === 1) {
              await dispatch(fetchTiposPlantilla()).then((action) => {
                const tiposPlantilla = action.payload as TiposPlantilla;
                const tipoPlantilla = tiposPlantilla?.find((t) => t.value === editarCajas.data.caja?.idPlantilla);
                inputs = { ...inputs, tipoPlantilla };
              });
            }

            const { fechaDesde, fechaHasta, descripcion, restringida } = editarCajas.data.caja!;
            const fechaContenido = fechaDesde ? [fechaDesde!, fechaHasta!] : null;
            const fechaContenidoMoment: FechaContenido = fechaContenido?.map((f) => moment(f))!;

            if (fechaContenido) dispatch(fetchAñosVencimiento({ data: { tipoCaja, tipoContenido } }));

            dispatch(setInputs({ ...inputs, fechaContenido, descripcion, restringida }));
            form.setFieldsValue({ ...inputs, fechaContenido: fechaContenidoMoment, descripcion, restringida });
            dispatch(
              setUI({
                selectTipoContenido: { visible: true },
                selectTipoPlantilla: { visible: !!inputs.tipoPlantilla },
                datePickerFechaContenido: { visible: !!fechaContenido },
                labelFechaVencimiento: { visible: true },
                inputDescripcion: { visible: true },
                checkboxRestringida: { visible: true },
                buttonCrear: { visible: true },
                // vistaPrevia: { visible: true },
                vistaContenido: { visible: true },
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
    if (editarCajas.ui.vistaPrevia?.visible || editarCajas.ui.vistaContenido?.visible)
      dispatch(fetchVistaPrevia({ data: { tipoCaja, tipoContenido, tipoPlantilla } }));
  }, [editarCajas.ui.vistaPrevia, editarCajas.ui.vistaContenido]);

  useEffect(() => {
    // Actualizar columnas de la tabla
    console.log('useEffect --- ' + documentType);
    const preview = editarCajas.data.vistaPrevia;

    if (!preview || _.isEmpty(preview)) return;

    // console.log(preview);

    //const isEditing = editarCajas.ui.vistaContenido;
    const documentIndex = documentType ?? 0;

    if ('inclusiones' in preview[documentIndex]) {
      const previewDocumento: VistaPreviaCajaDocumento[] = preview as VistaPreviaCajaDocumento[];
      console.log(previewDocumento);

      let columns: ColumnTypeEx<ContenidoCaja>[] = previewDocumento[documentIndex].inclusiones.map((preview, index) => {
        const description = preview.descripcion.split('Inclusion')[1];
        const title = splitStringByWords(description)?.join(' ');
        const key = _.camelCase(description);
        console.log(preview);

        const isChangingContent = editingContent?.action === 'adding' || editingContent?.action === 'editing';

        return {
          key,
          dataIndex: key,
          title:
            isChangingContent && preview.requerido === 'R' ? (
              <Badge size="small" count={'R'} offset={[10, 0]}>
                {title}
              </Badge>
            ) : (
              title
            ),
          validationTitle: title,
          inputType: inferType(preview.tipoDato),
          rules: isChangingContent ? [{ required: preview.requerido === 'R', pattern: inferPattern(preview.tipoDato) }] : undefined,
          editable: true,
          width: columnsConfig.width,
          //required: !preview.requerido,
          //length: preview.longitud,
          //order: preview.orden,
          align: 'center',
          sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
        } as ColumnTypeEx<ContenidoCaja>;
      });

      const documents = previewDocumento.map((doc) => {
        return { value: doc.id, label: doc.descripcion } as LabeledValue;
      });

      documentColumn = { ...documentColumn, options: documents, width: editarCajas.ui.vistaContenido ? 300 : columnsConfig.width };

      columns = [documentColumn, ...columns];

      setColumns(columns);
    } else if ('idPlantilla' in preview[0]) {
      const previewDetale: VistaPreviaCajaDetalle[] = preview as VistaPreviaCajaDetalle[];

      const columns: ColumnTypeEx<ContenidoCaja>[] = previewDetale.map((preview) => {
        return {
          key: preview.id,
          title: preview.titulo,
          /*  dataType: preview.tipo,
          rules: [{ required: !preview.opcional, len: preview.longitud }],
          order: preview.orden,
          sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 }, */
        } as ColumnTypeEx<ContenidoCaja>;
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
          // id: preview.id,
          idEtiqueta: preview.id,
          descripcion: preview.descripcion,
        };
      });

      setList(data);
    }
  }, [editarCajas.data.vistaPrevia, documentType]);

  useEffect(() => {
    // Validacions (Rules) dinámicas para Caja Documento
    // Si no se está editando entonces el tipo documental es 'undefined'.
    if (editingContent?.action === 'idle') {
      setDocumentType(undefined);
      return;
    }

    const preview = editarCajas.data.vistaPrevia;

    if (!preview || _.isEmpty(preview)) return;

    if (editingContent?.action === 'editing' && 'inclusiones' in preview[0]) {
      console.log(editingContent);
      const { data, columnKey } = editingContent;
      const value = data.find((row) => (row as CajaDocumento).key === columnKey)?.idTipoDocumento;
      console.log(value);
      if (value) {
        const previewDocumento: VistaPreviaCajaDocumento[] = preview as VistaPreviaCajaDocumento[];
        const documentType = previewDocumento.findIndex((doc) => doc.id === value);
        console.log(documentType);
        setDocumentType(documentType);
      }
    }
  }, [editingContent]);

  useEffect(() => {
    console.table(columns);
  }, [columns]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    const content = editarCajas.data.caja?.contenido;
    console.log(content);

    // if (!content || _.isEmpty(content) || _.isEmpty(columns)) return;
    // setData([{ key: 1, dniCuitTitular: 'asd', nombreTitular: 'asd' }]);
  }, [editarCajas.data.vistaPrevia]);

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

    const { tipoCaja } = editarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido }));

    if (label === CAJA_DETALLE) {
      dispatch(
        setUI({
          ...editarCajas.ui,
          selectTipoPlantilla: { visible: true },
          datePickerFechaContenido: { visible: false },
          inputDescripcion: { visible: false },
          checkboxRestringida: { visible: false },
          vistaPrevia: { visible: false },
          vistaContenido: { visible: false },
          buttonCrear: { visible: false },
        }),
      );
      dispatch(fetchTiposPlantilla());
    } else if (label === CAJA_ETIQUETA) {
      dispatch(
        setUI({
          ...editarCajas.ui,
          selectTipoPlantilla: { visible: false },
          datePickerFechaContenido: { visible: true },
          inputDescripcion: { visible: false },
          checkboxRestringida: { visible: false },
          vistaPrevia: { visible: true },
          vistaContenido: { visible: false },
          buttonCrear: { visible: false },
        }),
      );
    } else if (label === CAJA_DOCUMENTO) {
      dispatch(
        setUI({
          ...editarCajas.ui,
          selectTipoPlantilla: { visible: false },
          datePickerFechaContenido: { visible: false },
          inputDescripcion: { visible: true },
          checkboxRestringida: { visible: true },
          vistaPrevia: { visible: true },
          vistaContenido: { visible: false },
          buttonCrear: { visible: true },
        }),
      );
    }
  };

  const handleTipoPlantilla = (fieldValue: any) => {
    const tipoPlantilla: Filtro = form.getFieldsValue().tipoPlantilla!;

    const { tipoCaja, tipoContenido, fechaContenido } = editarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido, tipoPlantilla, fechaContenido }));
    dispatch(
      setUI({
        ...editarCajas.ui,
        datePickerFechaContenido: { visible: true },
        vistaPrevia: { visible: true },
        vistaContenido: { visible: false },
      }),
    );
  };

  const handleFechaContenido = (fieldValue: any) => {
    const fechaContenido = fieldValue ? (fieldValue as moment.Moment[]).map((f) => f.toISOString()) : null;
    const { tipoCaja, tipoContenido, tipoPlantilla } = editarCajas.inputs;
    dispatch(setInputs({ tipoCaja, tipoContenido, tipoPlantilla, fechaContenido }));
    dispatch(
      setUI({
        ...editarCajas.ui,
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
    const inputs = { ...editarCajas.inputs, descripcion, restringida };
    dispatch(setInputs(inputs));

    dispatch(updateCaja({ data: inputs }))
      .then(unwrapResult)
      .then(() => {
        dispatch(setUI({ ...editarCajas.ui, vistaContenido: { visible: true }, vistaPrevia: { visible: false } }));
        message.success(Texts.UPDATE_BOX_SUCCESS);
      })
      .catch(() => message.error(Texts.UPDATE_BOX_FAILURE));
  };

  const handleReset = () => {
    form.resetFields();
    dispatch(clearUI());
    dispatch(clearInputs());
  };

  const onDataChange = (data: any[]) => {
    console.log('onDataChange ....');
    setData(data);
  };

  const onActionChange = (action: TableAction, data: ContenidoCaja[], columnKey?: React.Key) => {
    // console.log('onActionChange ....', action, data, columnKey);
    setEditingContent({ action, data, columnKey });
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
    const hasContent = data.length > 0;

    return (
      <Form {...layout} className={styles.form} form={form} name="ingresarCaja" onFinish={handleForm}>
        <Form.Item label={Texts.BOX_TYPE} name={'tipoCaja'} rules={reglas['tipoCaja']} required>
          <Select
            labelInValue
            loading={editarCajas.loading.tiposCaja}
            placeholder={Texts.SELECT_BOX_TYPE}
            disabled={editarCajas.loading.tiposCaja || hasContent}
            onChange={handleTipoCaja}>
            {renderOptions(editarCajas.data.tiposCaja)}
          </Select>
        </Form.Item>

        {editarCajas.ui?.selectTipoContenido?.visible && (
          <Form.Item label={Texts.CONTENT_TYPE} name={'tipoContenido'} rules={reglas['tipoContenido']} required>
            <Select
              labelInValue
              loading={editarCajas.loading.tiposContenido}
              placeholder={Texts.SELECT_CONTENT_TYPE}
              optionFilterProp="children"
              filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              disabled={editarCajas.loading.tiposContenido || hasContent}
              onChange={handleTipoContenido}>
              {renderOptions(editarCajas.data.tiposContenido)}
            </Select>
          </Form.Item>
        )}

        {editarCajas.ui?.selectTipoPlantilla?.visible && (
          <Form.Item label={Texts.TEMPLATE} name={'tipoPlantilla'} rules={reglas['tipoPlantilla']} required>
            <Select
              labelInValue
              loading={editarCajas.loading.tiposPlantilla}
              placeholder={Texts.SELECT_TEMPLATE}
              optionFilterProp="children"
              disabled={editarCajas.loading.tiposPlantilla || hasContent}
              onChange={handleTipoPlantilla}>
              {renderOptions(editarCajas.data.tiposPlantilla)}
            </Select>
          </Form.Item>
        )}

        {editarCajas.ui?.datePickerFechaContenido?.visible && (
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

        {editarCajas.ui?.labelFechaVencimiento?.visible && (editarCajas.inputs.fechaContenido || editarCajas.loading.añosVencimiento) && (
          <Form.Item name={'fechaContenido'} wrapperCol={{ offset: layout.labelCol.span }}>
            {editarCajas.loading.añosVencimiento ? (
              <Loading text={Texts.GET_EXPIRATION_DATE} />
            ) : (
              <Text strong>{`${Texts.EXPIRATION_DATE}: ${moment(editarCajas.inputs.fechaContenido![1])
                .add(editarCajas.data.añosVencimiento, 'year')
                .format(DATE_DD_MM_YYYY_FORMAT)}`}</Text>
            )}
          </Form.Item>
        )}

        {editarCajas.ui?.inputDescripcion?.visible && (
          <Form.Item label={Texts.DESCRIPTION} name={'descripcion'}>
            <TextArea placeholder={Texts.INSERT_DESCRIPTION} autoSize={{ minRows: 4, maxRows: 4 }} />
          </Form.Item>
        )}

        {editarCajas.ui?.checkboxRestringida?.visible && (
          <Form.Item label={Texts.RESTRICT} name={'restringida'} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        )}

        {editarCajas.ui?.buttonCrear?.visible && (
          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                {Texts.UPDATE}
              </Button>
              <Popconfirm
                placement="rightBottom"
                disabled={hasContent}
                title={Texts.CLEAN_FIELDS}
                okText={Texts.YES}
                cancelText={Texts.NO}
                onConfirm={handleReset}>
                <Button type="default" htmlType="button" disabled={hasContent} icon={<ClearOutlined />}>
                  {Texts.CLEAN}
                </Button>
              </Popconfirm>
            </Space>
          </Form.Item>
        )}
      </Form>
    );
  };

  const renderInfo = () => {
    return (
      <Descriptions /* title="User Info"  */ column={2} bordered>
        <Descriptions.Item label={Texts.BOX}>{editarCajas.info.caja}</Descriptions.Item>
        <Descriptions.Item label={Texts.STATUS}>
          {editarCajas.info.estado && splitStringByWords(editarCajas.info.estado)?.join(' ')}
        </Descriptions.Item>
        <Descriptions.Item label={Texts.USER}>
          {editarCajas.info.usuario?.nombre}
          <br />
          {`(${editarCajas.info.usuario?.legajo})`}
        </Descriptions.Item>
        <Descriptions.Item label={Texts.SECTOR}>
          {editarCajas.info.sector?.nombre}
          <br />
          {`(${editarCajas.info.sector?.id})`}
        </Descriptions.Item>
        <Descriptions.Item label={Texts.CREATION_DATE}>
          {moment(editarCajas.info.fechaGeneracion).format(DATETIME_HH_MM_SS_FORMAT)}
        </Descriptions.Item>
        <Descriptions.Item label={Texts.MODIFICATION_DATE}>
          {moment(editarCajas.info.fechaModificacion).format(DATETIME_HH_MM_SS_FORMAT)}
        </Descriptions.Item>
        <Descriptions.Item label={Texts.EXPIRATION_DATE}>
          {editarCajas.info.fechaVencimiento ? moment(editarCajas.info.fechaVencimiento).format(DATE_DD_MM_YYYY_FORMAT) : Texts.NA}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const renderPreview = () => {
    return (
      <Wrapper contentBody direction="row" horizontal="center">
        {editarCajas.inputs.tipoContenido?.label === CAJA_ETIQUETA ? (
          <ListCard
            scrollHeight={326}
            className={styles.previewList}
            hoverable={false}
            header={Texts.LABELS}
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
            locale={{ emptyText: <Empty description={Texts.PREVIEW} /> }}
            onChange={() => {
              console.log('*********************');
            }}
          />
        )}
      </Wrapper>
    );
  };

  const renderEditableContent = () => {
    return (
      <Wrapper contentBody direction="row" horizontal="center">
        {editarCajas.inputs.tipoContenido?.label === CAJA_ETIQUETA ? (
          <ListCard
            scrollHeight={326}
            className={styles.previewList}
            hoverable={false}
            header={Texts.LABELS}
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
            // fill={true}

            columns={columns as ColumnsType<ContenidoCaja>}
            dataSource={data}
            loading={editarCajas.loading.vistaPrevia}
            onDataChange={onDataChange}
            onActionChange={onActionChange}
            extraColumns={{ showKeyColumn: true, showActionsColumn: true }}
            extraComponents={[
              {
                key: 'add',
                node: 'add-button',
                position: 'top',
              },
              {
                key: 'delete',
                node: 'delete-button',
                position: 'top',
              },
              /*   {
                key: 'refresh',
                node: 'refresh-button',
                position: 'top',
              }, */
              {
                key: 'records-count-tag',
                node: 'records-count-tag',
                position: 'top',
                style: { marginLeft: 'auto' },
              },
            ]}
          />
        )}
      </Wrapper>
    );
  };

  const loadingContent = _.isEmpty(editarCajas.loading) || editarCajas.loading.datos;

  return (
    <>
      <Wrapper
        contentWrapper
        unselectable
        direction="column"
        horizontal="center"
        style={{ minWidth: loadingContent || editarCajas.ui.notFound || editarCajas.ui.unavailable ? '100%' : 1460 }}>
        {loadingContent ? (
          <LoadingContent />
        ) : editarCajas.ui.notFound ? (
          <NotFound />
        ) : editarCajas.ui.unavailable ? (
          <NotFound />
        ) : (
          <>
            <ContentHeaderWithCart />
            <Row justify="center" style={{ width: '100%', height: '100%' }}>
              <Col span={layout.labelCol.span}>{renderForm()}</Col>
              <Col span={1}>
                <Divider style={{ height: '100%', marginLeft: 20, marginRight: 20 }} type="vertical" />
              </Col>
              <Col span={layout.wrapperCol.span}>{renderInfo()}</Col>
            </Row>

            <Divider />

            <Row justify="center" style={{ width: '100%', height: '100%' }}>
              <Col span={20}>
                <Wrapper contentBody>
                  {editarCajas.ui?.vistaPrevia?.visible && renderPreview()}
                  {editarCajas.ui?.vistaContenido?.visible && renderEditableContent()}
                </Wrapper>
              </Col>
            </Row>
          </>
        )}
      </Wrapper>
    </>
  );
});
