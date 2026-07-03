/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { Box, Button, createStyles, Group, Modal, Stack } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const GOLD = '#d7aa42';
const GOLD_LIGHT = '#ffe7a3';
const GOLD_DARK = '#7b5516';

const useStyles = createStyles(() => ({
  overlay: {
    background:
      'radial-gradient(circle at center, rgba(30, 27, 18, 0.30) 0%, rgba(0, 0, 0, 0.62) 100%) !important',
  },

  modal: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 14,
    color: '#efe6cf',
    background: `
      linear-gradient(145deg, rgba(42, 42, 38, 0.78) 0%, rgba(16, 16, 15, 0.88) 55%, rgba(6, 6, 6, 0.92) 100%)
    `,
    border: '1px solid rgba(215, 170, 66, 0.62)',
    boxShadow: `
      0 30px 70px rgba(0, 0, 0, 0.82),
      0 0 38px rgba(215, 170, 66, 0.18),
      0 0 0 1px rgba(255, 231, 163, 0.10),
      inset 0 1px 0 rgba(255, 236, 180, 0.28),
      inset 0 -16px 35px rgba(0, 0, 0, 0.38)
    `,
    transform: 'perspective(950px) rotateX(2deg) translateZ(0)',

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: `
        linear-gradient(90deg, transparent 0%, rgba(255, 231, 163, 0.10) 45%, transparent 70%),
        repeating-linear-gradient(
          90deg,
          rgba(255, 231, 163, 0.035) 0px,
          rgba(255, 231, 163, 0.035) 1px,
          transparent 1px,
          transparent 46px
        )
      `,
      opacity: 0.55,
      zIndex: 0,
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      top: -130,
      right: -115,
      width: 310,
      height: 310,
      pointerEvents: 'none',
      background: 'radial-gradient(circle, rgba(215, 170, 66, 0.22), transparent 64%)',
      zIndex: 0,
    },
  },

  header: {
    position: 'relative',
    zIndex: 2,
    padding: '20px 28px 15px 28px',
    minHeight: 66,
    marginBottom: 0,
    background: `
      linear-gradient(90deg, rgba(215, 170, 66, 0.10), rgba(255, 231, 163, 0.04), rgba(215, 170, 66, 0.10)),
      linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(0, 0, 0, 0))
    `,
    borderBottom: '1px solid rgba(215, 170, 66, 0.34)',

    '&::before': {
      content: '""',
      position: 'absolute',
      left: 32,
      top: 18,
      bottom: 14,
      width: 3,
      borderRadius: 999,
      background: `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})`,
      boxShadow: '0 0 16px rgba(215, 170, 66, 0.85)',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 36,
      right: 36,
      bottom: -1,
      height: 1,
      background: `linear-gradient(90deg, transparent, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
      opacity: 0.85,
    },
  },

  title: {
    width: '100%',
    textAlign: 'center',
    color: GOLD_LIGHT,
    fontSize: 19,
    fontWeight: 900,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadow: `
      0 0 8px rgba(255, 231, 163, 0.45),
      0 0 18px rgba(215, 170, 66, 0.55),
      0 3px 3px rgba(0, 0, 0, 0.92)
    `,

    '& p': {
      margin: 0,
    },

    '& strong': {
      color: '#fff4c9',
    },
  },

  titleMarkdown: {
    width: '100%',

    '& p': {
      margin: 0,
    },
  },

  body: {
    position: 'relative',
    zIndex: 2,
    padding: '18px 30px 24px 30px',
  },

  contentStack: {
    color: '#eee4ce',
    fontSize: 14,
    lineHeight: 1.65,
    textShadow: '0 2px 2px rgba(0, 0, 0, 0.88)',

    '& p': {
      marginTop: 0,
      marginBottom: 10,
    },

    '& strong': {
      color: GOLD_LIGHT,
      fontWeight: 900,
    },

    '& code': {
      color: GOLD_LIGHT,
      background: 'rgba(215, 170, 66, 0.13)',
      border: '1px solid rgba(215, 170, 66, 0.30)',
      borderRadius: 5,
      padding: '2px 6px',
    },

    '& a': {
      color: GOLD_LIGHT,
      textDecoration: 'none',
    },

    '& ul, & ol': {
      marginTop: 6,
      marginBottom: 8,
      paddingLeft: 20,
    },
  },

  buttonGroup: {
    position: 'relative',
    marginTop: 28,
    paddingTop: 15,
    paddingRight: 34,
    borderTop: '1px solid rgba(215, 170, 66, 0.18)',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: -1,
      left: 0,
      right: 0,
      height: 1,
      background: `linear-gradient(90deg, transparent, rgba(215, 170, 66, 0.65), transparent)`,
      opacity: 0.72,
    },
  },

  confirmButton: {
    minWidth: 112,
    height: 38,
    borderRadius: 8,
    color: '#130d03',
    fontWeight: 950,
    letterSpacing: 0.9,
    background: `
      linear-gradient(180deg, #fff3be 0%, #f3d06b 18%, ${GOLD} 48%, #8a641d 100%)
    `,
    border: '1px solid rgba(255, 236, 180, 0.88)',
    boxShadow: `
      0 8px 0 rgba(91, 59, 10, 0.95),
      0 16px 28px rgba(0, 0, 0, 0.58),
      0 0 22px rgba(215, 170, 66, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.55),
      inset 0 -3px 6px rgba(73, 42, 0, 0.32)
    `,
    textShadow: '0 1px 0 rgba(255, 255, 255, 0.45)',
    transition: 'all 130ms ease',

    '&:hover': {
      transform: 'translateY(-2px)',
      filter: 'brightness(1.1)',
      boxShadow: `
        0 10px 0 rgba(91, 59, 10, 0.95),
        0 20px 32px rgba(0, 0, 0, 0.62),
        0 0 30px rgba(215, 170, 66, 0.52),
        inset 0 1px 0 rgba(255, 255, 255, 0.62)
      `,
    },

    '&:active': {
      transform: 'translateY(5px)',
      boxShadow: `
        0 3px 0 rgba(91, 59, 10, 0.95),
        0 8px 18px rgba(0, 0, 0, 0.58),
        inset 0 3px 7px rgba(0, 0, 0, 0.38)
      `,
    },
  },

  cancelButton: {
    minWidth: 98,
    height: 38,
    borderRadius: 8,
    color: '#e0d8c8',
    fontWeight: 900,
    letterSpacing: 0.8,
    background: `
      linear-gradient(180deg, rgba(70, 70, 66, 0.90), rgba(24, 24, 23, 0.92))
    `,
    border: '1px solid rgba(215, 170, 66, 0.34)',
    boxShadow: `
      0 7px 0 rgba(0, 0, 0, 0.78),
      0 14px 24px rgba(0, 0, 0, 0.52),
      inset 0 1px 0 rgba(255, 255, 255, 0.10)
    `,
    transition: 'all 130ms ease',

    '&:hover': {
      color: GOLD_LIGHT,
      transform: 'translateY(-2px)',
      borderColor: 'rgba(215, 170, 66, 0.65)',
      background: `
        linear-gradient(180deg, rgba(83, 72, 44, 0.92), rgba(26, 24, 20, 0.94))
      `,
      boxShadow: `
        0 9px 0 rgba(0, 0, 0, 0.78),
        0 18px 28px rgba(0, 0, 0, 0.56),
        0 0 18px rgba(215, 170, 66, 0.20)
      `,
    },

    '&:active': {
      transform: 'translateY(4px)',
      boxShadow: `
        0 3px 0 rgba(0, 0, 0, 0.8),
        0 8px 18px rgba(0, 0, 0, 0.48)
      `,
    },
  },

  topGlow: {
    position: 'absolute',
    top: 0,
    left: 34,
    right: 34,
    height: 1,
    background: `linear-gradient(90deg, transparent, ${GOLD_LIGHT}, transparent)`,
    opacity: 0.9,
    zIndex: 3,
    pointerEvents: 'none',
  },

  leftCorner: {
    position: 'absolute',
    left: 15,
    top: 5,
    width: 25,
    height: 25,
    borderTop: `2px solid ${GOLD}`,
    borderLeft: `2px solid ${GOLD}`,
    boxShadow: '-4px -4px 12px rgba(215, 170, 66, 0.18)',
    opacity: 0.75,
    zIndex: 3,
    pointerEvents: 'none',
  },

  rightCorner: {
    position: 'absolute',
    right: 25,
    bottom: 5,
    width: 25,
    height: 25,
    borderRight: `2px solid ${GOLD}`,
    borderBottom: `2px solid ${GOLD}`,
    boxShadow: '4px 4px 12px rgba(215, 170, 66, 0.18)',
    opacity: 0.75,
    zIndex: 3,
    pointerEvents: 'none',
  },

  bottomGlow: {
    position: 'absolute',
    left: 42,
    right: 42,
    bottom: 0,
    height: 1,
    background: `linear-gradient(90deg, transparent, rgba(215, 170, 66, 0.35), transparent)`,
    zIndex: 3,
    pointerEvents: 'none',
  },
}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes } = useStyles();

  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <Modal
      opened={opened}
      centered={dialogData.centered}
      size={dialogData.size || 'md'}
      overflow={dialogData.overflow ? 'inside' : 'outside'}
      closeOnClickOutside={false}
      onClose={() => closeAlert('cancel')}
      withCloseButton={false}
      overlayOpacity={0.5}
      exitTransitionDuration={150}
      transition="fade"
      classNames={{
        overlay: classes.overlay,
        modal: classes.modal,
        header: classes.header,
        title: classes.title,
        body: classes.body,
      }}
      title={
        <Box className={classes.titleMarkdown}>
          <ReactMarkdown components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>
        </Box>
      }
    >
      <Box className={classes.topGlow} />
      <Box className={classes.leftCorner} />
      <Box className={classes.rightCorner} />
      <Box className={classes.bottomGlow} />

      <Stack className={classes.contentStack}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            ...MarkdownComponents,
            img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
          }}
        >
          {dialogData.content}
        </ReactMarkdown>

        <Group position="right" spacing={10} className={classes.buttonGroup}>
          {dialogData.cancel && (
            <Button uppercase variant="default" className={classes.cancelButton} onClick={() => closeAlert('cancel')}>
              {dialogData.labels?.cancel || locale.ui.cancel}
            </Button>
          )}

          <Button uppercase variant="default" className={classes.confirmButton} onClick={() => closeAlert('confirm')}>
            {dialogData.labels?.confirm || locale.ui.confirm}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AlertDialog;
