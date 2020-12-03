import { DownloadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Texts } from 'src/constants/texts';
import { BasicComponenetProps } from 'src/types';
import styles from './style.module.less';

interface ExportButtonProps extends BasicComponenetProps<HTMLButtonElement> {
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const ExportButton = React.memo((props: ExportButtonProps) => {
  const { disabled, loading, onClick } = props;

  return (
    <Button className={styles.button} icon={<DownloadOutlined />} disabled={disabled} loading={loading} onClick={onClick}>
      {loading ? Texts.EXPORTING : Texts.EXPORT}
    </Button>
  );
});
