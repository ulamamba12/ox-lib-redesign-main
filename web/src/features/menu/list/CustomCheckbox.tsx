/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },

  input: {
    cursor: 'default',
    width: 22,
    height: 22,
    borderRadius: 7,
    background:
      'linear-gradient(145deg, rgba(16,16,16,0.96), rgba(48,48,48,0.72))',
    border: '1px solid rgba(255, 213, 96, 0.42)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 18px rgba(0,0,0,0.55)',

    '&:checked': {
      background:
        'linear-gradient(145deg, #fff3a6 0%, #d7a928 42%, #7b5208 100%)',
      borderColor: 'rgba(255, 230, 130, 0.95)',
      boxShadow:
        '0 0 16px rgba(255, 204, 61, 0.85), inset 0 1px 0 rgba(255,255,255,0.45)',
    },
  },

  inner: {
    '> svg': {
      width: 15,
      height: 15,
    },

    '> svg > path': {
      fill: '#151515',
    },
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();

  return (
    <Checkbox
      checked={checked}
      readOnly
      classNames={{
        root: classes.root,
        input: classes.input,
        inner: classes.inner,
      }}
    />
  );
};

export default CustomCheckbox;
