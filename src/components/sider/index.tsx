import { Layout, Menu } from 'antd';
import { SiderProps as SiderPropsAnt } from 'antd/lib/layout';
import { MenuMode } from 'antd/lib/menu';
import { MenuTheme } from 'antd/lib/menu/MenuContext';
import SubMenu from 'antd/lib/menu/SubMenu';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SHADOW, STICKY, UNSELECTABLE } from 'src/constants/constants';
import { setOpenMenu } from 'src/features/menu/menu.slice';
import { ObjectLiteral } from 'src/types';
import { RootState } from 'src/reducers';
import { getMatchedPathname } from 'src/utils/history';
import { View } from 'src/views';
import styles from './style.module.less';
import { SiderChildItem, SiderItem, SiderParentItem } from './types';

const { Sider: SiderAnt } = Layout;

interface SiderProps extends SiderPropsAnt {
  items: SiderItem[];
  theme?: MenuTheme;
  mode?: MenuMode;
  collapsed?: boolean;
}

export const Sider: React.FC<SiderProps> = React.memo((props) => {
  const siderClassNames = classNames(STICKY, UNSELECTABLE, SHADOW, props.className, styles.sider);

  const dispatch = useDispatch();
  const menu = useSelector((state: RootState) => state.menu);
  const router = useSelector((state: RootState) => state.router);

  useEffect(() => {
    const pathname = window.location.pathname;

    let views: ObjectLiteral = {};

    props.items.forEach((item) => {
      const children = (item as SiderParentItem).children;
      const child = item as SiderChildItem;
      if (children) {
        children.forEach((child) => {
          const view = { ...child.view };
          view.title = (item as SiderParentItem).title;
          const pathname = view.path;
          if (pathname) views[pathname] = view;
        });
      } else {
        const pathname = child.view.path;
        if (pathname) views[pathname] = child.view;
      }
    });

    Object.entries(views).some(([key, view]) => {
      if (key === pathname) {
        const menuTitle = (view as View).title;
        if (!menu.collapsed && key !== menu.openMenu && menuTitle !== menu.openMenu) dispatch(setOpenMenu((view as View).title));
        return true;
      }
    });
  }, [router.location.pathname, menu.collapsed]);

  const onOpenChange = (currentMenu: React.Key[]) => {
    if (currentMenu.length > 0) {
      const menuTitle = currentMenu[currentMenu.length - 1].toString();
      if (menu.openMenu === menuTitle) return;
      dispatch(setOpenMenu(menuTitle));
    } else if (menu.openMenu) dispatch(setOpenMenu(''));
  };

  const renderMenu = (items: SiderItem[]) => {
    const isParentItem = (item: SiderItem) => {
      if ((item as SiderParentItem).children) return true;
      else return false;
    };

    return items.map((item, index) => {
      let key: string;
      let path: string;
      let title: string;

      if (isParentItem(item)) {
        // SiderParentItem
        key = title = (item as SiderParentItem).title;

        return (
          <SubMenu
            key={key}
            title={
              <span>
                {item.icon}
                {!menu.collapsed ? title : ''}
              </span>
            }>
            {renderMenu((item as SiderParentItem).children)}
          </SubMenu>
        );
      } else if ((item as SiderChildItem).view.path) {
        // SiderChildItem
        key = path = (item as SiderChildItem).view.path!;
        title = (item as SiderChildItem).view.title;

        return (
          <Menu.Item key={key} hidden={(item as SiderChildItem).hidden}>
            <Link to={path}>
              {item.icon}
              <span>{title}</span>
            </Link>
          </Menu.Item>
        );
      } else return undefined;
    });
  };

  const selectedKey = getMatchedPathname();

  return (
    <SiderAnt className={siderClassNames} trigger={null} collapsible={true} collapsed={menu.collapsed}>
      <Menu
        selectedKeys={selectedKey ? [selectedKey] : undefined}
        // selectedKeys={[window.location.pathname]}
        openKeys={menu.openMenu ? [menu.openMenu] : []}
        onOpenChange={onOpenChange}
        onSelect={({ item, key, keyPath, selectedKeys, domEvent }) => {
          if (menu.collapsed) dispatch(setOpenMenu(''));
        }}
        theme={props.theme ?? 'light'}
        mode={props.mode ?? 'inline'}>
        {renderMenu(props.items)}
      </Menu>
    </SiderAnt>
  );
});
