import { Layout, Menu } from 'antd';
import { LayoutProps, SiderProps as SiderPropsAnt } from 'antd/lib/layout';
import { MenuMode } from 'antd/lib/menu';
import { MenuTheme } from 'antd/lib/menu/MenuContext';
import SubMenu from 'antd/lib/menu/SubMenu';
import { time } from 'console';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'src/reducers';
import { View } from 'src/views';
import styles from './style.module.less';
import { SiderItem, SiderChildItem, SiderParentItem } from './types';

const { Sider: SiderAnt } = Layout;

interface SiderProps extends SiderPropsAnt {
  items: SiderItem[];
  theme?: MenuTheme;
  mode?: MenuMode;
  collapsed?: boolean;
}

export const Sider: React.FC<SiderProps> = (props) => {
  //console.log('sider');
  const settings = useSelector((state: RootState) => state.settings);
  const router = useSelector((state: RootState) => state.router);
  const [showItemTitles, setShowItemTitles] = useState(settings.collapsed);

  useEffect(() => {
    let ms = 300;

    if (showItemTitles) ms = 0;

    const timeout = setTimeout(() => {
      setShowItemTitles(!settings.collapsed);
    }, ms);

    return () => {
      clearTimeout(timeout);
    };
  }, [settings.collapsed]);

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
                {showItemTitles ? title : ''}
              </span>
            }>
            {renderMenu((item as SiderParentItem).children)}
          </SubMenu>
        );
      } else {
        // SiderChildItem
        key = (item as SiderChildItem).view.path;
        title = (item as SiderChildItem).view.title;
        path = (item as SiderChildItem).view.path;

        return (
          <Menu.Item key={key}>
            <Link to={path}>
              {item.icon}
              <span>{title}</span>
            </Link>
          </Menu.Item>
        );
      }
    });
  };

  return (
    <SiderAnt className={`${styles.sider} unselectable` + props.className} trigger={null} collapsible={true} collapsed={settings.collapsed}>
      <Menu
        theme={props.theme ?? 'light'}
        mode={props.mode ?? 'inline'}
        selectedKeys={[router.location.pathname]}
        /*defaultOpenKeys={!settings.collapsed ? ['Administración'] : []}*/
      >
        {renderMenu(props.items)}
      </Menu>
    </SiderAnt>
  );
};
