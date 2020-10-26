import { CaretRightOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Select } from 'antd';
import { LabeledValue } from 'antd/lib/select';
import _ from 'lodash';
import { parse } from 'query-string';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  clearPreviewCaja,
  getCaja,
  getPreviewCaja,
  getTiposCaja,
  getTiposContenidoCaja,
  getTiposPlantilla,
  setTipoCajaSeleccionado,
  setTipoContenidoCajaSeleccionado,
  setTipoPlantillaSeleccionado,
} from 'src/actions';
import { Elemento } from 'src/actions/cajas/caja-filtros/interfaces';
import {
  PreviewCajaDetalleResponse,
  PreviewCajaDocumentoResponse,
  PreviewCajaEtiquetaResponse,
} from 'src/actions/cajas/caja-preview/interfaces';
import { CajaEtiqueta, ContenidoCaja } from 'src/actions/cajas/interfaces';
import { EditableTable, IColumn } from 'src/components/editable-table/index.tsx';
import { Wrapper } from 'src/components/wrapper';
import { CAJA_DETALLE } from 'src/constants/constants';
import { RootState } from 'src/reducers';
import { deleteProps } from 'src/utils/object';
import { compare } from 'src/utils/string';
import styles from './style.module.less';

const { Option } = Select;

const _columns = [
  {
    key: 'a',
    dataIndex: 'a',
    title: 'a',
    width: 200,
    minWidth: 50,
    editable: true,
    dataType: 'texto',
    inputType: 'text',
  },
  {
    key: 'b',
    dataIndex: 'b',
    title: 'b',
    width: 200,
    minWidth: 50,
    //   inputType: 'select',
    editable: true,
  } as IColumn<ContenidoCaja>,
  {
    key: 'c',
    dataIndex: 'c',
    title: 'c',
    width: 200,
    minWidth: 50,
    // editable: true,
    //  inputType: 'checkbox',
    editable: true,
  },
  {
    key: 'd',
    dataIndex: 'd',
    title: 'd',
    width: 200,
    minWidth: 50,
    editable: true,
  },
  {
    key: 'e',
    dataIndex: 'e',
    title: 'e',
    width: 200,
    minWidth: 50,
    editable: true,
  },
  {
    key: 'f',
    dataIndex: 'f',
    title: 'f',
    width: 200,
    minWidth: 50,
    editable: true,
  },
  {
    key: 'g',
    dataIndex: 'g',
    title: 'g',
    width: 400,
    minWidth: 50,
    editable: true,
  },
];

const _data = new Array(100).fill('').map((e, i) => {
  return { key: `${i + 1}`, a: 'a', b: 'b' };
}) as any[];

