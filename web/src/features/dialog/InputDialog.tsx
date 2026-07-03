/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { Box, Button, createStyles, Group, Modal } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const useStyles = createStyles(() => ({
  shell: {
    position: 'relative',
    width: '100%',
    padding: 14,
    borderRadius: 20,
    background:
      'linear-gradient(145deg, rgba(34, 34, 34, 0.82), rgba(8, 8, 8, 0.76))',
    border: '1px solid rgba(224, 178, 74, 0.56)',
    boxShadow:
      '0 26px 60px rgba(0, 0, 0, 0.72), inset 0 1px 0 rgba(255, 235, 170, 0.16), inset 0 -18px 36px rgba(0, 0, 0, 0.24)',
    overflow: 'hidden',
    transform: 'perspective(900px) rotateX(0.7deg)',

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background:
        'linear-gradient(120deg, transparent 0%, rgba(255, 210, 94, 0.12) 20%, transparent 36%, transparent 70%, rgba(255, 210, 94, 0.08) 86%, transparent 100%)',
      opacity: 0.85,
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 18,
      right: 18,
      top: 0,
      height: 1,
      background:
        'linear-gradient(90deg, transparent, rgba(255, 221, 132, 0.9), transparent)',
      boxShadow: '0 0 18px rgba(255, 198, 74, 0.75)',
      pointerEvents: 'none',
    },
  },

  content: {
    position: 'relative',
    zIndex: 2,
    maxHeight: '72vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: 4,

    '&::-webkit-scrollbar': {
      width: 4,
    },

    '&::-webkit-scrollbar-track': {
      background: 'rgba(0, 0, 0, 0.18)',
      borderRadius: 999,
    },

    '&::-webkit-scrollbar-thumb': {
      background:
        'linear-gradient(180deg, rgba(255, 225, 135, 0.8), rgba(161, 114, 25, 0.8))',
      borderRadius: 999,
      boxShadow: '0 0 10px rgba(255, 198, 74, 0.55)',
    },
  },

  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 10,

    '@media (max-width: 680px)': {
      gridTemplateColumns: '1fr',
    },
  },

  fieldItem: {
    minWidth: 0,
  },

  fieldWide: {
    gridColumn: '1 / -1',
  },

  buttonArea: {
    marginTop: 12,
    paddingTop: 10,
    borderTop: '1px solid rgba(212, 175, 55, 0.18)',
  },

  buttonCancel: {
    minWidth: 104,
    height: 36,
    borderRadius: 10,
    color: 'rgba(255, 232, 167, 0.9)',
    border: '1px solid rgba(212, 175, 55, 0.38)',
    background:
      'linear-gradient(180deg, rgba(35, 35, 35, 0.9), rgba(12, 12, 12, 0.94))',
    boxShadow:
      '0 10px 20px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.07)',
    letterSpacing: 0.9,
    fontWeight: 800,

    '&:hover': {
      background:
        'linear-gradient(180deg, rgba(58, 48, 24, 0.9), rgba(18, 18, 18, 0.95))',
      borderColor: 'rgba(255, 205, 89, 0.65)',
      transform: 'translateY(-1px)',
    },

    '&:disabled': {
      opacity: 0.35,
    },
  },

  buttonConfirm: {
    minWidth: 118,
    height: 36,
    borderRadius: 10,
    color: '#15100a',
    border: '1px solid rgba(255, 232, 145, 0.95)',
    background:
      'linear-gradient(180deg, #ffe08a 0%, #d4af37 48%, #8c6718 100%)',
    boxShadow:
      '0 0 18px rgba(255, 200, 76, 0.5), 0 12px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -4px 8px rgba(68, 42, 0, 0.38)',
    fontWeight: 900,
    letterSpacing: 1,

    '&:hover': {
      filter: 'brightness(1.1)',
      transform: 'translateY(-1px) scale(1.015)',
    },
  },
}));

const getDefaultValue = (row: InputProps['rows'][number]) => {
  if (row.type === 'checkbox') return row.checked ?? false;

  if (row.type === 'date' || row.type === 'date-range' || row.type === 'time') {
    if (row.default === true) return new Date().getTime();

    if (Array.isArray(row.default)) {
      return row.default.map((date) => new Date(date).getTime());
    }

    return row.default ? new Date(row.default).getTime() : null;
  }

  return row.default ?? null;
};

