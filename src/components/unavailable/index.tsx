import { Button, Result } from 'antd';
import React from 'react';
import { Wrapper } from 'src/components/wrapper';
import { goHome } from 'src/utils/history';

export const Unavailable: React.FC = (props) => {
  return (
    <Wrapper contentWrapper unselectable>
      <Result
        status="500"
        title="500"
        subTitle="El contenido no está disponible."
        extra={
          <Button type="primary" onClick={goHome}>
            Ir al Inicio
          </Button>
        }
      />
    </Wrapper>
  );
};
