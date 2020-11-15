import { CompassFilled, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Divider, Layout } from 'antd';
import { LayoutProps } from 'antd/lib/layout';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setButtonVisible, setCollapsed, setForcedCollapsed, setOpenMenu, setOrientation } from 'src/actions/configuracion';
import { useAzureAuth } from 'src/auth/azure/useAzureAuth';
import { APP_TITLE, FIXED, SHADOW, UNSELECTABLE } from 'src/constants/constants';
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
      if (shouldCollapse !== settings.collapsed || shouldCollapse === settings.forcedCollapsed) {
        if (settings.buttonVisible) dispatch(setButtonVisible(false));
        if (settings.openMenu) dispatch(setOpenMenu());
      }
    } else {
      if (shouldCollapse !== settings.collapsed) {
        if (!settings.buttonVisible) dispatch(setButtonVisible(true));
        if (!settings.forcedCollapsed) handleCollapsed(false);
      }
    }
  }, [size]);

  useEffect(() => {
    if (!settings.collapsed && (!settings.buttonVisible || settings.forcedCollapsed)) handleCollapsed(true);
    //if (!settings.openMenu && !settings.collapsed) handleCollapsed(true);
  }, [settings.openMenu]);

  useEffect(() => {
    const shouldIgnore = size.width <= 612;
    if (shouldIgnore) return;
    else if (settings.forcedCollapsed) {
      if (settings.openMenu) dispatch(setOpenMenu());
      else handleCollapsed(true);
    } else handleCollapsed(false);
  }, [settings.forcedCollapsed]);

  const handleCollapsed = (shouldCollapse: boolean) => {
    dispatch(setCollapsed(shouldCollapse));
  };

  const handleForcedCollapsed = (shouldForceCollapse: boolean) => {
    dispatch(setForcedCollapsed(shouldForceCollapse));
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
    return !props.hideSiderButton && settings.buttonVisible /*!(settings.device === 'mobile' && settings.orientation === 'portrait')*/ ? (
      <div className={styles.siderButtonWrapper}>
        {settings.collapsed ? (
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
          {'Usuario:  '}
          <span className={styles.info}>
            {sesion.infoSesion?.usuario} ({sesion.infoSesion?.legajo})
          </span>

          {'Sector:  '}
          <span className={styles.info}>{sesion.infoSesion?.sector}</span>

          {'Perfil:  '}
          <span className={styles.info}>{sesion.infoSesion?.perfil}</span>
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
