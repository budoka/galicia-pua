import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { BasicComponenetProps } from 'src/interfaces';
import { Wrapper } from '../wrapper';

interface LoadingProps extends BasicComponenetProps<HTMLDivElement> {
  className?: string;
  spinClass?: string;
  color?: string;
  fontSize?: number;
  iconColor?: string;
  size?: number;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = (props) => {
  const { color, fontSize, iconColor, size, text } = props;
  const indicator = <LoadingOutlined style={{ fontSize: size, color: iconColor }} spin />;

  let className = classNames(props.className);
  let spinClass = classNames(props.spinClass);

  console.log(props.style);

  return (
    <Wrapper vertical="middle" unselectable className={className} style={props.style}>
      <Spin className={spinClass} tip={text} indicator={indicator} style={{ fontSize, color }} />
    </Wrapper>
  );
};
