import classNames from 'classnames';
import _ from 'lodash';
import React from 'react';
import { BasicComponenetProps } from 'src/interfaces';
import styles from './style.module.less';

type Direction = 'row' | 'column';
type Horizontal = 'left' | 'center' | 'right';
type Vertical = 'top' | 'middle' | 'bottom';
type Visible = 'auto' | 'show' | 'hide';

interface WrapperProps extends Omit<BasicComponenetProps<HTMLDivElement>, 'unselectable'> {
  contentWrapper?: boolean;
  unselectable?: boolean;
  direction?: Direction;
  horizontal?: Horizontal;
  vertical?: Vertical;
  scroll?: { x: Visible; y: Visible };
  shadow?: boolean;
  fixed?: boolean;
  sticky?: boolean;
}

export const Wrapper: React.FC<WrapperProps> = (props) => {
  const className = classNames(
    props.contentWrapper && styles.wrapper,
    props.className,
    props.unselectable && 'unselectable',
    props.direction ? styles[props.direction] : styles.column,
    props.horizontal ? styles[props.horizontal] : styles.center,
    props.vertical ? styles[props.vertical] : styles.top,
    props.scroll?.x && styles[`scroll-x-${props.scroll.x}`],
    props.scroll?.y && styles[`scroll-y-${props.scroll.y}`],
    props.shadow && 'shadow',
    props.fixed && 'fixed',
    props.sticky && 'sticky',
  );

  return <div className={className}>{props.children}</div>;
};
