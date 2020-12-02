import { Layout } from 'antd';
import { LayoutProps } from 'antd/lib/layout';
import classNames from 'classnames';
import React, { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FIXED, SHADOW, UNSELECTABLE } from 'src/constants/constants';
import { BasicComponenetProps } from 'src/types';
import { Wrapper } from '../wrapper';
import styles from './style.module.less';

const { Footer: FooterAnt } = Layout;

export interface FooterProps extends BasicComponenetProps<HTMLDivElement> {
  hide?: boolean;
  info?: ReactNode;
}

export const Footer: React.FC<FooterProps> = React.memo((props) => {
  const { info, hide } = props;

  const className = classNames(UNSELECTABLE, SHADOW, props.className, styles.footer);
  const wrapperInfoClassName = classNames(props.className);

  return (
    <>
      {hide ? undefined : (
        <FooterAnt {...props} className={className}>
          <Wrapper className={wrapperInfoClassName}>{info}</Wrapper>
        </FooterAnt>
      )}
    </>
  );
});
