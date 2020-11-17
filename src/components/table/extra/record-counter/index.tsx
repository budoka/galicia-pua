import { Tag } from 'antd';
import React from 'react';

interface RecordsCounterProps {
  count: number;
}

export const RecordsCounter = React.memo((props: RecordsCounterProps) => {
  const { count } = props;
  return <Tag color="volcano">Registros: {count}</Tag>;
});
