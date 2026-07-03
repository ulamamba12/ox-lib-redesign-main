/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { Textarea } from '@mantine/core';
import { UseFormRegisterReturn } from 'react-hook-form';
import { ITextarea } from '../../../../typings/dialog';
import React from 'react';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  register: UseFormRegisterReturn;
  row: ITextarea;
  index: number;
}

const goldTextareaStyles: any = {
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
    color: '#fff3cf',
    borderRadius: 12,
    border: '1px solid rgba(212, 175, 55, 0.48)',
    background:
      'linear-gradient(180deg, rgba(29, 29, 29, 0.86), rgba(9, 9, 9, 0.84))',
    boxShadow:
      'inset 0 1px 0 rgba(255, 240, 185, 0.08), inset 0 -8px 14px rgba(0, 0, 0, 0.32), 0 8px 18px rgba(0, 0, 0, 0.28)',

    '&:focus': {
      borderColor: '#ffcf5a',
      boxShadow:
        '0 0 0 1px rgba(255, 207, 90, 0.38), 0 0 18px rgba(255, 195, 65, 0.32)',
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

const TextareaField: React.FC<Props> = (props) => {
  return (
    <Textarea
      {...props.register}
      defaultValue={props.row.default}
      label={props.row.label}
      description={props.row.description}
      icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
      placeholder={props.row.placeholder}
      disabled={props.row.disabled}
      withAsterisk={props.row.required}
      autosize={props.row.autosize}
      minRows={props.row.min}
      maxRows={props.row.max}
      minLength={props.row.minLength}
      maxLength={props.row.maxLength}
      styles={goldTextareaStyles}
    />
  );
};

export default TextareaField;
