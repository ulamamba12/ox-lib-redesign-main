/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { TimeInput } from '@mantine/dates';
import { Control, useController } from 'react-hook-form';
import { ITimeInput } from '../../../../typings/dialog';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: ITimeInput;
  index: number;
  control: Control<FormValues>;
}

const goldTimeStyles: any = {
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

    '&:focus': {
      borderColor: '#ffcf5a',
      boxShadow:
        '0 0 0 1px rgba(255, 207, 90, 0.38), 0 0 18px rgba(255, 195, 65, 0.32)',
    },
  },
  icon: {
    color: '#d4af37',
  },
  required: {
    color: '#ffcf5a',
  },
};

const TimeField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
  });

  return (
    <TimeInput
      value={controller.field.value ? new Date(controller.field.value) : controller.field.value}
      name={controller.field.name}
      ref={controller.field.ref}
      onBlur={controller.field.onBlur}
      onChange={(date) => controller.field.onChange(date ? date.getTime() : null)}
      label={props.row.label}
      description={props.row.description}
      disabled={props.row.disabled}
      format={props.row.format || '12'}
      withAsterisk={props.row.required}
      clearable={props.row.clearable}
      icon={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
      styles={goldTimeStyles}
    />
  );
};

export default TimeField;
