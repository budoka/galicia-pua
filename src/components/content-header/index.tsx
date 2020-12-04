import { Breadcrumb, Divider } from 'antd';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { UNSELECTABLE } from 'src/constants/constants';
import { BasicComponenetProps, Dictionary } from 'src/types';
import { RootState } from 'src/reducers';
import { View } from 'src/views';
import { siderItems } from '../app';
import { SiderChildItem, SiderItem, SiderParentItem } from '../sider/types';
import styles from './style.module.less';
import { matchPath } from 'react-router';
import { Wrapper } from '../wrapper';
import { Cart } from '../cart';

interface ContentHeaderProps extends Pick<BasicComponenetProps<HTMLDivElement>, 'className' | 'style'> {}

export const ContentHeader: React.FC<ContentHeaderProps> = React.memo((props) => {
  const { children } = props;
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
      <Wrapper contentBody direction="row" className={styles.wrapper}>
        <Breadcrumb className={className}>{renderItem()}</Breadcrumb> {children}
      </Wrapper>
      <Divider />
    </>
  );
});