const InputDialog: React.FC = () => {
  const { classes, cx } = useStyles();

  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });

  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();

  const form = useForm<FormValues>({});

  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    form.reset();
    fieldForm.remove();

    data.rows.forEach((row, index) => {
      fieldForm.insert(index, {
        value: getDefaultValue(row),
      });

      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });

    setFields(data);
    setVisible(true);
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);

    await new Promise((resolve) => setTimeout(resolve, 200));

    form.reset();
    fieldForm.remove();

    if (dontPost) return;

    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);

    const values: any[] = [];

    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];

      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;

        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }

    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));

    await new Promise((resolve) => setTimeout(resolve, 200));

    form.reset();
    fieldForm.remove();

    fetchNui('inputData', values);
  });

  const isWideRow = (type: string) => {
    return type === 'textarea' || type === 'slider' || type === 'multi-select' || type === 'date-range';
  };

  return (
    <Modal
      opened={visible}
      onClose={handleClose}
      centered
      closeOnEscape={fields.options?.allowCancel !== false}
      closeOnClickOutside={false}
      size={fields.options?.size || 660}
      title={fields.heading}
      withCloseButton={false}
      overlayOpacity={0.58}
      transition="fade"
      exitTransitionDuration={150}
      styles={{
        overlay: {
          background:
            'radial-gradient(circle at center, rgba(212, 175, 55, 0.08), rgba(0, 0, 0, 0.72) 68%)',
        },
        modal: {
          padding: 0,
          background: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
        },
        body: {
          padding: 0,
        },
        header: {
          background: 'transparent',
          marginBottom: 0,
        },
        title: {
          width: '100%',
          padding: '0 14px 12px',
          textAlign: 'center',
          color: '#ffdc83',
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          textShadow:
            '0 0 16px rgba(255, 203, 89, 0.55), 0 2px 0 rgba(0, 0, 0, 0.75)',
        },
      }}
    >
      <Box className={classes.shell}>
        <form onSubmit={onSubmit}>
          <Box className={classes.content}>
            <Box className={classes.fieldGrid}>
              {fieldForm.fields.map((item, index) => {
                const row = fields.rows[index];

                return (
                  <Box
                    key={item.id}
                    className={cx(classes.fieldItem, isWideRow(row.type) && classes.fieldWide)}
                  >
                    {row.type === 'input' && (
                      <InputField
                        register={form.register(`test.${index}.value`, {
                          required: row.required,
                        })}
                        row={row}
                        index={index}
                      />
                    )}

                    {row.type === 'checkbox' && (
                      <CheckboxField
                        register={form.register(`test.${index}.value`, {
                          required: row.required,
                        })}
                        row={row}
                        index={index}
                      />
                    )}

                    {(row.type === 'select' || row.type === 'multi-select') && (
                      <SelectField row={row} index={index} control={form.control} />
                    )}

                    {row.type === 'number' && (
                      <NumberField control={form.control} row={row} index={index} />
                    )}

                    {row.type === 'slider' && (
                      <SliderField control={form.control} row={row} index={index} />
                    )}

                    {row.type === 'color' && (
                      <ColorField control={form.control} row={row} index={index} />
                    )}

                    {row.type === 'time' && (
                      <TimeField control={form.control} row={row} index={index} />
                    )}

                    {(row.type === 'date' || row.type === 'date-range') && (
                      <DateField control={form.control} row={row} index={index} />
                    )}

                    {row.type === 'textarea' && (
                      <TextareaField
                        register={form.register(`test.${index}.value`, {
                          required: row.required,
                        })}
                        row={row}
                        index={index}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>

            <Group position="right" spacing={10} className={classes.buttonArea}>
              <Button
                uppercase
                variant="default"
                onClick={() => handleClose()}
                disabled={fields.options?.allowCancel === false}
                className={classes.buttonCancel}
              >
                {locale.ui.cancel}
              </Button>

              <Button uppercase variant="light" type="submit" className={classes.buttonConfirm}>
                {locale.ui.confirm}
              </Button>
            </Group>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default InputDialog;
