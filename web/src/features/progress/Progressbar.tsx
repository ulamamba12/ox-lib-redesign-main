/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles(() => ({
  wrapper: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 16,
  },
  barArea: {
    width: 450,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  description: {
    width: '100%',
    marginBottom: 5,
    color: '#f7d127',
    fontFamily: '"Microma - serif"',
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: 0.4,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textShadow:
      '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 8px rgba(255, 190, 45, 0.75)',
  },
  barTrack: {
    position: 'relative',
    width: 450,
    height: 12,
    overflow: 'hidden',
    borderRadius: 999,
    background:
      'linear-gradient(180deg, rgba(55, 48, 32, 0.95) 0%, rgba(14, 12, 8, 0.98) 45%, rgba(3, 3, 2, 1) 100%)',
    boxShadow:
      '0 2px 4px rgba(0, 0, 0, 0.95), inset 0 1px 1px rgba(255, 235, 150, 0.25), inset 0 -2px 3px rgba(0, 0, 0, 0.95)',
    transform: 'perspective(500px) rotateX(2deg)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: 2,
      background:
        'linear-gradient(90deg, transparent, rgba(255, 238, 165, 0.5), transparent)',
      zIndex: 3,
      pointerEvents: 'none',
    },
  },
  fill: {
    position: 'relative',
    height: '100%',
    width: '0%',
    borderRadius: 999,
    overflow: 'hidden',
    background:
      'linear-gradient(180deg, #fff0a0 0%, #e3aa32 28%, #b8751f 62%, #5b340d 100%)',
    boxShadow:
      '0 0 12px rgba(225, 165, 42, 0.8), inset 0 1px 0 rgba(255, 250, 185, 0.85), inset 0 -3px 3px rgba(55, 31, 5, 0.9)',
    transition: 'width 0.04s linear',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '45%',
      background:
        'linear-gradient(180deg, rgba(255, 255, 220, 0.5), rgba(255, 255, 220, 0))',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-45%',
      width: '35%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 245, 170, 0.65), transparent)',
      animation: 're4-gold-shine 1.8s ease-in-out infinite',
      pointerEvents: 'none',
    },
  },
  percent: {
    width: 62,
    height: 16,
    display: 'flex',
    alignItems: 'center',
    color: '#e6bb20',
    fontFamily: '"Microma" sans-serif',
    fontSize: 16,
    fontWeight: 700,
    lineHeight: '16px',
    textAlign: 'left',

    textShadow:
      '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 7px rgba(255, 190, 45, 0.7)',
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();

  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('Loading...');
  const [percent, setPercent] = useState(0);

  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const clearTimers = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startProgress = (duration: number) => {
    clearTimers();

    completedRef.current = false;
    setPercent(0);

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const nextPercent = Math.min(100, Math.floor((elapsed / duration) * 100));

      setPercent(nextPercent);

      if (nextPercent >= 100) {
        if (!completedRef.current) {
          completedRef.current = true;
          fetchNui('progressComplete');

          timeoutRef.current = window.setTimeout(() => {
            setVisible(false);
            setPercent(0);
          }, 120);
        }

        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setLabel(data.label || 'Loading...');
    setVisible(true);
    startProgress(data.duration || 1000);
  });

  useNuiEvent('progressCancel', () => {
    completedRef.current = true;
    clearTimers();
    setVisible(false);
    setPercent(0);
  });

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Microma&display=swap');

          @keyframes re4-gold-shine {
            0% {
              left: -45%;
              opacity: 0;
            }

            40% {
              opacity: 1;
            }

            100% {
              left: 120%;
              opacity: 0;
            }
          }
        `}
      </style>

      {visible && (
        <Box className={classes.wrapper}>
          <Box className={classes.container}>
            <Box className={classes.barArea}>
              <Text className={classes.description}>{label}</Text>

              <Box className={classes.barTrack}>
                <Box
                  className={classes.fill}
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </Box>
            </Box>

            <Text className={classes.percent}>{percent}%</Text>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Progressbar;
