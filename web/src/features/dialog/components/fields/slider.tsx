/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { Box, Slider, Text } from '@mantine/core';
import { ISlider } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';

interface Props {
  row: ISlider;
  index: number;
  control: Control<FormValues>;
}

const goldSliderStyles: any = {
  track: {
    height: 10,
    borderRadius: 999,
    background:
      'linear-gradient(180deg, rgba(16, 16, 16, 0.92), rgba(42, 42, 42, 0.72))',
    border: '1px solid rgba(212, 175, 55, 0.28)',
    boxShadow:
      'inset 0 3px 8px rgba(0, 0, 0, 0.65), 0 0 16px rgba(255, 198, 74, 0.1)',
  },
  bar: {
    background:
      'linear-gradient(90deg, #7a5612 0%, #d4af37 48%, #ffe08a 100%)',
    boxShadow: '0 0 18px rgba(255, 198, 74, 0.48)',
  },
  thumb: {
    width: 22,
    height: 22,
    border: '2px solid #ffe08a',
    background:
      'radial-gradient(circle at 35% 30%, #fff2bc 0%, #d4af37 42%, #6b4a12 100%)',
    boxShadow:
      '0 0 18px rgba(255, 198, 74, 0.62), 0 8px 14px rgba(0, 0, 0, 0.5)',
  },
  mark: {
    borderColor: 'rgba(255, 220, 131, 0.5)',
    backgroundColor: '#161616',
  },
  markLabel: {
    color: 'rgba(255, 235, 185, 0.72)',
    fontSize: 11,
  },
  label: {
    background: '#d4af37',
    color: '#100d07',
    fontWeight: 800,
  },
};

const SliderField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    defaultValue: props.row.default ?? props.row.min ?? 0,
  });

  return (
    <Box
      sx={{
        padding: 12,
        borderRadius: 14,
        border: '1px solid rgba(212, 175, 55, 0.28)',
        background:
          'linear-gradient(180deg, rgba(30, 30, 30, 0.62), rgba(9, 9, 9, 0.5))',
        boxShadow:
          'inset 0 1px 0 rgba(255, 240, 185, 0.06), 0 8px 18px rgba(0, 0, 0, 0.26)',
      }}
    >
      <Text
        sx={{
          fontSize: 14,
          fontWeight: 800,
          color: '#ffdc83',
          letterSpacing: 0.5,
          marginBottom: 12,
          textShadow: '0 0 10px rgba(255, 205, 89, 0.35)',
        }}
      >
        {props.row.label}
      </Text>

      <Slider
        mb={10}
        value={controller.field.value}
        name={controller.field.name}
        ref={controller.field.ref}
        onBlur={controller.field.onBlur}
        onChange={controller.field.onChange}
        defaultValue={props.row.default ?? props.row.min ?? 0}
        min={props.row.min}
        max={props.row.max}
        step={props.row.step}
        disabled={props.row.disabled}
        marks={[
          { value: props.row.min ?? 0, label: props.row.min ?? 0 },
          { value: props.row.max ?? 100, label: props.row.max ?? 100 },
        ]}
        styles={goldSliderStyles}
      />
    </Box>
  );
};

export default SliderField;
