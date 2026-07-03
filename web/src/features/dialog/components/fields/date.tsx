/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { IDateInput } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import { DatePicker, DateRangePicker } from '@mantine/dates';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: IDateInput;
  index: number;
  control: Control<FormValues>;
}

const goldDateStyles: any = {
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
  dropdown: {
    background: 'rgba(18, 18, 18, 0.96)',
    border: '1px solid rgba(212, 175, 55, 0.45)',
    boxShadow: '0 18px 40px rgba(0, 0, 0, 0.68)',
  },
  calendarBase: {
    color: '#fff0c6',
  },
  day: {
    color: '#fff0c6',
    borderRadius: 8,

    '&[data-selected]': {
      background:
        'linear-gradient(180deg, #ffe08a 0%, #d4af37 52%, #8c6718 100%)',
      color: '#15100a',
      fontWeight: 800,
    },

    '&:hover': {
      background: 'rgba(212, 175, 55, 0.16)',
    },
  },
  required: {
    color: '#ffcf5a',
  },
};

const DateField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required, min: props.row.min, max: props.row.max },
  });

  return (
    <>
      {props.row.type === 'date' && (
        <DatePicker
          value={controller.field.value ? new Date(controller.field.value) : controller.field.value}
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={(date) => controller.field.onChange(date ? date.getTime() : null)}
          label={props.row.label}
          description={props.row.description}
          placeholder={props.row.format}
          disabled={props.row.disabled}
          inputFormat={props.row.format}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          icon={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
          minDate={props.row.min ? new Date(props.row.min) : undefined}
          maxDate={props.row.max ? new Date(props.row.max) : undefined}
          styles={goldDateStyles}
        />
      )}

      {props.row.type === 'date-range' && (
        <DateRangePicker
          value={
            controller.field.value
              ? controller.field.value[0]
                ? controller.field.value.map((date: Date) => new Date(date))
                : controller.field.value
              : controller.field.value
          }
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={(dates) =>
            controller.field.onChange(dates.map((date: Date | null) => (date ? date.getTime() : null)))
          }
          label={props.row.label}
          description={props.row.description}
          placeholder={props.row.format}
          disabled={props.row.disabled}
          inputFormat={props.row.format}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          icon={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
          minDate={props.row.min ? new Date(props.row.min) : undefined}
          maxDate={props.row.max ? new Date(props.row.max) : undefined}
          styles={goldDateStyles}
        />
      )}
    </>
  );
};

export default DateField;
