import { Layout } from 'antd';
import { LayoutProps } from 'antd/lib/layout';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FIXED, SHADOW, UNSELECTABLE } from 'src/constants/constants';
import { Wrapper } from '../wrapper';
import styles from './style.module.less';

const { Footer: FooterAnt } = Layout;

export const Footer: React.FC<LayoutProps> = (props) => {
  useEffect(() => {});

  const className = classNames(UNSELECTABLE, SHADOW, props.className, styles.footer);

  return (
    <FooterAnt {...props} className={className}>
      <Wrapper className={styles.logoWrapper}>
        <Link to="/">Footer</Link>
      </Wrapper>
    </FooterAnt>
  );
};
