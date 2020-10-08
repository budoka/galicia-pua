import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'src/store';
import { goHome } from 'src/utils/history';
import styles from './style.module.less';

export const NotFound: React.FC = (props) => {
  return (
    <div className={`wrapper unselectable ${styles.content}`}>
      <Result
        status="404"
        title="404"
        subTitle="La página no existe."
        extra={
          <Button type="primary" onClick={goHome}>
            Ir al Inicio
          </Button>
        }
      />
    </div>
  );
};
