import { MenuFoldOutlined, MenuUnfoldOutlined, CompassFilled } from '@ant-design/icons';
import { Button, Layout, Typography } from 'antd';
import { LayoutProps } from 'antd/lib/layout';
import classNames from 'classnames';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setButtonVisible, setCollapsed, setForcedCollapsed, setOrientation } from 'src/actions';
import { APP_TITLE, SHADOW, UNSELECTABLE } from 'src/constants/constants';
import { RootState } from 'src/reducers';
import { useWindowSize } from 'src/utils/hooks';
import { isMobile } from 'src/utils/mobile';
import { getScreenOrientation } from 'src/utils/screen';
import styles from './style.module.less';

const { Header: HeaderAnt } = Layout;
const { Text, Link } = Typography;

interface HeaderProps extends LayoutProps {
  hideSiderButton?: boolean;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const size = useWindowSize();

  const [rotate, setRotate] = useState(false);

  const history = useHistory();

  const headerClassNames = classNames(UNSELECTABLE, SHADOW, props.className, styles.header);

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
  }, [settings.collapsed, settings.forcedCollapsed, settings.orientation, size]);

  const collapseHandler = () => {
    dispatch(setForcedCollapsed(!settings.forcedCollapsed));
  };

  const redirectHome = () => {
    history.push('/');
  };

  const renderLogo = () => {
    return (
      <div className={styles.logoWrapper}>
        <div className={styles.logo}>
          <Button type="link" size="large" style={{ display: 'flex' }} onClick={redirectHome}>
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
