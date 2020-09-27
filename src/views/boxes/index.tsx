import { CaretRightOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Divider, Select, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import _, { create } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBoxTemplates } from 'src/actions/boxes/box-templates';
import { BoxColumnTemplate, BoxDetailColumnTemplate, BoxTemplate, BoxTemplateAPIRequest } from 'src/actions/boxes/box-templates/interfaces';
import { EditableTable, IColumn } from 'src/components/editable-table';
import { RootState } from 'src/reducers';
import styles from './style.module.less';
import {
  getBoxContentTypes,
  getBoxTypes,
  getDetailTemplateTypes,
  selectBoxContentType,
  selectBoxType,
  selectDetailTemplate,
} from 'src/actions/boxes/box-filters';
import { BoxContentTypeFilter, BoxTypeFilter, DetailTemplateFilter } from 'src/actions/boxes/box-filters/interfaces';
import { LabeledValue, SelectValue } from 'antd/lib/select';
import { CAJA_DETALLE } from 'src/constants/constants';
import { compare } from 'src/utils/string';
import { BoxInfo, IBoxDocument } from 'src/actions/boxes/box-data/interfaces';
import { saveBox } from 'src/actions/boxes/box-data';
import dayjs from 'dayjs';
import { ThunkAction } from 'redux-thunk';
import { Action, CombinedState } from 'redux';

