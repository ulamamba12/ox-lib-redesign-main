/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { MultiSelect, Select } from '@mantine/core';
import { ISelect } from '../../../../typings';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: ISelect;
  index: number;
  control: Control<FormValues>;
}

const goldSelectStyles: any = {
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
    minHeight: 42,
    color: '#fff3cf',
    borderRadius: 10,
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
  },
  icon: {
    color: '#d4af37',
  },
  rightSection: {
    color: '#d4af37',
  },
  dropdown: {
    borderRadius: 12,
    border: '1px solid rgba(212, 175, 55, 0.48)',
    background: 'rgba(18, 18, 18, 0.96)',
    boxShadow:
      '0 18px 40px rgba(0, 0, 0, 0.68), inset 0 1px 0 rgba(255, 235, 170, 0.08)',
  },
  item: {
    color: '#fff0c6',
    borderRadius: 8,
    margin: 4,

    '&[data-hovered]': {
      background: 'rgba(212, 175, 55, 0.16)',
      color: '#ffdc83',
    },

    '&[data-selected]': {
      background:
        'linear-gradient(180deg, rgba(255, 224, 138, 0.34), rgba(144, 106, 24, 0.36))',
      color: '#fff2c8',
    },
  },
  value: {
    background: 'rgba(212, 175, 55, 0.16)',
    border: '1px solid rgba(212, 175, 55, 0.32)',
    color: '#ffdc83',
  },
  required: {
    color: '#ffcf5a',
  },
};

const SelectField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
  });

  return (
    <>
      {props.row.type === 'select' ? (
        <Select
          data={props.row.options}
          value={controller.field.value}
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={controller.field.onChange}
          disabled={props.row.disabled}
          label={props.row.label}
          description={props.row.description}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          searchable={props.row.searchable}
          icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
          styles={goldSelectStyles}
        />
      ) : (
        <>
          {props.row.type === 'multi-select' && (
            <MultiSelect
              data={props.row.options}
              value={controller.field.value}
              name={controller.field.name}
              ref={controller.field.ref}
              onBlur={controller.field.onBlur}
              onChange={controller.field.onChange}
              disabled={props.row.disabled}
              label={props.row.label}
              description={props.row.description}
              withAsterisk={props.row.required}
              clearable={props.row.clearable}
              searchable={props.row.searchable}
              maxSelectedValues={props.row.maxSelectedValues}
              icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
              styles={goldSelectStyles}
            />
          )}
        </>
      )}
    </>
  );
};

export default SelectField;
