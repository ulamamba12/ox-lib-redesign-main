/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import React from 'react';
import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((_, params: { canClose?: boolean }) => ({
  button: {
    width: 46,
    minWidth: 46,
    minHeight: 46,
    padding: 0,
    borderRadius: 14,
    alignSelf: 'stretch',
    textAlign: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

    background:
      'linear-gradient(145deg, rgba(48, 45, 38, 0.96) 0%, rgba(21, 20, 19, 0.94) 50%, rgba(7, 7, 8, 0.94) 100%)',

    border: '1px solid rgba(230, 188, 82, 0.55)',

    boxShadow:
      '0 8px 0 rgba(42, 27, 5, 0.75), 0 18px 26px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 238, 174, 0.25), inset 0 -2px 0 rgba(62, 40, 6, 0.85)',

    transition:
      'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease',

    '&:hover': {
      transform: params.canClose === false
        ? 'unset'
        : 'perspective(800px) rotateX(4deg) translateY(-3px)',

      background:
        params.canClose === false
          ? undefined
          : 'linear-gradient(145deg, rgba(66, 60, 48, 0.98) 0%, rgba(25, 23, 20, 0.96) 50%, rgba(8, 8, 9, 0.96) 100%)',

      borderColor:
        params.canClose === false
          ? 'rgba(218, 176, 76, 0.22)'
          : 'rgba(255, 220, 130, 0.78)',

      boxShadow:
        params.canClose === false
          ? undefined
          : '0 10px 0 rgba(48, 31, 5, 0.78), 0 24px 32px rgba(0, 0, 0, 0.48), 0 0 18px rgba(218, 176, 76, 0.20), inset 0 1px 0 rgba(255, 238, 174, 0.30)',
    },

    '&:active': {
      transform: params.canClose === false ? 'unset' : 'translateY(2px)',
      boxShadow:
        params.canClose === false
          ? undefined
          : '0 3px 0 rgba(42, 27, 5, 0.75), 0 10px 18px rgba(0, 0, 0, 0.35), inset 0 2px 6px rgba(0, 0, 0, 0.35)',
    },

    '&:disabled': {
      opacity: 0.48,
      background:
        'linear-gradient(145deg, rgba(34, 34, 36, 0.68), rgba(13, 13, 15, 0.64))',
      borderColor: 'rgba(218, 176, 76, 0.18)',
    },
  },

  inner: {
    justifyContent: 'center',
  },

  label: {
    color: params.canClose === false ? 'rgba(198, 198, 198, 0.42)' : '#ffe39a',
    filter:
      params.canClose === false
        ? 'none'
        : 'drop-shadow(0 1px 0 rgba(0,0,0,0.9)) drop-shadow(0 0 8px rgba(218, 176, 76, 0.5))',
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      className={classes.button}
      classNames={{
        inner: classes.inner,
        label: classes.label,
      }}
      variant="default"
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </Button>
  );
};

export default HeaderButton;