export const Boxes: React.FC = (props) => {
  const dispatch = useDispatch();
  const boxes = useSelector((state: RootState) => state.boxes);

  const boxTypeRef = useRef<Select<LabeledValue>>(null);
  const boxContentTypeRef = useRef<Select<LabeledValue>>(null);
  const detailTemplateRef = useRef<Select<LabeledValue>>(null);

  const [selectedFilter, setSelectedFilter] = useState<number>(-1);
  const [columns, setColumns] = useState<IColumn<IBoxDocument>[]>([]);

  /* useEffect(() => {
    console.log('rendering');
  });*/

  useEffect(() => {
    console.log('load');
    dispatch(getBoxTypes());
  }, []);

  useEffect(() => {
    clearSelectedFilter();
  }, [boxes.filters.selected]);

  useEffect(() => {
    boxes.filters.selected.boxType && dispatch(getBoxContentTypes(boxes.filters.selected.boxType));
    boxContentTypeRef.current && boxContentTypeRef.current.focus();
  }, [boxes.filters.selected.boxType]);

  useEffect(() => {
    boxes.filters.selected.boxContentType &&
      boxes.filters.selected.boxContentType.value === CAJA_DETALLE &&
      dispatch(getDetailTemplateTypes(boxes.filters.selected.boxContentType));
    detailTemplateRef.current && detailTemplateRef.current.focus();
  }, [boxes.filters.selected.boxContentType]);

  useEffect(() => {
    if (
      (boxes.filters.selected.boxContentType && boxes.filters.selected.boxContentType.value !== CAJA_DETALLE) ||
      boxes.filters.selected.detailTemplate
    ) {
      updatePreview();
    }
  }, [boxes.filters.selected.boxContentType, boxes.filters.selected.detailTemplate]);

  useEffect(() => {
    // Build columns
    console.log(boxes.templates.template.columnsTemplate);

    const columns: IColumn<IBoxDocument>[] = boxes.templates.template.columnsTemplate.map((obj) => {
      return {
        id: obj.id,
        title: obj.title,
        dataType: obj.dataType,
        required: obj.required,
        length: (obj as BoxDetailColumnTemplate).length,
        order: (obj as BoxDetailColumnTemplate).order,
        align: 'center',
        sorter: { compare: (a, b) => compare(a.id, b.id), multiple: -1 },
      } as IColumn<IBoxDocument>;
    });

    console.log(columns);

    setColumns(columns);
  }, [boxes.templates.template]);

  const clearSelectedFilter = () => {
    setSelectedFilter(-1);
  };

  const updatePreview = () => {
    console.log('updatePreview');
    console.log(boxes);

    dispatch(getBoxTemplates(boxes.filters.selected));
  };

  function onChangeFilter(value: LabeledValue, option: any, fn: Function) {
    dispatch(fn(option));
    clearSelectedFilter();
  }

  /*function onChangeBoxTypeFilter(value: LabeledValue, option: any) {
    dispatch(selectBoxType(option));
    clearSelectedFilter();
  }

  function onChangeBoxContentTypeFilter(value: LabeledValue, option: any) {
    dispatch(selectBoxContentType(option));
  }

  function onChangeBoxContentTemplateTypeFilter(value: LabeledValue, option: any) {
    dispatch(selectDetailTemplate(option));
  }*/

  const getOptions = (options: BoxTypeFilter[] | BoxContentTypeFilter[]) => {
    if (!options || options.length === 0) return undefined;
    return options.map((opt) => {
      const selectOptions: BoxTypeFilter | BoxContentTypeFilter = { key: opt.key, value: opt.value, label: opt.value };
      return selectOptions;
    });
  };

  const getValue = (option: LabeledValue | null) => {
    if (option) return option;
    else return undefined;
  };

  const createBox = () => {
    const boxInfo: BoxInfo = {
      userId: 3,
      sectorId: 1243,
      boxTypeId: boxes.filters.selected.boxType?.key!,
      contentType: boxes.filters.selected.boxContentType?.key!,
      templateId: boxes.filters.selected.detailTemplate?.key!,
      description: 'test facu react',
      creationDate: dayjs().format('YYYY-MM-DD H:mm:ss.SSS'),
      expirationDate: dayjs().format('YYYY-MM-DD'),
      fromDate: dayjs().format('YYYY-MM-DD'),
      toDate: dayjs().format('YYYY-MM-DD'),
      restricted: false,
    };
    dispatch(saveBox(boxInfo));
  };

  return (
    <div className={`wrapper unselectable ${styles.content}`}>
      <div className={styles.filterWrapper}>
        <Breadcrumb separator={<CaretRightOutlined />}>
          <Breadcrumb.Item>
            <Select
              onMouseEnter={() => {
                setSelectedFilter(1);
              }}
              // dropdownStyle={{ overflowY: 'scroll' }}
              open={selectedFilter === 1}
              loading={boxes.filters.isRunning}
              dropdownMatchSelectWidth={200}
              showArrow={false}
              className={styles.filter}
              labelInValue
              //showSearch
              bordered={false}
              optionLabelProp="label"
              value={getValue(boxes.filters.selected.boxType)}
              options={getOptions(boxes.filters.filter.boxTypes)}
              placeholder={<span className={styles.filterPlacerholder}>Tipo de caja</span>}
              optionFilterProp="children"
              onChange={(value, option) => onChangeFilter(value, option, selectBoxType)}
              //onChange={onChangeBoxTypeFilter}
              filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              ref={boxTypeRef}
            />
          </Breadcrumb.Item>
          {boxes.filters.selected.boxType && (
            <Breadcrumb.Item>
              <Select
                onMouseEnter={() => {
                  setSelectedFilter(2);
                }}
                open={selectedFilter === 2}
                loading={boxes.filters.isRunning}
                dropdownMatchSelectWidth={200}
                showArrow={false}
                className={styles.filter}
                labelInValue
                //showSearch
                bordered={false}
                optionLabelProp="label"
                value={getValue(boxes.filters.selected.boxContentType)}
                options={getOptions(boxes.filters.filter.boxContentTypes)}
                placeholder={<span className={styles.filterPlacerholder}>Tipo de contenido de caja</span>}
                optionFilterProp="children"
                onChange={(value, option) => onChangeFilter(value, option, selectBoxContentType)}
                //onChange={onChangeBoxContentTypeFilter}
                filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                ref={boxContentTypeRef}
              />
            </Breadcrumb.Item>
          )}

          {boxes.filters.selected.boxContentType && boxes.filters.selected.boxContentType?.key === CAJA_DETALLE && (
            <Breadcrumb.Item>
              <Select
                onMouseEnter={() => {
                  setSelectedFilter(3);
                }}
                open={selectedFilter === 3}
                loading={boxes.filters.isRunning}
                dropdownMatchSelectWidth={330}
                showArrow={false}
                className={styles.filter}
                labelInValue
                //showSearch
                bordered={false}
                optionLabelProp="label"
                value={getValue(boxes.filters.selected.detailTemplate)}
                options={getOptions(boxes.filters.filter.detailTemplates)}
                placeholder={<span className={styles.filterPlacerholder}>Plantilla</span>}
                optionFilterProp="children"
                onChange={(value, option) => onChangeFilter(value, option, selectDetailTemplate)}
                //onChange={onChangeBoxContentTemplateTypeFilter}
                filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                ref={detailTemplateRef}
              />
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      </div>
      <Divider />
      <EditableTable<IBoxDocument> dataSource={[]} columns={columns} rowKey={'id'} />
      <Divider />
      <div className={styles.buttonsWrapper}>
        <Button type="primary" onClick={createBox}>
          Guardar
        </Button>
        <Button type="ghost" onClick={() => {}}>
          Guardar y volver
        </Button>
        <Button type="ghost" onClick={() => {}}>
          Volver
        </Button>
      </div>
    </div>
  );
};
