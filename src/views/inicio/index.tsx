import { Col, Row } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import React, { ReactNode, useEffect } from 'react';
import { ListCard } from 'src/components/list-card';
import { IListCard } from 'src/components/list-card/interfaces';
import { Wrapper } from 'src/components/wrapper';
import { views } from 'src/views';
import styles from './style.module.less';

export const Inicio: React.FC = (props) => {
  const className = classNames(styles.wrapper, styles.header);

  const cards: IListCard[] = [
    {
      title: 'Cajas',
      items: [
        { description: 'Pendientes de Cierre', count: 20, path: views['Cajas'].path, query: '?estado=PendienteCierre' },
        { description: 'Pendientes de Devolución', count: 5, path: views['Cajas'].path, query: '?estado=PendienteRecepcion' },
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
      title: 'Mis Digitalizaciones',
      items: [
        { description: 'Disponibles', count: 25 },
        { description: 'Enviados', count: 15 },
        { description: 'Indexados', count: 10 },
        { description: 'Errores', count: 30 },
      ],
    },
  ];

  const renderCard = (card: IListCard, key: React.Key) => {
    return (
      <ListCard
        className={styles.card}
        header={card.title ? <span className={styles.header}>{card.title}</span> : null}
        headerStyle={{
          textAlign: 'center',
        }}
        items={card.items}
        showZero
      />
    );
  };

  const renderColumn = (card: ReactNode, key: React.Key) => {
    return (
      <Col key={key} className={styles.column}>
        {card}
      </Col>
    );
  };

  const renderRow = (column: ReactNode, key: React.Key) => {
    return (
      <Row key={key} justify="center" style={{ width: '100%' }}>
        {column}
      </Row>
    );
  };

  const renderCards = (maxColumns: number) => {
    const chunks = _.chunk(cards, maxColumns);

    const rows = chunks.map((row, rIndex) =>
      renderRow(
        row.map((card, cIndex) => renderColumn(renderCard(card, `${rIndex}-${cIndex}`), cIndex)),
        rIndex,
      ),
    );

    return rows;
  };

  return (
    <Wrapper contentWrapper className={className} unselectable direction="row" horizontal="center" vertical="full-height">
      {renderCards(2)}
    </Wrapper>
  );
};
