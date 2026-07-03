/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import React, { useRef, useState } from 'react';
import { Box, createStyles } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import Indicator from './indicator';

type GameDifficulty =
  | 'easy'
  | 'medium'
  | 'hard'
  | {
      areaSize: number;
      speedMultiplier: number;
    };

type SkillCheckData = {
  difficulty: GameDifficulty | GameDifficulty[];
  inputs?: string[];
};

export type SkillCheckState = {
  angle: number;
  difficultyOffset: number;
  difficulty: GameDifficulty;
  key: string;
  keys?: string[];
};

const CENTER = 100;
const RADIUS = 56;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const difficultyOffsets = {
  easy: 55,
  medium: 42,
  hard: 28,
};

const getDifficultyOffset = (difficulty: GameDifficulty) => {
  if (typeof difficulty === 'object') return difficulty.areaSize;
  return difficultyOffsets[difficulty];
};

const getDifficultyMultiplier = (difficulty: GameDifficulty) => {
  if (typeof difficulty === 'object') return difficulty.speedMultiplier;
  return 1;
};

const getRandomAngle = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomKey = (inputs?: string[]) => {
  if (!inputs || inputs.length === 0) return 'e';
  return inputs[Math.floor(Math.random() * inputs.length)].toLowerCase();
};

const getKeyLabel = (key: string) => {
  if (key === 'space') return 'Space';
  return key.toUpperCase();
};

const useStyles = createStyles((_theme, params: { difficultyOffset: number }) => {
  const successLength = (CIRCUMFERENCE * params.difficultyOffset) / 360;

  return {
    wrapper: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },

    container: {
      position: 'relative',
      width: 180,
      height: 180,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    svg: {
      position: 'absolute',
      width: 180,
      height: 180,
      overflow: 'visible',
    },

    outerCircle: {
      fill: 'transparent',
      stroke: 'rgba(255, 226, 140, 0.55)',
      strokeWidth: 1.8,
    },

    innerCircle: {
      fill: 'transparent',
      stroke: 'rgba(255, 226, 140, 0.12)',
      strokeWidth: 1.2,
    },

    track: {
      fill: 'transparent',
      stroke: 'rgba(20, 16, 10, 0.9)',
      strokeWidth: 5,
      strokeLinecap: 'round',
    },

    successAreaGlow: {
      fill: 'transparent',
      stroke: 'rgba(255, 215, 120, 0.35)',
      strokeWidth: 7,
      strokeLinecap: 'round',
      strokeDasharray: `${successLength} ${CIRCUMFERENCE}`,
      filter: 'drop-shadow(0 0 4px rgba(255, 215, 120, 0.55))',
    },

    successArea: {
      fill: 'transparent',
      stroke: '#f4d37a',
      strokeWidth: 4.5,
      strokeLinecap: 'round',
      strokeDasharray: `${successLength} ${CIRCUMFERENCE}`,
    },

    successAreaCore: {
      fill: 'transparent',
      stroke: '#fff4c9',
      strokeWidth: 1.5,
      strokeLinecap: 'round',
      strokeDasharray: `${successLength} ${CIRCUMFERENCE}`,
    },

    keyBox: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      minWidth: 56,
      height: 32,
      padding: '0 14px',
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#f0d68a',
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: 0.2,
      background: 'rgba(10, 10, 10, 0.74)',
      border: '2px solid rgba(255,255,255,0.9)',
      boxShadow:
        '0 0 8px rgba(0,0,0,0.45), inset 0 0 5px rgba(255,255,255,0.06)',
      textShadow: '0 0 4px rgba(255, 220, 120, 0.35)',
    },
  };
});

const SkillCheck: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const dataRef = useRef<SkillCheckData | null>(null);
  const dataIndexRef = useRef(0);

  const [skillCheck, setSkillCheck] = useState<SkillCheckState>({
    angle: -90,
    difficultyOffset: 55,
    difficulty: 'easy',
    key: 'e',
    keys: ['e'],
  });

  const { classes } = useStyles({
    difficultyOffset: skillCheck.difficultyOffset,
  });

  const setupSkillCheck = (data: SkillCheckData, index = 0) => {
    const difficulty = Array.isArray(data.difficulty) ? data.difficulty[index] : data.difficulty;
    const offset = getDifficultyOffset(difficulty);
    const key = getRandomKey(data.inputs);

    setSkillCheck({
      angle: getRandomAngle(-80, 270 - offset),
      difficultyOffset: offset,
      difficulty,
      key,
      keys: data.inputs?.map((input) => input.toLowerCase()),
    });
  };

  useNuiEvent('startSkillCheck', (data: SkillCheckData) => {
    dataRef.current = data;
    dataIndexRef.current = 0;
    setupSkillCheck(data, 0);
    setVisible(true);
  });

  useNuiEvent('skillCheckCancel', () => {
    setVisible(false);
    fetchNui('skillCheckOver', false);
  });

  const handleComplete = (success: boolean) => {
    if (!dataRef.current) return;

    if (!success || !Array.isArray(dataRef.current.difficulty)) {
      setVisible(false);
      fetchNui('skillCheckOver', success);
      return;
    }

    if (dataIndexRef.current >= dataRef.current.difficulty.length - 1) {
      setVisible(false);
      fetchNui('skillCheckOver', true);
      return;
    }

    dataIndexRef.current += 1;
    setupSkillCheck(dataRef.current, dataIndexRef.current);
  };

  return (
    <>
      {visible && (
        <Box className={classes.wrapper}>
          <Box className={classes.container}>
            <svg className={classes.svg} viewBox="0 0 200 200">
              <circle className={classes.outerCircle} cx={CENTER} cy={CENTER} r={RADIUS + 12} />
              <circle className={classes.innerCircle} cx={CENTER} cy={CENTER} r={RADIUS - 14} />

              <circle className={classes.track} cx={CENTER} cy={CENTER} r={RADIUS} />

              <circle
                className={classes.successAreaGlow}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                transform={`rotate(${skillCheck.angle} ${CENTER} ${CENTER})`}
              />

              <circle
                className={classes.successArea}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                transform={`rotate(${skillCheck.angle} ${CENTER} ${CENTER})`}
              />

              <circle
                className={classes.successAreaCore}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                transform={`rotate(${skillCheck.angle} ${CENTER} ${CENTER})`}
              />

              <Indicator
                angle={skillCheck.angle}
                offset={skillCheck.difficultyOffset}
                multiplier={getDifficultyMultiplier(skillCheck.difficulty)}
                skillCheck={skillCheck}
                handleComplete={handleComplete}
              />
            </svg>

            <Box className={classes.keyBox}>{getKeyLabel(skillCheck.key)}</Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SkillCheck;
