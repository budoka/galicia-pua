import { CompassFilled, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Divider, Layout } from 'antd';
import { LayoutProps } from 'antd/lib/layout';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { APP_TITLE, FIXED, SHADOW, UNSELECTABLE } from 'src/constants/constants';
import { Texts } from 'src/constants/texts';
import { setOrientation } from 'src/features/configuracion/configuracion.slice';
import { toggleButtonVisible, setOpenMenu, toggleCollapse, toggleForcedCollapse } from 'src/features/menu/menu.slice';
import { RootState } from 'src/reducers';
import { goHome } from 'src/utils/history';
import { useWindowSize } from 'src/utils/hooks';
import { getScreenOrientation } from 'src/utils/screen';
import styles from './style.module.less';

const { Header: HeaderAnt } = Layout;

interface HeaderProps extends LayoutProps {
  hideSiderButton?: boolean;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const sesion = useSelector((state: RootState) => state.sesion);
  const settings = useSelector((state: RootState) => state.configuracion);
  const menu = useSelector((state: RootState) => state.menu);
  const dispatch = useDispatch();
  const size = useWindowSize();

  const [rotate, setRotate] = useState(false);

  const headerClassName = classNames(FIXED, UNSELECTABLE, SHADOW, props.className, styles.header);

  /* Icon rotation effect */
  useEffect(() => {
    setTimeout(
      () => {
        setRotate(!rotate);
      },
      rotate ? 2500 : 5000,
    );
  }, [rotate]);

  useEffect(() => {
    const orientation = getScreenOrientation(size);
    if (orientation !== settings.orientation) dispatch(setOrientation(orientation));

    const shouldCollapse = size.width <= 612;
    if (shouldCollapse) {
      if (shouldCollapse !== menu.collapsed || shouldCollapse === menu.forcedCollapsed) {
        if (menu.buttonVisible) dispatch(toggleButtonVisible(false));
        if (menu.openMenu) dispatch(setOpenMenu(''));
      }
    } else {
      if (shouldCollapse !== menu.collapsed) {
        if (!menu.buttonVisible) dispatch(toggleButtonVisible(true));
        if (!menu.forcedCollapsed) handleCollapsed(false);
      }
    }
  }, [size]);

  useEffect(() => {
    if (!menu.collapsed && (!menu.buttonVisible || menu.forcedCollapsed)) handleCollapsed(true);
    //if (!menu.openMenu && !menu.collapsed) handleCollapsed(true);
  }, [menu.openMenu]);

  useEffect(() => {
    const shouldIgnore = size.width <= 612;
    if (shouldIgnore) return;
    else if (menu.forcedCollapsed) {
      if (menu.openMenu) dispatch(setOpenMenu(''));
      else handleCollapsed(true);
    } else handleCollapsed(false);
  }, [menu.forcedCollapsed]);

  const handleCollapsed = (shouldCollapse: boolean) => {
    if (shouldCollapse !== menu.collapsed) dispatch(toggleCollapse(shouldCollapse));
  };

  const handleForcedCollapsed = (shouldForceCollapse: boolean) => {
    if (shouldForceCollapse !== menu.forcedCollapsed) dispatch(toggleForcedCollapse(shouldForceCollapse));
  };

  const renderLogo = () => {
    return (
      <div className={styles.logoWrapper}>
        <div className={styles.logo}>
          <Button type="link" size="large" style={{ display: 'flex' }} onClick={goHome}>
            <CompassFilled style={{ fontSize: '26px', minWidth: '50px' }} spin={rotate} /> {APP_TITLE}
          </Button>
        </div>
      </div>
    );
  };

  const renderSiderButton = () => {
    return !props.hideSiderButton && menu.buttonVisible /*!(menu.device === 'mobile' && menu.orientation === 'portrait')*/ ? (
      <div className={styles.siderButtonWrapper}>
        {menu.collapsed ? (
          <MenuUnfoldOutlined className={styles.siderButton} onClick={() => handleForcedCollapsed(false)} />
        ) : (
          <MenuFoldOutlined className={styles.siderButton} onClick={() => handleForcedCollapsed(true)} />
        )}
      </div>
    ) : null;
  };

  const renderUserInfo = () => {
    return (
      <div className={styles.rightWrapper}>
        <span className={styles.right}>
          {Texts.USER + ': '}
          <span className={styles.info}>
            {sesion.data?.nombreUsuario} ({sesion.data?.legajo})
          </span>

          {Texts.SECTOR + ': '}
          <span className={styles.info}>{sesion.data?.nombreSector}</span>

          {Texts.PROFILE + ': '}
          <span className={styles.info}>{sesion.data?.perfil}</span>
        </span>
      </div>
    );
  };

  return (
    <HeaderAnt className={headerClassName}>
      {renderLogo()}
      {renderSiderButton()}
      {renderUserInfo()}
    </HeaderAnt>
  );
};
