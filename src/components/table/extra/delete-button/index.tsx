import { Button, Popconfirm } from 'antd';
import React, { useEffect } from 'react';
import { Action } from '../..';

interface DeleteButtonProps {
  disabled: boolean;
  onDelete: () => void;
}

export const DeleteButton = (props: DeleteButtonProps) => {
  const { disabled, onDelete } = props;

  return (
    <Popconfirm title="¿Desea eliminar las filas seleccionadas?" onConfirm={onDelete} okText="Sí" cancelText="No" disabled={disabled}>
      <Button type="primary" danger disabled={disabled}>
        Eliminar
      </Button>
    </Popconfirm>
  );
};

export default React.memo(DeleteButton);
