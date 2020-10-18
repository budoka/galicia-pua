import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './style.module.less';

interface LoadingProps {
  center?: boolean;
  className?: string;
  color?: string;
  fontSize?: number;
  iconColor?: string;
  size?: number;
  text?: string;
  wrapperClassName?: string;
}

export const Loading: React.FC<LoadingProps> = (props) => {
  const { center, className, color, fontSize, iconColor, size, text, wrapperClassName } = props;
  const indicator = <LoadingOutlined style={{ fontSize: size, color: iconColor }} spin />;

  var wrapperClass = classNames({
    [`${wrapperClassName}`]: wrapperClassName,
    [`${styles.center}`]: center,
  });

  var innerClass = classNames({
    [`${className}`]: className,
  });

  return (
    <div className={wrapperClass + ' unselectable'}>
      <Spin className={innerClass} tip={text} indicator={indicator} style={{ fontSize: fontSize, color: color }} />
    </div>
  );
};
