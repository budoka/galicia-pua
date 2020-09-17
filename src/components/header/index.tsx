import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { LayoutProps } from 'antd/lib/layout';
import _ from 'lodash';
import React, { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCollapsed, setForcedCollapsed, setOrientation } from 'src/actions';
import { RootState } from 'src/reducers';
import { isMobile } from 'src/utils/mobile';
import { useWindowSize } from 'src/utils/hooks';
import styles from './style.module.less';

const { Header: HeaderAnt } = Layout;

export const Header: React.FC<LayoutProps> = (props) => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const size = useWindowSize();

  useLayoutEffect(() => {
    if (isMobile() && settings.orientation !== 'portrait' && size.height > size.width) {
      dispatch(setOrientation('portrait'));
      dispatch(setCollapsed(true));
    } else if (settings.orientation !== 'landscape' && size.width > size.height) {
      dispatch(setOrientation('landscape'));
    } else if (settings.orientation === 'landscape' && settings.collapsed && !settings.forcedCollapsed && size.width > 600) {
      dispatch(setForcedCollapsed(false));
    } else if (settings.orientation === 'landscape' && !settings.collapsed && size.width <= 600) {
      dispatch(setCollapsed(true));
    }
  }, [dispatch, settings.collapsed, settings.forcedCollapsed, settings.orientation, size]);

  return (
    <HeaderAnt className={`${styles.header} unselectable` + props.className}>
      <div className={styles.triggerWrapper}>
        {settings.orientation === 'landscape' ? (
          settings.collapsed ? (
            <MenuUnfoldOutlined
              className={styles.trigger}
              onClick={() => {
                if (settings.collapsed) {
                  dispatch(setForcedCollapsed(false));
                } else {
                  dispatch(setForcedCollapsed(true));
                }
              }}
            />
          ) : (
              <MenuFoldOutlined
                className={styles.trigger}
                onClick={() => {
                  if (settings.collapsed) {
                    dispatch(setForcedCollapsed(false));
                  } else {
                    dispatch(setForcedCollapsed(true));
                  }
                }}
              />
            )
        ) : null}
      </div>
      <div className={styles.rightWrapper}>
        <span className={styles.right}>
          Usuario: <span className={styles.username}>{_.capitalize('MyUsername')}</span>
        </span>
      </div>
    </HeaderAnt>
  );
};
