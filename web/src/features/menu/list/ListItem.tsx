/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { Box, createStyles, Progress, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const useStyles = createStyles(
  (_theme, params: { iconColor?: string; hasIcon?: boolean }) => ({
    buttonContainer: {
      position: 'relative',
      overflow: 'hidden',
      height: 64,
      width: '100%',
      padding: 0,
      scrollMargin: 8,
      borderRadius: 15,
      background:
        'linear-gradient(145deg, rgba(25,25,25,0.86), rgba(52,52,52,0.46), rgba(14,14,14,0.92))',
      border: '1px solid rgba(255, 207, 78, 0.25)',
      boxShadow:
        '0 12px 26px rgba(0,0,0,0.58), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -12px 22px rgba(0,0,0,0.35)',
      transform: 'perspective(850px) translateZ(0)',
      transition:
        'transform 140ms ease, border-color 140ms ease, box-shadow 140ms ease, background 140ms ease',

      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background:
          'linear-gradient(90deg, transparent, rgba(255, 215, 94, 0.12), transparent)',
        transform: 'translateX(-120%)',
        transition: 'transform 350ms ease',
        pointerEvents: 'none',
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        left: 15,
        top: 10,
        width: 3,
        height: 42,
        zIndex: 1,
        borderRadius: 8,
        background:
          'linear-gradient(180deg, rgba(255,232,134,0.95), rgba(181,121,14,0.25))',
        boxShadow: '0 0 12px rgba(255,204,61,0.52)',
        opacity: 0.38,
        transition: 'opacity 140ms ease',
        pointerEvents: 'none',
      },

      '&:focus': {
        outline: 'none',
        transform:
          'perspective(850px) translateX(8px) translateZ(18px) scale(1.025)',
        borderColor: 'rgba(255, 218, 92, 0.9)',
        background:
          'linear-gradient(145deg, rgba(42,34,15,0.96), rgba(96,70,20,0.72), rgba(20,20,20,0.94))',
        boxShadow:
          '0 0 26px rgba(255, 201, 54, 0.38), 0 20px 38px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,236,153,0.25)',
      },

      '&:focus::before': {
        transform: 'translateX(120%)',
      },

      '&:focus::after': {
        opacity: 1,
      },
    },

    contentWrapper: {
      position: 'relative',
      zIndex: 5,
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: params.hasIcon ? '36px 1fr auto' : '1fr auto',
      alignItems: 'center',
      columnGap: 12,
      paddingLeft: params.hasIcon ? 42 : 48,
      paddingRight: 16,
      boxSizing: 'border-box',
    },

    iconContainer: {
      width: 36,
      height: 36,
      minWidth: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      background:
        'linear-gradient(145deg, rgba(255,216,90,0.14), rgba(0,0,0,0.22))',
      border: '1px solid rgba(255, 217, 100, 0.22)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
    },

    iconImage: {
      maxWidth: 28,
      maxHeight: 28,
      objectFit: 'contain',
      filter: 'drop-shadow(0 0 7px rgba(255,204,61,0.55))',
    },

    icon: {
      fontSize: 22,
      color: params.iconColor || '#f2c94c',
      filter: 'drop-shadow(0 0 7px rgba(255,204,61,0.55))',
    },

    textBlock: {
      minWidth: 0,
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },

    label: {
      display: 'block',
      width: '100%',
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: '#f4f0df',
      textTransform: 'uppercase',
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: 1.05,
      lineHeight: 1.25,
      textShadow: '0 1px 0 rgba(0,0,0,0.85)',
    },

    valueRow: {
      marginTop: 4,
      width: '100%',
      minWidth: 0,
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '14px 1fr 14px',
      alignItems: 'center',
      columnGap: 7,
    },

    value: {
      display: 'block',
      width: '100%',
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: '#ffd86b',
      textTransform: 'uppercase',
      fontSize: 13,
      fontWeight: 900,
      letterSpacing: 0.8,
      textShadow: '0 0 8px rgba(255,204,61,0.55)',
    },

    chevronIcon: {
      fontSize: 12,
      color: '#d2a538',
      opacity: 0.9,
      filter: 'drop-shadow(0 0 5px rgba(255,204,61,0.45))',
    },

    scrollIndexValue: {
      minWidth: 42,
      textAlign: 'right',
      color: 'rgba(255, 239, 184, 0.92)',
      textTransform: 'uppercase',
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: 1,
    },

    checkboxArea: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      minWidth: 32,
    },

    progressRoot: {
      marginTop: 7,
      height: 8,
      backgroundColor: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,213,96,0.18)',
      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.65)',
    },

    progressBar: {
      background:
        'linear-gradient(90deg, #6b4708 0%, #d9a72b 45%, #fff0a3 100%)',
      boxShadow: '0 0 12px rgba(255,204,61,0.72)',
    },
  })
);

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(
  ({ item, index, scrollIndex, checked }, ref) => {
    const hasIcon = !!item.icon;

    const { classes } = useStyles({
      iconColor: item.iconColor,
      hasIcon,
    });

    const setRef = (element: HTMLDivElement | null) => {
      if (!ref) return;

      const mutableRef = ref as React.MutableRefObject<
        Array<HTMLDivElement | null>
      >;

      mutableRef.current[index] = element;
    };

    const currentValue = Array.isArray(item.values)
      ? item.values[scrollIndex]
      : undefined;

    const currentValueLabel =
      typeof currentValue === 'object' && currentValue !== null
        ? currentValue.label
        : currentValue;

    return (
      <Box className={classes.buttonContainer} tabIndex={index} ref={setRef}>
        <Box className={classes.contentWrapper}>
          {item.icon && (
            <Box className={classes.iconContainer}>
              {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                <img src={item.icon} className={classes.iconImage} alt="" />
              ) : (
                <LibIcon
                  icon={item.icon as IconProp}
                  className={classes.icon}
                  fixedWidth
                  animation={item.iconAnimation}
                />
              )}
            </Box>
          )}

          {Array.isArray(item.values) ? (
            <>
              <Box className={classes.textBlock}>
                <Text className={classes.label}>{item.label}</Text>

                <Box className={classes.valueRow}>
                  <LibIcon icon="chevron-left" className={classes.chevronIcon} />

                  <Text className={classes.value}>
                    {currentValueLabel}
                  </Text>

                  <LibIcon icon="chevron-right" className={classes.chevronIcon} />
                </Box>
              </Box>

              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}/{item.values.length}
              </Text>
            </>
          ) : item.checked !== undefined ? (
            <>
              <Box className={classes.textBlock}>
                <Text className={classes.label}>{item.label}</Text>
              </Box>

              <Box className={classes.checkboxArea}>
                <CustomCheckbox checked={checked} />
              </Box>
            </>
          ) : item.progress !== undefined ? (
            <Box className={classes.textBlock}>
              <Text className={classes.label}>{item.label}</Text>

              <Progress
                value={item.progress}
                size="sm"
                radius="xl"
                classNames={{
                  root: classes.progressRoot,
                  bar: classes.progressBar,
                }}
              />
            </Box>
          ) : (
            <Box className={classes.textBlock}>
              <Text className={classes.label}>{item.label}</Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
);

export default React.memo(ListItem);
