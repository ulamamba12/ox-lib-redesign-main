/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { SkillCheckState } from './index';

type Props = {
  angle: number;
  offset: number;
  multiplier: number;
  skillCheck: SkillCheckState;
  handleComplete: (success: boolean) => void;
};

const CENTER = 100;
const RADIUS = 56;
const BASE_DURATION = 2100;

const Indicator: React.FC<Props> = ({ angle, offset, multiplier, skillCheck, handleComplete }) => {
  const [indicatorAngle, setIndicatorAngle] = useState(-90);
  const [keyPressed, setKeyPressed] = useState<string | false>(false);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const stopAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const animate = useCallback(
    (time: number) => {
      if (completedRef.current) return;

      if (startRef.current === null) {
        startRef.current = time;
      }

      const safeMultiplier = Math.max(multiplier || 1, 0.1);
      const duration = BASE_DURATION / safeMultiplier;
      const progress = Math.min((time - startRef.current) / duration, 1);

      const currentAngle = -90 + progress * 360;
      setIndicatorAngle(currentAngle);

      if (progress >= 1) {
        completedRef.current = true;
        stopAnimation();
        handleComplete(false);
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    },
    [multiplier, stopAnimation, handleComplete]
  );

  const normalizeKey = (e: KeyboardEvent) => {
    if (e.code === 'Space') return 'space';

    if (e.code.startsWith('Key') && e.code.length === 4) {
      return e.code.charAt(3).toLowerCase();
    }

    if (e.code.startsWith('Digit') && e.code.length === 6) {
      return e.code.charAt(5).toLowerCase();
    }

    return e.key.toLowerCase();
  };

  const keyHandler = useCallback((e: KeyboardEvent) => {
    if (e.repeat) return;
    setKeyPressed(normalizeKey(e));
  }, []);

  useEffect(() => {
    setIndicatorAngle(-90);
    setKeyPressed(false);

    startRef.current = null;
    completedRef.current = false;

    window.addEventListener('keydown', keyHandler);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      stopAnimation();
      window.removeEventListener('keydown', keyHandler);
      completedRef.current = true;
      startRef.current = null;
    };
  }, [skillCheck, keyHandler, animate, stopAnimation]);

  useEffect(() => {
    if (!keyPressed || completedRef.current) return;

    if (skillCheck.keys && !skillCheck.keys.includes(keyPressed)) {
      return;
    }

    completedRef.current = true;
    stopAnimation();
    window.removeEventListener('keydown', keyHandler);

    const wrongKey = keyPressed !== skillCheck.key;
    const tooEarly = indicatorAngle < angle;
    const tooLate = indicatorAngle > angle + offset;

    handleComplete(!(wrongKey || tooEarly || tooLate));
    setKeyPressed(false);
  }, [keyPressed, indicatorAngle, angle, offset, skillCheck, keyHandler, stopAnimation, handleComplete]);

  return (
    <g transform={`rotate(${indicatorAngle} ${CENTER} ${CENTER})`}>
      <line
        x1={CENTER + RADIUS - 5}
        y1={CENTER}
        x2={CENTER + RADIUS + 20}
        y2={CENTER}
        stroke="rgba(255, 35, 35, 0.95)"
        strokeWidth={2.4}
        strokeLinecap="round"
        style={{
          filter: 'drop-shadow(0 0 5px rgba(255, 0, 0, 0.8))',
        }}
      />

      <circle
        cx={CENTER + RADIUS}
        cy={CENTER}
        r={4.2}
        fill="#ff2b2b"
        style={{
          filter:
            'drop-shadow(0 0 6px rgba(255, 0, 0, 1)) drop-shadow(0 0 12px rgba(255, 0, 0, 0.65))',
        }}
      />
    </g>
  );
};

export default Indicator;
