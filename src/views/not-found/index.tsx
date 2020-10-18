import { Button, Result } from 'antd';
import React from 'react';
import { Wrapper } from 'src/components/wrapper';
import { goHome } from 'src/utils/history';

export const NotFound: React.FC = (props) => {
  return (
    <Wrapper unselectable>
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
    </Wrapper>
  );
};
