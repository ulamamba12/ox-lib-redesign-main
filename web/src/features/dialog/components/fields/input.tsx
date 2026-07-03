/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { createStyles, PasswordInput, TextInput } from '@mantine/core';
import React from 'react';
import { IInput } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  register: UseFormRegisterReturn;
  row: IInput;
  index: number;
}

const goldFieldStyles: any = {
  label: {
    color: '#ffdc83',
    fontWeight: 800,
    letterSpacing: 0.5,
    textShadow: '0 0 10px rgba(255, 205, 89, 0.35)',
  },
  description: {
    color: 'rgba(255, 235, 185, 0.58)',
    fontSize: 12,
  },
  input: {
    height: 42,
    color: '#fff3cf',
    borderRadius: 10,
    border: '1px solid rgba(212, 175, 55, 0.48)',
    background:
      'linear-gradient(180deg, rgba(29, 29, 29, 0.86), rgba(9, 9, 9, 0.84))',
    boxShadow:
      'inset 0 1px 0 rgba(255, 240, 185, 0.08), inset 0 -8px 14px rgba(0, 0, 0, 0.32), 0 8px 18px rgba(0, 0, 0, 0.28)',
    transition: '180ms ease',

    '&:focus': {
      borderColor: '#ffcf5a',
      boxShadow:
        '0 0 0 1px rgba(255, 207, 90, 0.38), 0 0 18px rgba(255, 195, 65, 0.32), inset 0 1px 0 rgba(255, 240, 185, 0.12)',
    },

    '&::placeholder': {
      color: 'rgba(255, 230, 165, 0.32)',
    },
  },
  icon: {
    color: '#d4af37',
  },
  required: {
    color: '#ffcf5a',
  },
};

const useStyles = createStyles(() => ({
  eyeIcon: {
    color: '#d4af37',
    filter: 'drop-shadow(0 0 6px rgba(255, 207, 90, 0.35))',
  },
}));

const InputField: React.FC<Props> = (props) => {
  const { classes } = useStyles();

  return (
    <>
      {!props.row.password ? (
        <TextInput
          {...props.register}
          defaultValue={props.row.default}
          label={props.row.label}
          description={props.row.description}
          icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
          placeholder={props.row.placeholder}
          minLength={props.row.min}
          maxLength={props.row.max}
          disabled={props.row.disabled}
          withAsterisk={props.row.required}
          styles={goldFieldStyles}
        />
      ) : (
        <PasswordInput
          {...props.register}
          defaultValue={props.row.default}
          label={props.row.label}
          description={props.row.description}
          icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
          placeholder={props.row.placeholder}
          minLength={props.row.min}
          maxLength={props.row.max}
          disabled={props.row.disabled}
          withAsterisk={props.row.required}
          styles={goldFieldStyles}
          visibilityToggleIcon={({ reveal, size }) => (
            <LibIcon
              icon={reveal ? 'eye-slash' : 'eye'}
              fontSize={size}
              cursor="pointer"
              className={classes.eyeIcon}
              fixedWidth
            />
          )}
        />
      )}
    </>
  );
};

export default InputField;