export const Cajas: React.FC = (props) => {
  const dispatch = useDispatch();
  const cajas = useSelector((state: RootState) => state.cajas);

  const history = useHistory();

  const tipoCajaRef = useRef<Select<LabeledValue>>(null);
  const tipoContenidoCajaRef = useRef<Select<LabeledValue>>(null);
  const tipoPlantillaRef = useRef<Select<LabeledValue>>(null);

  const [filtroSeleccionado, setFiltroSeleccionado] = useState<number>(-1); // Es el filtro con focus
  const [columns, setColumns] = useState(_columns);
  const [dataSource, setDataSource] = useState(_data);

  /* useEffect(() => { 
    console.log('rendering');
  });*/

  useEffect(() => console.log('render cajas'));

  // Ocultar pop-up filtro seleccionado.
  useEffect(() => {
    //console.log(cajas.filtros.seleccionado);
  }, [cajas.filtros.seleccionado.tipoCaja]);

  useEffect(() => {
    const idCaja = parse(history.location.search, { parseNumbers: true }).id as number;
    //console.log(idCaja);

    // dispatch(getTiposCaja());
    // dispatch(getCaja(idCaja));
  }, []);

  // Ocultar pop-up filtro seleccionado.
  useEffect(() => {
    resetFiltroSeleccionado();
  }, [cajas.filtros.seleccionado]);

  // Recuperar lista de tipos de contenido de caja.
  useEffect(() => {
    cajas.filtros.seleccionado.tipoCaja && dispatch(getTiposContenidoCaja(cajas.filtros.seleccionado.tipoCaja));
    tipoContenidoCajaRef.current && tipoContenidoCajaRef.current.focus();
  }, [cajas.filtros.seleccionado.tipoCaja]);

  // Recuperar lista de plantillas de detalle.
  useEffect(() => {
    cajas.filtros.seleccionado.tipoContenidoCaja &&
      cajas.filtros.seleccionado.tipoContenidoCaja.descripcion === CAJA_DETALLE &&
      dispatch(getTiposPlantilla(cajas.filtros.seleccionado.tipoContenidoCaja));
    tipoPlantillaRef.current && tipoPlantillaRef.current.focus();
  }, [cajas.filtros.seleccionado.tipoContenidoCaja]);

  // Actualizar plantillas
  useEffect(() => {
    if (
      (cajas.filtros.seleccionado.tipoContenidoCaja && cajas.filtros.seleccionado.tipoContenidoCaja.descripcion !== CAJA_DETALLE) ||
      cajas.filtros.seleccionado.tipoPlantilla
    ) {
      console.log('updatePreview');
      dispatch(getPreviewCaja(cajas.filtros.seleccionado));
    } else if (!_.isEmpty(cajas.preview.preview)) {
      console.log('clearPreviewCaja');
      dispatch(clearPreviewCaja());
    }
  }, [cajas.filtros.seleccionado]);

  useEffect(() => {
    const preview = cajas.preview.preview;

    if (_.isEmpty(preview)) return;

    if ('inclusiones' in preview[0]) {
      const previewDocumento: PreviewCajaDocumentoResponse[] = preview as PreviewCajaDocumentoResponse[];

      const columns: IColumn<ContenidoCaja>[] = previewDocumento[0].inclusiones.map((preview, index) => {
        return {
          id: index,
          title: preview.descripcion,
          dataType: preview.tipoDato,
          required: preview.requerido === 'R',
          /*    required: !preview.opcional,
          length: preview.longitud,
          order: preview.orden,
          align: 'center',*/
          sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
        } as IColumn<ContenidoCaja>;
      });

      setColumns(columns);
      setDataSource([]);
    } else if ('idPlantilla' in preview[0]) {
      const previewDetale: PreviewCajaDetalleResponse[] = preview as PreviewCajaDetalleResponse[];

      const columns: IColumn<ContenidoCaja>[] = previewDetale.map((preview) => {
        return {
          id: preview.id,
          title: preview.titulo,
          dataType: preview.tipo,
          required: !preview.opcional,
          length: preview.longitud,
          order: preview.orden,

          sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
        } as IColumn<ContenidoCaja>;
      });

      setColumns(columns);
      setDataSource([]);
    } else if ('legacy' in preview[0]) {
      const previewEtiqueta: PreviewCajaEtiquetaResponse[] = preview as PreviewCajaEtiquetaResponse[];

      const columns: IColumn<ContenidoCaja>[] = [
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
      ];

      const data: CajaEtiqueta[] = previewEtiqueta.map((preview, index) => {
        const valor = preview.id === 202;
        return {
          key: index,
          id: preview.id,
          idEtiqueta: preview.id,
          etiqueta: preview.descripcion,
          valor,
        };
      });

      setColumns(columns);
      setDataSource(data);
    }
  }, [cajas.preview.preview]);

  useEffect(() => {
    const idCaja = cajas.info.id;
    if (!idCaja) return;
    history.replace(history.location.pathname + '?id=' + idCaja);
  }, [cajas.info.id]);

  const resetFiltroSeleccionado = () => {
    setFiltroSeleccionado(-1);
  };

  function onChangeFilter(value: LabeledValue, option: any, fn: Function) {
    //console.log(value);
    // console.log(option);
    const filtro: Elemento = deleteProps(option, ['key', 'value', 'children']);
    dispatch(fn(filtro));
    resetFiltroSeleccionado();
  }

  const getValue = (filtro: Elemento | null): LabeledValue | undefined => {
    if (filtro) return { key: filtro.id + '', value: filtro.id, label: filtro.descripcion } as LabeledValue;
    else return undefined;
  };

  const createCaja = () => {
    /*  const cajaInfo: CajaInfo = {
      userId: 3,
      sectorId: 1243,
      cajaTypeName: cajas.filtros.seleccionado.cajaType?.key!,
      contentType: cajas.filtros.seleccionado.tipoContenidoCaja?.key!,
      previewId: cajas.filtros.seleccionado.detailTemplate?.key!,
      description: 'test facu react',
      creationDate: dayjs().format('YYYY-MM-DD H:mm:ss.SSS'),
      expirationDate: dayjs().format('YYYY-MM-DD'),
      fromDate: dayjs().format('YYYY-MM-DD'),
      toDate: dayjs().format('YYYY-MM-DD'),
      restricted: false,
    };
    dispatch(saveCaja(cajaInfo));*/
  };

  const renderOptions = (options: Elemento[]) => {
    return options.map((filtro, index) => (
      <Option key={index} value={filtro.descripcion} id={filtro.id} descripcion={filtro.descripcion}>
        {filtro.descripcion}
      </Option>
    ));
  };

  const renderfiltros = () => {
    return (
      <div className={styles.filterWrapper}>
        <Breadcrumb separator={<CaretRightOutlined />}>
          <Breadcrumb.Item>
            <Select
              disabled={!!cajas.info.id}
              dropdownClassName={styles.filterDropdown}
              // dropdownStyle={{ overflowY: 'scroll' }}
              /* onMouseEnter={() => {
                setFiltroSeleccionado(1);
              }}*/
              //open={seleccionadoFilter === 1}
              loading={cajas.filtros.isRunning}
              dropdownMatchSelectWidth={200}
              showArrow={false}
              className={styles.filter}
              labelInValue
              //showSearch
              bordered={false}
              optionLabelProp="label"
              value={getValue(cajas.filtros.seleccionado.tipoCaja)}
              //   options={getOptions(cajas.filtros.filtro.tiposCaja)}
              placeholder={<span className={styles.filterPlacerholder}>Tipo de caja</span>}
              optionFilterProp="children"
              onChange={(value, option) => onChangeFilter(value, option, setTipoCajaSeleccionado)}
              //onChange={onChangeCajaTypeFilter}
              filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              ref={tipoCajaRef}>
              {renderOptions(cajas.filtros.filtro.tiposCaja)}
            </Select>
          </Breadcrumb.Item>
          {cajas.filtros.seleccionado.tipoCaja && (
            <Breadcrumb.Item>
              <Select
                disabled={!!cajas.info.id}
                /* onMouseEnter={() => {
                  setFiltroSeleccionado(2);
                }}*/
                //open={seleccionadoFilter === 2}
                loading={cajas.filtros.isRunning}
                dropdownMatchSelectWidth={200}
                showArrow={false}
                className={styles.filter}
                labelInValue
                //showSearch
                bordered={false}
                optionLabelProp="descripcion"
                value={getValue(cajas.filtros.seleccionado.tipoContenidoCaja)}
                //options={getOptions(cajas.filtros.filtro.tiposContenidoCaja)}
                placeholder={<span className={styles.filterPlacerholder}>Tipo de contenido de caja</span>}
                optionFilterProp="children"
                onChange={(value, option) => onChangeFilter(value, option, setTipoContenidoCajaSeleccionado)}
                //onChange={onChangetipoContenidoCajaFilter}
                filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                ref={tipoContenidoCajaRef}>
                {renderOptions(cajas.filtros.filtro.tiposContenidoCaja)}
              </Select>
            </Breadcrumb.Item>
          )}

          {cajas.filtros.seleccionado.tipoContenidoCaja && cajas.filtros.seleccionado.tipoContenidoCaja.descripcion === CAJA_DETALLE && (
            <Breadcrumb.Item>
              <Select
                disabled={!!cajas.info.id}
                /* onMouseEnter={() => {
                  setFiltroSeleccionado(3);
                }}*/
                // open={seleccionadoFilter === 3}
                loading={cajas.filtros.isRunning}
                dropdownMatchSelectWidth={330}
                showArrow={false}
                className={styles.filter}
                labelInValue
                //showSearch
                bordered={false}
                optionLabelProp="label"
                value={getValue(cajas.filtros.seleccionado.tipoPlantilla)}
                //options={getOptions(cajas.filtros.filter.detailPreviews)}
                placeholder={<span className={styles.filterPlacerholder}>Plantilla</span>}
                optionFilterProp="children"
                onChange={(value, option) => onChangeFilter(value, option, setTipoPlantillaSeleccionado)}
                //onChange={onChangeCajaContentTemplateTypeFilter}
                filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                ref={tipoPlantillaRef}>
                {renderOptions(cajas.filtros.filtro.tiposPlantilla)}
              </Select>
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      </div>
    );
  };

  /*const renderTable = useCallback(() => {
    console.log('renderTable ' + _.isEmpty(cajas.preview.preview));
    return _.isEmpty(cajas.preview.preview) ? null : (
      <>
        <Divider />
        <EditableTable<ContenidoCaja>
          rowKey={'id'}
          columns={columns}
          dataSource={dataSource}
          size={'small'}
          loading={cajas.preview.isRunning}
          //hasIdColumn={cajas.filtros.seleccionado.tipoContenidoCaja?.descripcion !== CAJA_ETIQUETA}
          //hasActionColumn={cajas.filtros.seleccionado.tipoContenidoCaja?.descripcion !== CAJA_ETIQUETA}
        />
      </>
    );
  }, [cajas.filtros.seleccionado, cajas.preview.preview]);*/

  const renderTable = () => {
    return (
      /*_.isEmpty(cajas.preview.preview) ? null :*/ <EditableTable<ContenidoCaja>
        // rowKey={'id'}
        bordered
        size={'small'}
        //scroll={{ x: 'max-content' }}
        columns={columns as ColumnsType<ContenidoCaja>}
        dataSource={dataSource}
        loading={cajas.preview.isRunning}
        moreColumns={{ key: true, actions: true }}
        sortable={false}
        pagination={{ pageSize: 20 }}
        style={{ width: '80vw' }}
        setData={setDataSource}
        //hasKeyColumn={cajas.filtros.seleccionado.tipoContenidoCaja?.descripcion !== CAJA_ETIQUETA}
        //hasActionColumn={cajas.filtros.seleccionado.tipoContenidoCaja?.descripcion !== CAJA_ETIQUETA}
        scroll={{ x: 600, y: 300 }}
      />
    );
  };

  return (
    <Wrapper contentWrapper unselectable direction="column" horizontal="center">
      <Button
        onClick={() => {
          const _data = new Array(100).fill('').map((e, i) => {
            return { key: `${i + 1}`, a: Math.random() * 1000, b: Math.random() * 1000 };
          }) as any[];
          setDataSource(_data);
        }}>
        Update Data
      </Button>
      {renderfiltros()}
      {renderTable()}
      {/*renderActionButtons()*/}
    </Wrapper>
  );
};
