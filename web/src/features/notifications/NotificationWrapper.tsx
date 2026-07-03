/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, createStyles, keyframes, Stack, Text } from '@mantine/core';
import React from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const getNotifyColor = (type?: string) => {
  switch (type) {
    case 'success':
      return '#45f0a2';
    case 'error':
      return '#ff4d5d';
    case 'warning':
      return '#ffd447';
    case 'inform':
    case 'info':
      return '#4da3ff';
    default:
      return '#ffd36a';
  }
};

const HEX_POINTS = '30 3, 53 16.5, 53 43.5, 30 57, 7 43.5, 7 16.5';

const HexTimer: React.FC<{
  duration: number;
  showDuration: boolean;
  color: string;
  glow: string;
}> = ({ duration, showDuration, color, glow }) => {
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    if (!showDuration) {
      setOffset(0);
      return;
    }

    let frame: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);

      setOffset(progress);

      if (progress < 100) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [duration, showDuration]);

  return (
    <svg
      viewBox="0 0 60 60"
      width="64"
      height="64"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'visible',
      }}
    >
      {/* Isi dalam hexagon: dark-grey semi transparent */}
      <polygon
        points={HEX_POINTS}
        fill="rgba(38, 38, 38, 0.72)"
        stroke="none"
      />

      {/* Border dasar luar, bukan border dalam */}
      <polygon
        points={HEX_POINTS}
        fill="none"
        stroke="rgba(255, 211, 106, 0.22)"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Border timer luar yang berkurang */}
      {showDuration && (
        <polygon
          points={HEX_POINTS}
          pathLength="100"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="100"
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 7px ${glow})`,
          }}
        />
      )}
    </svg>
  );
};

const useStyles = createStyles(() => ({
  container: {
    width: 'fit-content',
    maxWidth: 430,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontFamily: 'Roboto, sans-serif',
  },
  iconHexOuter: {
    position: 'relative',
    width: 64,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: 'drop-shadow(0 0 12px rgba(255, 210, 106, 0.83)) drop-shadow(0 10px 14px rgba(0, 0, 0, 0.55))',
    transform: 'perspective(700px) rotateX(6deg)',
  },
  iconCenter: {
    position: 'relative',
    zIndex: 2,
    width: 34,
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--notify-color)',
    fontSize: 21,
    '& svg': {
      filter: 'drop-shadow(0 0 7px var(--notify-glow-strong))',
    },
  },
  contentBox: {
    position: 'relative',
    minWidth: 270,
    maxWidth: 350,
    padding: '12px 16px',
    background: 'linear-gradient(145deg, rgba(62, 62, 62, 0.7), rgba(28, 28, 28, 0.99))',
    border: '1px solid rgba(255, 210, 106, 0.47)',
    borderLeft: '4px solid var(--notify-color)',
    borderRadius: 8,
    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 0 14px rgba(255, 210, 106, 0.49), 0 10px 22px rgba(0, 0, 0, 0.6)',
    transform: 'perspective(800px) rotateX(2deg)',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: 2,
      background: 'linear-gradient(90deg, transparent, rgba(255, 211, 106, 0.95), rgba(255, 242, 176, 0.95), transparent)',
      boxShadow: '0 0 12px rgba(255, 211, 106, 0.7)',
    },
  },
  content: {
    position: 'relative',
    zIndex: 2,
  },
  title: {
  color: 'var(--notify-color)',
  fontSize: 14,
  fontWeight: 900,
  letterSpacing: 1.2,
  lineHeight: 1,
  textTransform: 'uppercase',
  fontFamily: 'Microma, sans-serif',
  textShadow: '0 1px 0 #000, 0 0 8px rgba(255, 211, 106, 0.9), 0 0 16px rgba(255, 190, 70, 0.45)',
  },
  description: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.45,
    fontFamily: 'Roboto-Italic, sans-serif',
    textShadow: '0 2px 2px rgba(0, 0, 0, 0.85)',
    '& p': {
      margin: 0,
    },
  },
  descriptionOnly: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.35,
    fontFamily: 'Roboto-Italic, sans-serif',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.85)',
    '& p': {
      margin: 0,
    },
  },
}));

const createAnimation = (from: string, to: string, visible: boolean) =>
  keyframes({
    from: {
      opacity: visible ? 0 : 1,
      transform: `translate${from}`,
    },
    to: {
      opacity: visible ? 1 : 0,
      transform: `translate${to}`,
    },
  });

const getAnimation = (visible: boolean, position: string) => {
  const animationOptions = visible ? '0.2s ease-out forwards' : '0.4s ease-in forwards';
  let animation: { from: string; to: string };

  if (visible) {
    animation = position.includes('bottom')
      ? { from: 'Y(30px)', to: 'Y(0px)' }
      : { from: 'Y(-30px)', to: 'Y(0px)' };
  } else {
    if (position.includes('right')) {
      animation = { from: 'X(0px)', to: 'X(100%)' };
    } else if (position.includes('left')) {
      animation = { from: 'X(0px)', to: 'X(-100%)' };
    } else if (position === 'top-center') {
      animation = { from: 'Y(0px)', to: 'Y(-100%)' };
    } else if (position === 'bottom-center') {
      animation = { from: 'Y(0px)', to: 'Y(100%)' };
    } else {
      animation = { from: 'X(0px)', to: 'X(100%)' };
    }
  }

  return `${createAnimation(animation.from, animation.to, visible)} ${animationOptions}`;
};

const Notifications: React.FC = () => {
  const { classes } = useStyles();

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;
    const showDuration = data.showDuration !== undefined ? data.showDuration : true;

    let position = data.position || 'top-right';

    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'triangle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }

    const accentColor = data.iconColor ? tinycolor(data.iconColor).toRgbString() : getNotifyColor(data.type);
    const accentGlow = tinycolor(accentColor).setAlpha(0.35).toRgbString();
    const accentGlowStrong = tinycolor(accentColor).setAlpha(0.9).toRgbString();

    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: getAnimation(t.visible, position),
            ...data.style,
          }}
          style={
            {
              '--notify-color': accentColor,
              '--notify-glow': accentGlow,
              '--notify-glow-strong': accentGlowStrong,
            } as React.CSSProperties
          }
          className={classes.container}
        >
          {data.icon && (
            <Box className={classes.iconHexOuter}>
              <HexTimer
                duration={duration}
                showDuration={showDuration}
                color={accentColor}
                glow={accentGlowStrong}
              />

              <Box className={classes.iconCenter}>
                <LibIcon icon={data.icon} fixedWidth animation={data.iconAnimation} />
              </Box>
            </Box>
          )}

          <Box className={classes.contentBox}>
            <Stack spacing={0} className={classes.content}>
              {data.title && <Text className={classes.title}>{data.title}</Text>}

              {data.description && (
                <ReactMarkdown
                  components={MarkdownComponents}
                  className={!data.title ? classes.descriptionOnly : classes.description}
                >
                  {data.description}
                </ReactMarkdown>
              )}
            </Stack>
          </Box>
        </Box>
      ),
      {
        id: toastId,
        duration: duration,
        position: position,
      }
    );
  });

  return <Toaster />;
};

export default Notifications;
