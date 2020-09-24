import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { LayoutProps } from 'antd/lib/layout';
import classNames from 'classnames';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setButtonVisible, setCollapsed, setForcedCollapsed, setOrientation } from 'src/actions';
import { UNSELECTABLE } from 'src/constants/constants';
import { RootState } from 'src/reducers';
import { useWindowSize } from 'src/utils/hooks';
import { isMobile } from 'src/utils/mobile';
import { getScreenOrientation } from 'src/utils/screen';
import styles from './style.module.less';

const { Header: HeaderAnt } = Layout;

interface HeaderProps extends LayoutProps {
  hideSiderButton?: boolean;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const size = useWindowSize();

  const headerClassNames = classNames(UNSELECTABLE, props.className, styles.header);

  useEffect(() => {
    const orientation = getScreenOrientation(size);

    if (orientation !== settings.orientation) dispatch(setOrientation(orientation));

    if (size.width <= 600) {
      if (settings.buttonVisible) dispatch(setButtonVisible(false));
      if (!settings.collapsed) dispatch(setCollapsed(true));
    } else {
      if (!settings.buttonVisible) dispatch(setButtonVisible(true));

      if (settings.forcedCollapsed) {
        dispatch(setCollapsed(true));
      } else if (settings.collapsed && !settings.forcedCollapsed) {
        dispatch(setCollapsed(false));
        dispatch(setButtonVisible(true));
      } else if (!settings.collapsed) {
      }
    }

    /* const device = settings.device;
    const orientation = settings.orientation;
    const collapsed = settings.collapsed;
    const forcedCollapsed = settings.forcedCollapsed;


    // if (settings.device === 'mobile' && orientation === 'portrait') dispatch(setForcedCollapsed(true));
    //else dispatch(setForcedCollapsed(false));

    if (device === 'mobile' && orientation !== 'portrait' && size.height > size.width) {
      dispatch(setOrientation('portrait'));
      dispatch(setCollapsed(true));
    } else if (orientation !== 'landscape' && size.width > size.height) {
      dispatch(setOrientation('landscape'));
    } else if (orientation === 'landscape' && collapsed && !forcedCollapsed && size.width > 600) {
      dispatch(setForcedCollapsed(false));
    } else if (orientation === 'landscape' && !collapsed && size.width <= 600) {
      dispatch(setCollapsed(true));
    }*/
  }, [settings.collapsed, settings.forcedCollapsed, settings.orientation, size]);

  const collapseHandler = () => {
    dispatch(setForcedCollapsed(!settings.forcedCollapsed));
  };

  const renderLogo = () => {
    return (
      <div className={styles.logoWrapper}>
        <div className={styles.logo}>asddddddd</div>
      </div>
    );
  };

  const renderSiderButton = () => {
    return !props.hideSiderButton && settings.buttonVisible /*!(settings.device === 'mobile' && settings.orientation === 'portrait')*/ ? (
      <div className={styles.siderButtonWrapper}>
        {settings.collapsed ? (
          <MenuUnfoldOutlined className={styles.siderButton} onClick={collapseHandler} />
        ) : (
          <MenuFoldOutlined className={styles.siderButton} onClick={collapseHandler} />
        )}
      </div>
    ) : null;
  };

  const renderUserInfo = () => {
    return (
      <div className={styles.rightWrapper}>
        <span className={styles.right}>
          Usuario: <span className={styles.username}>{_.capitalize('MyUsername')}</span>
        </span>
      </div>
    );
  };

  return (
    <HeaderAnt className={headerClassNames}>
      {renderLogo()}
      {renderSiderButton()}
      {renderUserInfo()}
    </HeaderAnt>
  );
};
