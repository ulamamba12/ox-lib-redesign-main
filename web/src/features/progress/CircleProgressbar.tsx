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
import { Box, createStyles, keyframes, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';

const windowsSpin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },

  // Dot muter sampai sini
  '55%': {
    transform: 'rotate(360deg)',
  },

  // Setelah itu diam sebentar saat dot hilang
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const windowsDotFade = keyframes({
  '0%': {
    opacity: 0,
  },

  '8%': {
    opacity: 0.2,
  },

  '20%': {
    opacity: 1,
  },

  '45%': {
    opacity: 1,
  },

  // Mulai fade out
  '58%': {
    opacity: 0,
  },

  // Jeda kosong sekitar 1 detik
  '100%': {
    opacity: 0,
  },
});

const dotPulse = keyframes({
  '0%': {
    opacity: 0.15,
  },
  '50%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0.15,
  },
});

const useStyles = createStyles((theme, params: { position: 'middle' | 'bottom' }) => ({
  container: {
    width: '100%',
    height: params.position === 'middle' ? '100%' : '20%',
    bottom: 0,
    position: 'absolute',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    pointerEvents: 'none',
  },

  spinnerWrapper: {
    position: 'relative',

    width: 96,
    height: 96,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: '50%',

    background:
      'radial-gradient(circle, rgba(35,35,35,0.36) 0%, rgba(20,20,20,0.24) 45%, transparent 72%)',

    filter:
      'drop-shadow(0 0 12px rgba(255, 211, 106, 0.35)) drop-shadow(0 8px 14px rgba(0,0,0,0.45))',
  },

  spinner: {
    position: 'absolute',
    width: 86,
    height: 86,
    animation: `${windowsSpin} 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
  },
  dot: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 7,
    height: 7,
    marginLeft: -3.5,
    marginTop: -3.5,
    borderRadius: '50%',
    background: '#ffd36a',
    boxShadow:
      '0 0 6px rgba(255, 211, 106, 0.95), 0 0 12px rgba(255, 190, 70, 0.55)',
    opacity: 0,
    animation: `${windowsDotFade} 1.5s ease-in-out infinite`,
  },
  percentText: {
    position: 'relative',
    zIndex: 5,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 0.8,
    fontFamily: 'Rajdhani, Roboto, sans-serif',
    textShadow:
      '0 1px 0 #000, 0 0 8px rgba(255, 211, 106, 0.75), 0 0 14px rgba(255, 190, 70, 0.35)',
  },
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const intervalRef = React.useRef<number | null>(null);
  const { classes } = useStyles({ position });
  const clearProgressInterval = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useNuiEvent('progressCancel', () => {
    clearProgressInterval();
    setVisible(false);
    setValue(0);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;

    clearProgressInterval();

    const duration = data.duration || 3000;
    const stepTime = duration / 100;

    setVisible(true);
    setValue(0);
    setPosition(data.position || 'middle');

    intervalRef.current = window.setInterval(() => {
      setValue((prev) => {
        const next = prev + 1;

        if (next >= 100) {
          clearProgressInterval();
          setVisible(false);
          return 100;
        }

        return next;
      });
    }, stepTime);
  });

  React.useEffect(() => {
    return () => clearProgressInterval();
  }, []);

  const dots = Array.from({ length: 12 });

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
        <Box className={classes.spinnerWrapper}>
          <Box className={classes.spinner}>
            {dots.map((_, index) => (
              <Box
                key={index}
                className={classes.dot}
                sx={{
                  transform: `rotate(${index * 30}deg) translateY(-38px)`,
                  animationDelay: `${index * 0.045}s`,
                }}
              />
            ))}
          </Box>

          <Text className={classes.percentText}>{Math.floor(value)}%</Text>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default CircleProgressbar;
