import { LoadingOutlined } from '@ant-design/icons';
import { Badge, Card, Select as SelectAnt } from 'antd';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { MenuTheme } from 'antd/lib/menu/MenuContext';
//import './style.less';
import styles from './style.module.less';
import { IListCardItem } from './types';
import { Link } from 'react-router-dom';
import bwipjs from 'bwip-js';
import { SelectProps as SelectPropsAnt, SelectValue } from 'antd/lib/select';

const { Option } = SelectAnt;

interface SelectProps<SelectValue> extends SelectPropsAnt<SelectValue> {
  wrapperClassName?: string;
}

export const Select: React.FC<SelectProps<SelectValue>> = (props) => {
  const { className, wrapperClassName } = props;

  const wrapperClass = classNames(styles.wrapper, {
    [`${wrapperClassName}`]: wrapperClassName,
  });

  const contentClass = classNames(styles.content, {
    [`${className}`]: className,
  });

  function onChange(value: string) {
    console.log(`selected ${value}`);
  }

  return (
    <div className={wrapperClass}>
      <SelectAnt
        className={contentClass}
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) =>
          option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }></SelectAnt>
    </div>
  );
};
