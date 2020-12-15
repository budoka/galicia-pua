import { ShoppingCartOutlined } from '@ant-design/icons';
import { BackTop, Badge, Button } from 'antd';
import { BackTopProps } from 'antd/lib/back-top';
import classNames from 'classnames';
import React from 'react';
import { BasicComponentProps } from 'src/types';
import styles from './style.module.less';

export const BackToTop: React.FC<BackTopProps> = React.memo((props) => {
  const { className, ...restProps } = props;
  const backToTopClassName = classNames(className, styles.backToTop);

  return (
    <BackTop
      className={backToTopClassName}
      visibilityHeight={80}
      target={() => document.getElementById('content') || window}
      {...restProps}
    />
  );
});
