import { Breadcrumb, Divider } from 'antd';
import classNames from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SHADOW, STICKY, UNSELECTABLE } from 'src/constants/constants';
import { BasicComponentProps, Dictionary } from 'src/types';
import { RootState } from 'src/reducers';
import { View } from 'src/views';
import { siderItems } from '../app';
import { SiderChildItem, SiderItem, SiderParentItem } from '../sider/types';
import styles from './style.module.less';
import { matchPath } from 'react-router';
import { Wrapper } from '../wrapper';
import { Cart } from '../cart';
import { useScroll, useWindowSize } from 'src/utils/hooks';

interface ContentHeaderProps extends Pick<BasicComponentProps<HTMLDivElement>, 'className' | 'style'> {}

export const ContentHeader: React.FC<ContentHeaderProps> = React.memo((props) => {
  const { children } = props;

  const [pin, setPin] = useState(false);

  let scroll = useScroll(document.getElementById('content') ?? undefined);
  //let scroll = useScroll(document.querySelector('#content') ?? undefined);

  useEffect(() => {
    console.log(document.querySelector('#content'));
  }, []);

  useEffect(() => {
    console.log(document.querySelector('#content'));
    console.log(scroll);
    setPin(scroll.y > 20);
  }, [scroll]);

  const wrapperClassName = classNames(STICKY, styles.wrapper, pin ? styles.wrapperPinned : undefined);
  //  const wrapperClassName = classNames(STICKY, pin ? styles.wrapperPinned : styles.wrapper);
  const wrapperContentClassName = classNames(styles.wrapperContent);
  const className = classNames(UNSELECTABLE, props.className, styles.contentHeader);

  //  const router = useSelector((state: RootState) => state.router);

  const getItem = (path: string, items: SiderItem[]): SiderChildItem | undefined => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const child = item as SiderChildItem;

      const isEq =
        child.view &&
        matchPath(path, {
          path: child.view.path,
          exact: true,
          strict: true,
        });

      if (isEq) {
        //  console.log(child);
        return child;
      }
      const parent = item as SiderParentItem;

      if (parent.children) {
        const item = getItem(path, parent.children);
        if (item) return item;
      }
    }
  };

  const renderItem = () => {
    const item = getItem(window.location.pathname, siderItems)!;
    return (
      <>
        <Breadcrumb.Item>{item.parent}</Breadcrumb.Item>
        <Breadcrumb.Item>{item.view.title}</Breadcrumb.Item>
      </>
    );
  };

  return (
    <>
      <div className={wrapperClassName}>
        <Wrapper contentBody direction="row" vertical="middle" className={wrapperContentClassName}>
          <Breadcrumb className={className}>{renderItem()}</Breadcrumb> {children}
        </Wrapper>
      </div>
      <Divider />
    </>
  );
});

export const ContentHeaderWithCart = () => (
  <ContentHeader>
    <Cart count={7} />
  </ContentHeader>
);
