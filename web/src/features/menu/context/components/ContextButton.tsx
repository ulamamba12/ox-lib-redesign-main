/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import React from 'react';
import {
  Button,
  createStyles,
  Group,
  HoverCard,
  Image,
  Progress,
  Stack,
  Text,
  Box,
} from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui('openContext', { id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const goldProgressStyle = {
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
    border: '1px solid rgba(214, 166, 55, 0.18)',
  },
  bar: {
    background:
      'linear-gradient(90deg, #8b5e13 0%, #d79d2f 30%, #ffe49b 52%, #b77d22 100%)',
    boxShadow:
      '0 0 8px rgba(255, 210, 107, 0.55), inset 0 1px 0 rgba(255, 244, 190, 0.45)',
  },
};

const useStyles = createStyles(
  (_, params: { disabled?: boolean; readOnly?: boolean }) => ({
    button: {
      position: 'relative',
      width: '100%',
      height: 'fit-content',
      minHeight: 58,

      // FIX: padding kiri ditambah agar garis vertical tidak terlalu dekat dengan icon/text
      padding: '12px 14px 12px 22px',

      borderRadius: 16,
      overflow: 'hidden',
      transformStyle: 'preserve-3d',

      background: params.disabled
        ? 'linear-gradient(145deg, rgba(52, 55, 62, 0.88) 0%, rgba(40, 42, 48, 0.82) 52%, rgba(25, 26, 30, 0.84) 100%)'
        : 'linear-gradient(145deg, rgba(62, 59, 50, 0.84) 0%, rgba(24, 23, 22, 0.80) 45%, rgba(6, 6, 7, 0.78) 100%)',

      border: params.disabled
        ? '1px solid rgba(135, 135, 135, 0.18)'
        : '1px solid rgba(225, 178, 63, 0.46)',

      outline: 'none',

      boxShadow: params.disabled
        ? '0 5px 0 rgba(0, 0, 0, 0.24), 0 14px 20px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -2px 0 rgba(0,0,0,0.58)'
        : '0 5px 0 rgba(43, 28, 5, 0.70), 0 15px 22px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 238, 174, 0.22), inset 0 -2px 0 rgba(59, 38, 6, 0.82), inset 2px 0 0 rgba(255, 219, 116, 0.08)',

      transition:
        'transform 160ms ease, border-color 160ms ease, background 160ms ease, box-shadow 160ms ease',

      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 1,
        borderRadius: 15,
        pointerEvents: 'none',
        background:
          'linear-gradient(120deg, rgba(255, 239, 185, 0.10) 0%, transparent 28%, transparent 68%, rgba(0, 0, 0, 0.28) 100%)',
        opacity: params.disabled ? 0.18 : 0.7,
      },

      // FIX: garis vertical dipindahkan sedikit ke kanan
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 8,
        top: 12,
        bottom: 12,
        width: 3,
        borderRadius: 99,
        pointerEvents: 'none',
        background:
          'linear-gradient(180deg, transparent 0%, rgba(255, 222, 130, 0.95) 45%, rgba(135, 87, 18, 0.75) 100%)',
        boxShadow: '0 0 10px rgba(255, 208, 102, 0.42)',
        opacity: params.disabled ? 0.3 : 0.95,
      },

      '&:hover': {
        cursor: params.readOnly ? 'default' : 'pointer',
        transform: params.readOnly
          ? 'unset'
          : 'perspective(900px) rotateX(4deg) rotateY(-1.5deg) translateY(-3px)',

        borderColor: params.readOnly
          ? 'rgba(225, 178, 63, 0.46)'
          : 'rgba(255, 220, 130, 0.78)',

        background: params.readOnly
          ? undefined
          : 'linear-gradient(145deg, rgba(76, 70, 56, 0.88) 0%, rgba(30, 28, 25, 0.84) 45%, rgba(9, 9, 10, 0.82) 100%)',

        boxShadow: params.readOnly
          ? undefined
          : '0 7px 0 rgba(52, 33, 5, 0.74), 0 22px 30px rgba(0, 0, 0, 0.46), 0 0 18px rgba(218, 176, 76, 0.18), inset 0 1px 0 rgba(255, 238, 174, 0.28), inset 0 -2px 0 rgba(64, 41, 5, 0.86)',
      },

      '&:active': {
        transform: params.readOnly
          ? 'unset'
          : 'perspective(900px) rotateX(1deg) translateY(2px)',

        boxShadow: params.readOnly
          ? undefined
          : '0 2px 0 rgba(43, 28, 5, 0.72), 0 8px 14px rgba(0, 0, 0, 0.36), inset 0 2px 6px rgba(0, 0, 0, 0.38)',
      },

      '&:focus': {
        outline: 'none',
      },

      '&:focus-visible': {
        outline: 'none',
      },
    },

    inner: {
      justifyContent: 'flex-start',
      alignItems: 'center',
    },

    label: {
      width: '100%',
      whiteSpace: 'normal',
      color: params.disabled ? 'rgba(215, 215, 215, 0.38)' : '#f3f0e6',
      position: 'relative',
      zIndex: 2,
    },

    buttonGroup: {
      width: '100%',
      gap: 10,
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    mainGroup: {
      flex: 1,
      gap: 10,
      flexWrap: 'nowrap',
      alignItems: 'center',
      minWidth: 0,
    },

    buttonIconContainer: {
      width: 38,
      height: 38,
      minWidth: 38,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',

      background:
        'linear-gradient(145deg, rgba(255, 221, 130, 0.18) 0%, rgba(33, 25, 12, 0.54) 48%, rgba(0, 0, 0, 0.34) 100%)',

      border: '1px solid rgba(225, 178, 63, 0.48)',

      boxShadow:
        '0 3px 0 rgba(60, 39, 7, 0.75), 0 8px 12px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 241, 188, 0.22), inset 0 -2px 0 rgba(55, 34, 4, 0.82)',

      color: '#f8d889',
    },

    iconImage: {
      maxWidth: 26,
      maxHeight: 26,
      objectFit: 'contain',
      filter:
        'drop-shadow(0 1px 0 rgba(0,0,0,0.85)) drop-shadow(0 0 7px rgba(218, 176, 76, 0.42))',
    },

    buttonStack: {
      flex: 1,
      minWidth: 0,
    },

    buttonTitleText: {
      fontSize: 14,
      fontWeight: 900,
      letterSpacing: 0.35,
      color: params.disabled ? 'rgba(210, 210, 210, 0.42)' : '#ffe7a8',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
      textShadow: params.disabled
        ? 'none'
        : '0 1px 0 rgba(0, 0, 0, 0.95), 0 0 8px rgba(218, 176, 76, 0.32)',

      '& p': {
        margin: 0,
      },
    },

    description: {
      fontSize: 12,
      lineHeight: 1.35,
      color: params.disabled ? 'rgba(180, 180, 180, 0.34)' : '#eee1c3',
      overflowWrap: 'break-word',
      textShadow: '0 1px 0 rgba(0,0,0,0.85)',

      '& p': {
        margin: 0,
      },
    },

    progress: {
      marginTop: 4,
      height: 7,
      borderRadius: 99,
      overflow: 'hidden',
      boxShadow:
        'inset 0 1px 2px rgba(0, 0, 0, 0.85), 0 1px 0 rgba(255, 233, 166, 0.08)',
    },

    buttonArrowContainer: {
      width: 30,
      height: 30,
      minWidth: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,

      color: '#f9db86',
      background:
        'linear-gradient(145deg, rgba(255, 221, 130, 0.16), rgba(0, 0, 0, 0.34))',
      border: '1px solid rgba(225, 178, 63, 0.42)',

      boxShadow:
        '0 3px 0 rgba(53, 34, 5, 0.76), 0 8px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 241, 188, 0.18)',
    },

    dropdown: {
      padding: 12,
      color: '#f2ead8',
      fontSize: 13,
      maxWidth: 300,
      width: 300,
      borderRadius: 16,

      background:
        'linear-gradient(145deg, rgba(35, 33, 29, 0.98), rgba(10, 10, 11, 0.96))',
      border: '1px solid rgba(218, 176, 76, 0.48)',

      boxShadow:
        '0 7px 0 rgba(42, 27, 5, 0.78), 0 24px 38px rgba(0, 0, 0, 0.62), inset 0 1px 0 rgba(255, 235, 170, 0.18)',
      backdropFilter: 'blur(8px)',
    },

    previewTitle: {
      color: '#ffe4a2',
      fontSize: 13,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      textShadow:
        '0 1px 0 rgba(0,0,0,0.95), 0 0 10px rgba(218, 176, 76, 0.35)',
      paddingBottom: 6,
      borderBottom: '1px solid rgba(218, 176, 76, 0.25)',
    },

    previewTable: {
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(218, 176, 76, 0.28)',
      background: 'rgba(0, 0, 0, 0.26)',
      boxShadow:
        'inset 0 1px 0 rgba(255, 235, 170, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.68)',
    },

    previewRow: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 10,
      padding: '8px 10px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',

      '&:last-child': {
        borderBottom: 'none',
      },
    },

    previewLabel: {
      color: '#d4c7a6',
      fontSize: 12,
      fontWeight: 700,
      flex: 1,
      overflowWrap: 'break-word',
    },

    previewValue: {
      color: '#ffe4a2',
      fontSize: 12,
      fontWeight: 800,
      textAlign: 'right',
      flex: 1,
      overflowWrap: 'break-word',
    },

    previewProgressWrap: {
      padding: '0 10px 8px 10px',
    },

    hoverImage: {
      maxWidth: 276,
      borderRadius: 12,
      border: '1px solid rgba(218, 176, 76, 0.28)',
      boxShadow: '0 0 18px rgba(218, 176, 76, 0.16)',
      marginBottom: 8,
    },
  })
);

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];

  const { classes } = useStyles({
    disabled: button.disabled,
    readOnly: button.readOnly,
  });

  const title = button.title || (Number.isNaN(Number(buttonKey)) ? buttonKey : undefined);

  const hasMetadata =
    button.metadata !== undefined &&
    button.metadata !== null &&
    ((Array.isArray(button.metadata) && button.metadata.length > 0) ||
      (typeof button.metadata === 'object' &&
        !Array.isArray(button.metadata) &&
        Object.keys(button.metadata as object).length > 0));

  const hasHoverContent = Boolean(button.image || hasMetadata);

  const handleClick = () => {
    if (button.disabled || button.readOnly) return;

    if (button.menu) {
      openMenu(button.menu);
      return;
    }

    clickContext(buttonKey);
  };

  const formatValue = (value: unknown) => {
    if (value === undefined || value === null) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const renderMetadata = () => {
    if (!button.metadata) return null;

    if (Array.isArray(button.metadata)) {
      return (
        <Box className={classes.previewTable}>
          {button.metadata.map((metadata: any, index) => {
            if (typeof metadata === 'string') {
              return (
                <Box className={classes.previewRow} key={`metadata-${index}`}>
                  <Text className={classes.previewLabel}>{metadata}</Text>
                </Box>
              );
            }

            return (
              <React.Fragment key={`metadata-${index}`}>
                <Box className={classes.previewRow}>
                  <Text className={classes.previewLabel}>
                    {metadata.label || `Info ${index + 1}`}
                  </Text>

                  <Text className={classes.previewValue}>
                    {formatValue(metadata.value)}
                  </Text>
                </Box>

                {metadata.progress !== undefined && (
                  <Box className={classes.previewProgressWrap}>
                    <Progress
                      value={metadata.progress}
                      size="xs"
                      radius="xl"
                      color={metadata.colorScheme || 'yellow'}
                      styles={goldProgressStyle}
                    />
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </Box>
      );
    }

    if (typeof button.metadata === 'object') {
      return (
        <Box className={classes.previewTable}>
          {Object.entries(button.metadata).map(([key, value], index) => (
            <Box className={classes.previewRow} key={`metadata-object-${index}`}>
              <Text className={classes.previewLabel}>{key}</Text>
              <Text className={classes.previewValue}>{formatValue(value)}</Text>
            </Box>
          ))}
        </Box>
      );
    }

    return null;
  };

  return (
    <HoverCard
      width={300}
      position="right-start"
      withArrow
      shadow="md"
      disabled={!hasHoverContent}
      openDelay={150}
      closeDelay={80}
      withinPortal
    >
      <HoverCard.Target>
        <Button
          className={classes.button}
          classNames={{
            inner: classes.inner,
            label: classes.label,
          }}
          variant="default"
          disabled={button.disabled}
          onClick={handleClick}
        >
          <Group className={classes.buttonGroup}>
            <Group className={classes.mainGroup}>
              {button.icon && (
                <Group className={classes.buttonIconContainer}>
                  {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                    <Image src={button.icon} className={classes.iconImage} />
                  ) : (
                    <LibIcon
                      icon={button.icon as IconProp}
                      fixedWidth
                      color={button.iconColor || '#f4cf78'}
                      animation={button.iconAnimation}
                    />
                  )}
                </Group>
              )}

              <Stack className={classes.buttonStack} spacing={4}>
                {title && (
                  <Text className={classes.buttonTitleText}>
                    <ReactMarkdown components={MarkdownComponents}>
                      {title}
                    </ReactMarkdown>
                  </Text>
                )}

                {button.description && (
                  <Text className={classes.description}>
                    <ReactMarkdown components={MarkdownComponents}>
                      {button.description}
                    </ReactMarkdown>
                  </Text>
                )}

                {button.progress !== undefined && (
                  <Progress
                    value={button.progress}
                    size="sm"
                    radius="xl"
                    className={classes.progress}
                    styles={goldProgressStyle}
                  />
                )}
              </Stack>
            </Group>

            {(button.menu || button.arrow) && button.arrow !== false && (
              <Group className={classes.buttonArrowContainer}>
                <LibIcon icon="chevron-right" fixedWidth color="#f9db86" />
              </Group>
            )}
          </Group>
        </Button>
      </HoverCard.Target>

      <HoverCard.Dropdown className={classes.dropdown}>
        <Stack spacing={8}>
          {button.image && <Image src={button.image} className={classes.hoverImage} />}
          {title && <Text className={classes.previewTitle}>{title}</Text>}
          {renderMetadata()}
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default ContextButton;
