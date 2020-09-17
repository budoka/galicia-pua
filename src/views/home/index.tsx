import { Col, Row } from 'antd';
import _, { Dictionary } from 'lodash';
import React from 'react';
import { views } from 'src/app';
import { ListCard } from 'src/components/list-card';
import { IListCard } from 'src/components/list-card/types';
import { createBarcode } from 'src/utils/barcode';
import { View } from '..';
import styles from './style.module.less';

export const Home: React.FC = (props) => {
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
      title: 'X',
      items: [],
    },
  ];

  const renderCards = () => {
    return cards.map((card, index) => {
      return (
        <Col key={index} flex={'1 1 430px'}>
          <ListCard
            header={card.title ? <span className={styles.card_header}>{card.title}</span> : null}
            headerStyle={{
              textAlign: 'center',
            }}
            items={card.items}
            showZero
          />
        </Col>
      );
    });
  };

  return (
    <div className={`wrapper unselectable ${styles.content}`}>
      <Row gutter={[16, 16]}>{renderCards()}</Row>
    </div>
  );
};
