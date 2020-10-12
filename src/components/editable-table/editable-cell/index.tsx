import { Checkbox, Input, Select } from 'antd';
import Form from 'antd/lib/form';
import Column from 'antd/lib/table/Column';
import React, { useEffect, useRef } from 'react';

import { IElement } from 'src/interfaces';
import { DataType, InputType } from '..';
import './style.less';

const { Option } = Select;

export interface EditableCellProps<RecordType> extends React.HTMLAttributes<HTMLElement> {
  dataIndex: string;
  // index: number;
  // title: any;
  record: RecordType;
  editing: boolean;
  dataType?: DataType;
  length?: number;
  required?: boolean;
  inputType?: InputType;
  hasFeedback?: boolean;
  pattern?: RegExp;
  message?: string;
  transform?: (value: any) => any;
  children: React.ReactNode;
}

export const EditableCell /*: React.FC<EditableCellProps<object>>*/ = <RecordType extends object = any>(
  props: EditableCellProps<RecordType>,
) => {
  const {
    dataType,
    length,
    editing,
    dataIndex,
    //  title,
    inputType,
    record,
    //  index,
    hasFeedback,
    children,
    required,
    pattern,
    message,
    transform,
    ...restProps
  } = props;

  const inputRef = useRef<Input>(null);

  useEffect(() => {
    //if (props.dataIndex === 'name') inputRef?.current?.focus();
    // console.log('focus');
  }, [props.editing]);

  const renderOptions = (options: IElement[]) => {
    return options.map((option, index) => (
      <Option
        key={index}
        value={option.descripcion || option.description}
        id={option.id}
        descripcion={option.descripcion || option.description}>
        {option.descripcion}
      </Option>
    ));
  };

  /*const renderOption = (options: string[]) => {
    return options!.map((option, index) => {
      return (
        <Option key={`option:${index}`} value={option} className="option" style={{ textAlign: 'center', color: '#1890ff' }}>
          {option}
        </Option>
      );
    });
  };*/

  const renderCheckbox = () => {
    return <Checkbox checked={true} onChange={() => {}} />;
  };

  const renderSelect = (options: IElement[]) => {
    return (
      <Select showSearch showAction={['focus', 'click']} style={{ flex: '1 0 auto', width: '97%', textAlign: 'center', paddingTop: 1 }}>
        {renderOptions(options)}
      </Select>
    );
  };

  const renderText = () => {
    return (
      <Input
        ref={inputRef}
        style={{
          padding: 0,
          paddingLeft: 25,
          paddingRight: 25,
          paddingTop: 1,
          textAlign: 'center',
          width: '97%',
          backgroundColor: 'transparent',
        }}
      />
    );
  };

  const renderInput = (inputType: InputType, options?: any[]) => {
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
    <td {...restProps}>
      {/*console.log(children)*/}
      {editing ? (
        <Form.Item
          name={dataIndex}
          hasFeedback={hasFeedback}
          rules={[{ required, pattern, message, transform }]}
          style={{ margin: 0, padding: 0 /*, minWidth, width*/ }}>
          {renderInput(inputType!, ['aa', 'bb', 'cc'])}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
