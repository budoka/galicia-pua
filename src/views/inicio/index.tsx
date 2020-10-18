import React from 'react';
import { ListCard } from 'src/components/list-card';
import { IListCard } from 'src/components/list-card/types';
import { Wrapper } from 'src/components/wrapper';
import { views } from 'src/views';
import styles from './style.module.less';

export const Inicio: React.FC = (props) => {
  const cards: IListCard[] = [
    {
      title: 'Cajas',
      items: [
        { description: 'Pendientes de Cierre', count: 20, path: views[1].path },
        { description: 'Pendientes de Devolución', count: 0, path: views[2].path },
      ],
    },
    {
      title: 'Documentación',
      items: [{ description: 'Pendientes de Devolución', count: 200 }],
    },
    {
      title: 'Pedidos',
      items: [
        { description: 'Pendientes de Envío', count: 5 },
        { description: 'Por Resolver', count: 15 },
        { description: 'Resueltos', count: 300 },
        { description: 'Rechazados', count: 50 },
      ],
    },
    {
      title: 'Otros',
      items: [],
    },
  ];

  const renderCards = () => {
    return cards.map((card, index) => {
      return (
        <ListCard
          key={index}
          className={styles.card}
          header={card.title ? <span className={styles.header}>{card.title}</span> : null}
          headerStyle={{
            textAlign: 'center',
          }}
          items={card.items}
          showZero
        />
      );
    });
  };

  return (
    <Wrapper className={styles.wrapper} unselectable direction="row" horizontal="center">
      {renderCards()}
    </Wrapper>
  );
};
