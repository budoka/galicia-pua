import { Col, Row } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ListCard } from 'src/components/list-card';
import { IListCard } from 'src/components/list-card/interfaces';
import { Wrapper } from 'src/components/wrapper';
import { Texts } from 'src/constants/texts';
import { views } from 'src/views';
import styles from './style.module.less';

export const Inicio: React.FC = (props) => {
  const className = classNames(styles.wrapper, styles.header);

  const cards: IListCard[] = [
    {
      title: Texts.BOXES,
      items: [
        { description: Texts.PENDING_CLOSE, count: 20, path: views['Cajas'].path, query: '?estado=PendienteCierre' },
        { description: Texts.PENDING_RETURN, count: 5, path: views['Cajas'].path, query: '?estado=PendienteRecepcion' },
      ],
    },
    {
      title: Texts.DOCUMENTS,
      items: [{ description: Texts.PENDING_RETURN, count: 200 }],
    },
    {
      title: Texts.ORDERS,
      items: [
        { description: Texts.PENDING_SEND, count: 5 },
        { description: Texts.TO_RESOLVE, count: 15 },
        { description: Texts.RESOLVED, count: 300 },
        { description: Texts.REJECTED, count: 50 },
      ],
    },
    {
      title: Texts.MY_SCANS,
      items: [
        { description: Texts.AVAILABLE, count: 25 },
        { description: Texts.SENT, count: 15 },
        { description: Texts.INDEXED, count: 10 },
        { description: Texts.ERRORS, count: 30 },
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
