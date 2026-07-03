/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { Checkbox } from '@mantine/core';
import { ICheckbox } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  row: ICheckbox;
  index: number;
  register: UseFormRegisterReturn;
}

const goldCheckboxStyles: any = {
  root: {
    padding: 12,
    borderRadius: 12,
    border: '1px solid rgba(212, 175, 55, 0.34)',
    background:
      'linear-gradient(180deg, rgba(31, 31, 31, 0.62), rgba(10, 10, 10, 0.54))',
    boxShadow:
      'inset 0 1px 0 rgba(255, 240, 185, 0.06), 0 8px 18px rgba(0, 0, 0, 0.28)',
  },
  input: {
    borderRadius: 6,
    borderColor: 'rgba(212, 175, 55, 0.68)',
    backgroundColor: 'rgba(8, 8, 8, 0.82)',

    '&:checked': {
      background:
        'linear-gradient(180deg, #ffe08a 0%, #d4af37 48%, #8c6718 100%)',
      borderColor: '#ffdc83',
    },
  },
  icon: {
    color: '#111',
  },
  label: {
    color: '#fff0c6',
    fontWeight: 700,
    letterSpacing: 0.35,
  },
};

const CheckboxField: React.FC<Props> = (props) => {
  return (
    <Checkbox
      {...props.register}
      sx={{ display: 'flex' }}
      required={props.row.required}
      label={props.row.label}
      defaultChecked={props.row.checked}
      disabled={props.row.disabled}
      styles={goldCheckboxStyles}
    />
  );
};

export default CheckboxField;
