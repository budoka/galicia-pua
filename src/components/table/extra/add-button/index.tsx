import { Button } from 'antd';
import React, { ReactChild, ReactNode, useEffect } from 'react';
import { Texts } from 'src/constants/texts';

interface AddButtonProps {
  editing: boolean;
  onAdd: () => void;
  onCancel: () => void;
}

export const AddButton = React.memo((props: AddButtonProps) => {
  const { editing, onAdd, onCancel } = props;

  return !editing ? (
    <Button type="primary" onClick={onAdd}>
      {Texts.ADD}
    </Button>
  ) : (
    <Button type="ghost" onClick={onCancel}>
      {Texts.CANCEL}
    </Button>
  );
});
