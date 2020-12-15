import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { BasicComponentProps } from 'src/types';
import styles from './style.module.less';

interface CartProps extends Pick<BasicComponentProps<HTMLButtonElement>, 'className' | 'style' | 'onClick'> {
  count?: number;
}

export const Cart: React.FC<CartProps> = React.memo((props) => {
  const { count, onClick } = props;
  const className = classNames(props.className, styles.cart);

  return (
    <Badge className={styles.badge} count={count}>
      <Button className={className} icon={<ShoppingCartOutlined />} disabled={!count} onClick={onClick} />
    </Badge>
  );
});
