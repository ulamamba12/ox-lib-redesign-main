/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles(() => ({
  container: {
    position: 'relative',
    width: 384,
    height: 68,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    background:
      'linear-gradient(135deg, rgba(20,20,20,0.92), rgba(55,46,22,0.74), rgba(15,15,15,0.94))',
    border: '1px solid rgba(218, 165, 32, 0.42)',
    borderBottom: '1px solid rgba(255, 213, 96, 0.28)',
    boxShadow:
      '0 18px 42px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,230,150,0.28), inset 0 -14px 28px rgba(0,0,0,0.45)',
    transform: 'perspective(800px) rotateX(1deg)',

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background:
        'linear-gradient(90deg, transparent, rgba(255,215,90,0.18), transparent)',
      transform: 'translateX(-100%)',
      animation: 'goldSweep 3.2s ease-in-out infinite',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 18,
      right: 18,
      bottom: 7,
      height: 1,
      background:
        'linear-gradient(90deg, transparent, rgba(255,215,90,0.9), transparent)',
      boxShadow: '0 0 12px rgba(255, 199, 61, 0.75)',
    },

    '@keyframes goldSweep': {
      '0%': { transform: 'translateX(-120%)' },
      '45%': { transform: 'translateX(120%)' },
      '100%': { transform: 'translateX(120%)' },
    },
  },

  heading: {
    position: 'relative',
    zIndex: 2,
    color: '#f6d56a',
    fontSize: 21,
    fontWeight: 900,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    textShadow:
      '0 0 8px rgba(255,214,91,0.75), 0 2px 0 rgba(0,0,0,0.7)',
  },

  cornerLeft: {
    position: 'absolute',
    left: 13,
    top: 13,
    width: 34,
    height: 12,
    borderTop: '1px solid rgba(255,215,90,0.75)',
    borderLeft: '1px solid rgba(255,215,90,0.75)',
    opacity: 0.9,
  },

  cornerRight: {
    position: 'absolute',
    right: 13,
    top: 13,
    width: 34,
    height: 12,
    borderTop: '1px solid rgba(255,215,90,0.75)',
    borderRight: '1px solid rgba(255,215,90,0.75)',
    opacity: 0.9,
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.cornerLeft} />
      <Box className={classes.cornerRight} />
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);
