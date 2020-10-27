import { Checkbox, Input, Select } from 'antd';
import Form, { Rule } from 'antd/lib/form';
import React, { useEffect, useMemo, useRef } from 'react';
import { BasicComponenetProps, IElement } from 'src/interfaces';
import { InputType } from '..';
import styles from './style.module.less';

const { Option } = Select;

export interface ICellProps extends BasicComponenetProps<HTMLTableDataCellElement> {
  dataIndex: string;
  editing: boolean;
  inputType?: InputType;
  hasFocus?: boolean;
  hasFeedback?: boolean;
  rules?: Rule[];
}

export const Cell = (props: ICellProps) => {
  const { className, style, dataIndex, editing, inputType, hasFocus, hasFeedback, rules, children } = props;

  const inputRef = useRef<Input>(null);

  useEffect(() => {
    console.log('rendering cell');
  });

  /*useEffect(() => {
    console.log('rendering cell');
  }, [style]);*/

  useEffect(() => {
    if (props.hasFocus) inputRef?.current?.focus();
  }, [editing, hasFocus]);

  const scrollOnFocus = () => {
    const parent = document.querySelector('.ant-table-body table')!;
    const parentX = parent.getBoundingClientRect().x;

    const child = document.querySelector('.ant-table-body')!;
    const childX = child.getBoundingClientRect().x;
    const childW = child.getBoundingClientRect().width;

    const input = inputRef.current?.input!.closest('td.ant-table-cell')!;
    const inputX = input.getBoundingClientRect().x;
    const inputW = input.getBoundingClientRect().width;

    //console.log(parentX + ' -- ' + childX + ' -- ' + inputX);
    //console.log(parentX + ' -- ' + (childW - 210) + ' -- ' + inputW);

    const verticalScrollbarWidth = 12;
    const actionColumnWidth = 210;

    const delta = inputX - (childW - actionColumnWidth - inputW) - (childX - verticalScrollbarWidth);

    const offSetParent = childX - parentX;

    child.scrollTo({ behavior: 'auto', left: Math.ceil(offSetParent + delta) });
  };

  const renderOptions = (options: IElement[]) => {
    return options.map((option, index) => (
      <Option key={option.key} value={option.value} title={option.label} className={styles.option}>
        {option.label}
      </Option>
    ));
  };

  const renderCheckbox = () => {
    return <Checkbox className={styles.input} checked={true} onChange={() => {}} />;
  };

  const renderSelect = (options: IElement[]) => {
    return (
      <Select className={styles.input} showSearch showAction={['focus', 'click']} optionFilterProp="title">
        {renderOptions(options)}
      </Select>
    );
  };

  const renderText = () => {
    return <Input className={styles.input} ref={inputRef} onFocus={scrollOnFocus} />;
  };

  const renderInput = (inputType: InputType, options?: IElement[]) => {
    switch (inputType) {
      case 'text':
        return renderText();
      case 'select':
        return renderSelect(options!);
      case 'checkbox':
        return renderCheckbox();
      default:
        return renderText();
    }
  };

  return (
    <td className={className} style={style} /*{...restProps}*/>
      {editing ? (
        <Form.Item className={styles.formItem} name={dataIndex} style={{ margin: 0, padding: 0 }} rules={rules} hasFeedback={hasFeedback}>
          {renderInput(inputType!, [
            { key: 'keyA', value: '1', label: 'Elemento AAAAAAAAAAAAAAA' },
            { key: 'keyB', value: '2', label: 'b' },
          ])}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
