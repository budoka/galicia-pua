import { LoadingOutlined } from '@ant-design/icons';
import { Badge, Card } from 'antd';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { MenuTheme } from 'antd/lib/menu/MenuContext';
//import './style.less';
import styles from './style.module.less';
import { IListCardItem } from './types';
import { Link } from 'react-router-dom';
import bwipjs from 'bwip-js';

interface ListCardProps {
  className?: string;
  items?: IListCardItem[];
  header?: React.ReactNode;
  headerStyle?: React.CSSProperties;
  showZero?: boolean;
  theme?: MenuTheme;
  unselectable?: boolean;
  wrapperClassName?: string;
}

export const ListCard: React.FC<ListCardProps> = (props) => {
  const { className, items, header, headerStyle, showZero, theme, unselectable, wrapperClassName } = props;

  const wrapperClass = classNames(styles.wrapper, {
    [`${wrapperClassName}`]: wrapperClassName,
    unselectable: unselectable,
  });

  const contentClass = classNames(styles.content, {
    [`${className}`]: className,
  });

  const setBadgeStatus = (count: number) => {
    if (count == 0) return theme == 'dark' ? styles.badgeIdleDark : styles.badge_idleLight;
    else if (count < 10) return theme == 'dark' ? styles.badgeLowDark : styles.badgeLowLight;
    else if (count < 50) return theme == 'dark' ? styles.badgeNormalDark : styles.badgeNormalLight;
    else return theme == 'dark' ? styles.badgeHighDark : styles.badgeHighLight;
  };

  const getBadgeClass = (count?: number) => {
    return count !== undefined ? classNames(setBadgeStatus(count)) : undefined;
  };

  const linkWrapper = (element: React.ReactNode, url: string) => {
    return url ? (
      <Link to={url} style={{ width: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '8px 16px' }}>
        {element}
      </Link>
    ) : (
      <span style={{ width: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '8px 16px' }}>{element}</span>
    );
  };

  const renderChildren = () => {
    return items
      ? items.map((item, index) => {
          return (
            <Card key={index} type="inner" style={{ width: '100%' }}>
              <Card.Grid
                style={{
                  width: '100%',
                  padding: '0px',
                }}>
                {linkWrapper(
                  <>
                    <span style={{ width: '100%' }}>{item.description}</span>
                    {item.count !== undefined ? (
                      <Badge className={getBadgeClass(item.count)} style={{ width: '100%' }} count={item.count} showZero={showZero} />
                    ) : undefined}
                  </>,
                  item.path!,
                )}
              </Card.Grid>
            </Card>
          );
        })
      : null;
  };

  return (
    <div className={wrapperClass}>
      <Card className={contentClass} title={header} headStyle={headerStyle}>
        {renderChildren()}
      </Card>
    </div>
  );
};
