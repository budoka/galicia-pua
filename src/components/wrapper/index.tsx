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
  const { contentWrapper, className, unselectable, direction, horizontal, vertical, scroll, shadow, fixed, sticky, ...restProps } = props;
  const wrapperClassName = classNames(
    contentWrapper && styles.wrapper,
    className,
    unselectable && 'unselectable',
    direction ? styles[direction] : styles.column,
    horizontal ? styles[horizontal] : styles.center,
    vertical ? styles[vertical] : styles.top,
    scroll?.x && styles[`scroll-x-${scroll.x}`],
    scroll?.y && styles[`scroll-y-${scroll.y}`],
    shadow && 'shadow',
    fixed && 'fixed',
    sticky && 'sticky',
  );

  return (
    <div {...restProps} className={wrapperClassName} style={props.style}>
      {props.children}
    </div>
  );
};
