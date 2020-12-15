import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { Texts } from 'src/constants/texts';
import { BasicComponentProps } from 'src/types';
import { Wrapper } from '../wrapper';

interface LoadingProps extends Pick<BasicComponentProps<HTMLDivElement>, 'style'> {
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

  return (
    <Wrapper horizontal="center" vertical="middle" unselectable className={className} style={props.style}>
      <Spin className={spinClass} tip={text} indicator={indicator} style={{ fontSize, color }} />
    </Wrapper>
  );
};

export const LoadingContent = () => <Loading style={{ height: '100vh' }} size={26} text={Texts.LOADING} />;
