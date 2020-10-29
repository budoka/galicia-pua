import { Badge, Card } from 'antd';
import { MenuTheme } from 'antd/lib/menu/MenuContext';
import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrapper } from '../wrapper';
import styles from './style.module.less';
import { IListCardItem } from './interfaces';
import { SHADOW, UNSELECTABLE } from 'src/constants/constants';

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
  const className = classNames(styles.content, UNSELECTABLE, SHADOW, props.className);

  const setBadgeStatus = (count: number) => {
    const { theme } = props;
    if (count === 0) return theme === 'dark' ? styles.badgeIdleDark : styles.badgeIdleLight;
    else if (count < 10) return theme === 'dark' ? styles.badgeLowDark : styles.badgeLowLight;
    else if (count < 50) return theme === 'dark' ? styles.badgeNormalDark : styles.badgeNormalLight;
    else return theme === 'dark' ? styles.badgeHighDark : styles.badgeHighLight;
  };

  const getBadgeClass = (count?: number) => {
    return count !== undefined ? classNames(setBadgeStatus(count)) : undefined;
  };

  const linkWrapper = (children: React.ReactNode, url: string) => {
    return (
      <Link to={url} className={styles.link}>
        {children}
      </Link>
    );
  };

  const renderCard = (item: IListCardItem) => {
    return (
      <Card.Grid className={styles.cardGrid}>
        <span>{item.description}</span>
        {item?.count! >= 0 && <Badge className={getBadgeClass(item.count)} count={item.count} showZero={props.showZero} />}
      </Card.Grid>
    );
  };

  const renderCards = () => {
    const { items } = props;
    return items
      ? items.map((item, index) => {
          return (
            <Card key={index} type="inner" className={styles.card}>
              <div className={styles.cardContent}>
                {item.path && item.count ? linkWrapper(renderCard(item), item.path) : renderCard(item)}
              </div>
            </Card>
          );
        })
      : null;
  };

  return (
    <Card className={className} title={props.header} headStyle={props.headerStyle}>
      {renderCards()}
    </Card>
  );
};
