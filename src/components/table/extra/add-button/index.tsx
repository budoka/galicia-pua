import { Button } from 'antd';
import React, { ReactChild, ReactNode, useEffect } from 'react';

interface AddButtonProps {
  editing: boolean;
  onAdd: () => void;
  onCancel: () => void;
}

export const AddButton = (props: AddButtonProps) => {
  const { editing, onAdd, onCancel } = props;

  return !editing ? (
    <Button type="primary" onClick={onAdd}>
      Agregar
    </Button>
  ) : (
    <Button type="ghost" onClick={onCancel}>
      Cancelar
    </Button>
  );
};

export default React.memo(AddButton);
