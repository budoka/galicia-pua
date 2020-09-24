import { Button, Select, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBoxTemplates } from 'src/actions/boxes/box-templates';
import { BoxColumnTemplate, BoxTemplate } from 'src/actions/boxes/box-templates/interfaces';
import { BoxContent, IBoxDocument } from 'src/actions/boxes/box-data/interfaces';
import { EditableTable, IColumn } from 'src/components/editable-table';
import { RootState } from 'src/reducers';
import styles from './style.module.less';
import { getBoxTypes, selectOption } from 'src/actions/boxes/box-filters';
import { BoxContentTypeFilter, BoxTypeFilter } from 'src/actions/boxes/box-filters/interfaces';
import { LabeledValue } from 'antd/lib/select';

export const Boxes: React.FC = (props) => {
  const dispatch = useDispatch();
  const boxes = useSelector((state: RootState) => state.boxes);

  const [columns, setColumns] = useState<IColumn<IBoxDocument>[]>([]);

  useEffect(() => {
    console.log('rendering');
  });

  useEffect(() => {
    console.log('load');
    dispatch(getBoxTypes());
  }, []);
  /*
  useEffect(() => {
    //  dispatch(getBoxTypes);
  }, [boxes.filters.filter.boxTypes]);

  useEffect(() => {}, [boxes.filters.filter.boxContentTypes]);*/

  /*useEffect(() => {
    console.table(boxes.templates.template);

    const columns: IColumn<IBoxDocument>[] = boxes.templates.template.map((obj) => {
      return { id: obj.id, title: obj.title } as IColumn<IBoxDocument>;
    });

    setColumns(columns);
  }, [boxTemplates.template]);*/

  const updatePreview = () => {
    console.log('updatePreview');
    dispatch(getBoxTemplates());
  };

  function onChange(value: BoxTypeFilter) {
    console.log(`selected ${value}`);
    dispatch(selectOption(value));
  }

  function onBlur() {
    // console.log('blur');
  }

  function onFocus() {
    //console.log('focus');
  }

  function onSearch(val: string) {
    // console.log('search:', val);
  }

  const getOptions = (options: BoxTypeFilter[] | BoxContentTypeFilter[]) => {
    //console.log(options);
    if (!options) return [];
    return options.map((opt) => {
      const selectOptions: BoxTypeFilter = { key: opt.key, value: opt.value, label: opt.value };
      // console.log(selectOptions);
      return selectOptions;
    });
  };

  const getValue = () => {
    if (boxes.filters.selected.boxType) return boxes.filters.selected.boxType;
    else return undefined;
  };

  return (
    <div className={`wrapper unselectable ${styles.content}`}>
      {false ? null : (
        <Select<BoxTypeFilter>
          showSearch
          optionLabelProp="label"
          value={getValue()}
          options={getOptions(boxes.filters.filter.boxTypes)}
          style={{ width: 400 }}
          placeholder="Seleccione un tipo de caja"
          optionFilterProp="children"
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onSearch={onSearch}
          filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        />
      )}

      <Button type={'primary'} onClick={() => updatePreview()}>
        Toggle
      </Button>
      <EditableTable<IBoxDocument> dataSource={[]} columns={columns} rowKey={'id'} />
    </div>
  );
};
