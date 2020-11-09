import { ReloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { TooltipPropsWithOverlay, TooltipPropsWithTitle } from 'antd/lib/tooltip';
import moment from 'moment';
import React, { useRef, useState } from 'react';

interface RefreshButtonProps {
  disabled: boolean;
  running: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  task?: () => Promise<void>;
}

export const RefreshButton = React.memo((props: RefreshButtonProps) => {
  const { disabled, running, setRefresh, task } = props;

  const [show, setShow] = useState(false);

  const onVisibleChange = (show: boolean) => {
    setShow(show);
  };

  return (
    <Tooltip title="Actualizar" visible={show} onVisibleChange={onVisibleChange}>
      <Button
        style={{ paddingTop: 0 }}
        disabled={disabled}
        type="link"
        icon={<ReloadOutlined spin={running} />}
        onClick={() => {
          setShow(false);
          const init = moment().valueOf();
          setRefresh(true);
          task &&
            task().finally(() => {
              const end = moment().valueOf();
              const animationTime = Math.ceil((end - init) / 1000) * 1000;
              //console.log(animationTime);
              setTimeout(() => setRefresh(false), animationTime);
            });
        }}
      />
    </Tooltip>
  );
});
