/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { Box, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const GOLD = '#d4af37';
const GOLD_LIGHT = '#fff1a8';
const GOLD_DARK = '#7a4f08';
const DARK_BG = 'rgba(18, 18, 18, 0.72)';

const useStyles = createStyles(() => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    filter: 'drop-shadow(0 20px 28px rgba(0, 0, 0, 0.75))',
  },

  radialSvg: {
    overflow: 'visible',
  },

  backgroundHex: {
    fill: DARK_BG,
    stroke: GOLD_DARK,
    strokeWidth: 3,
    filter: 'url(#hexOuterShadow)',
  },

  sector: {
    fill: 'url(#sectorDarkGradient)',
    stroke: 'rgba(212, 175, 55, 0.65)',
    strokeWidth: 1.8,
    transition: 'all 120ms ease',
    filter: 'url(#sectorShadow)',

    '&:hover': {
      fill: 'url(#sectorGoldGradient)',
      cursor: 'pointer',
      stroke: GOLD_LIGHT,
      strokeWidth: 2.5,
      filter: 'url(#sectorHoverShadow)',

      '> path': {
        transform: 'translateY(-2px)',
      },

      '> g > text': {
        fill: '#ffffff',
      },

      '> g > svg > path': {
        fill: '#ffffff',
      },
    },

    '> path': {
      transition: 'all 120ms ease',
    },
  },

  itemText: {
    fill: '#f5deb3',
    fontFamily: 'Rajdhani, Orbitron, Arial, sans-serif',
    fontWeight: 700,
    letterSpacing: '0.4px',
    textShadow: '0 2px 3px rgba(0,0,0,0.8)',
    strokeWidth: 0,
  },

  centerHex: {
    fill: 'url(#centerGoldGradient)',
    stroke: GOLD_LIGHT,
    strokeWidth: 2.5,
    filter: 'url(#centerShadow)',
    transition: 'all 120ms ease',

    '&:hover': {
      cursor: 'pointer',
      fill: 'url(#sectorGoldGradient)',
      filter: 'url(#sectorHoverShadow)',
    },
  },

  centerIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },

  centerIcon: {
    color: '#101010',
    filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.35))',
  },
}));

const calculateFontSize = (text: string): number => {
  if (text.length > 22) return 9;
  if (text.length > 16) return 11;
  return 12;
};

const splitTextIntoLines = (text: string, maxCharPerLine: number = 14): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxCharPerLine) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
};

const PAGE_ITEMS = 6;

const degToRad = (deg: number) => deg * (Math.PI / 180);

const getHexPoints = (cx: number, cy: number, radius: number) => {
  return Array.from({ length: 6 })
    .map((_, i) => {
      const angle = degToRad(60 * i - 90);
      return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
    })
    .join(' ');
};

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();

  const newDimension = 385;
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  const changePage = async (increment?: boolean) => {
    setVisible(false);

    const didTransition: boolean = await fetchNui('radialTransition');
    if (!didTransition) return;

    setVisible(true);
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);

    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );

    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = {
        icon: 'ellipsis-h',
        label: locale.ui.more,
        isMore: true,
      };
    }

    setMenuItems(items);
  }, [menu.items, menu.page, locale.ui.more]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);

    let initialPage = 1;

    if (data.option) {
      data.items.findIndex(
        (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }

    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  return (
    <>
      <Box
        className={classes.wrapper}
        onContextMenu={async () => {
          if (menu.page > 1) await changePage();
          else if (menu.sub) fetchNui('radialBack');
        }}
      >
        <ScaleFade visible={visible}>
          <svg
            className={classes.radialSvg}
            width={`${newDimension}px`}
            height={`${newDimension}px`}
            viewBox="0 0 350 350"
            transform="rotate(90)"
          >
            <defs>
              <linearGradient id="sectorDarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(43, 43, 43, 0.92)" />
                <stop offset="55%" stopColor="rgba(18, 18, 18, 0.78)" />
                <stop offset="100%" stopColor="rgba(7, 7, 7, 0.86)" />
              </linearGradient>

              <linearGradient id="sectorGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff4b0" />
                <stop offset="35%" stopColor="#d4af37" />
                <stop offset="70%" stopColor="#9b6a12" />
                <stop offset="100%" stopColor="#4d3108" />
              </linearGradient>

              <linearGradient id="centerGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff6bd" />
                <stop offset="45%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#6b4308" />
              </linearGradient>

              <filter id="hexOuterShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="#000000" floodOpacity="0.7" />
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#d4af37" floodOpacity="0.35" />
              </filter>

              <filter id="sectorShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#000000" floodOpacity="0.55" />
              </filter>

              <filter id="sectorHoverShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="8" stdDeviation="4" floodColor="#000000" floodOpacity="0.7" />
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#d4af37" floodOpacity="0.75" />
              </filter>

              <filter id="centerShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.7" />
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#d4af37" floodOpacity="0.5" />
              </filter>

              <clipPath id="hexClip">
                <polygon points={getHexPoints(175, 175, 172)} />
              </clipPath>
            </defs>

            <g transform="translate(175, 175)">
              <polygon points={getHexPoints(0, 0, 172)} className={classes.backgroundHex} />
            </g>

            <g clipPath="url(#hexClip)">
              {menuItems.map((item, index) => {
                const pieAngle = 360 / (menuItems.length < 3 ? 3 : menuItems.length);
                const angle = degToRad(pieAngle / 2 + 90);
                const gap = 2.2;
                const radius = 175 * 0.62 - gap;
                const sinAngle = Math.sin(angle);
                const cosAngle = Math.cos(angle);

                const lines = splitTextIntoLines(item.label, 14);
                const iconYOffset = lines.length > 3 ? 3 : 0;
                const iconX = 175 + sinAngle * radius;
                const iconY = 175 + cosAngle * radius + iconYOffset;

                const iconWidth = Math.min(Math.max(item.iconWidth || 46, 0), 90);
                const iconHeight = Math.min(Math.max(item.iconHeight || 46, 0), 90);

                return (
                  <g
                    key={`${item.label}-${index}`}
                    transform={`rotate(-${index * pieAngle} 175 175) translate(${sinAngle * gap}, ${cosAngle * gap})`}
                    className={classes.sector}
                    onClick={async () => {
                      const clickIndex =
                        menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;

                      if (!item.isMore) fetchNui('radialClick', clickIndex);
                      else await changePage(true);
                    }}
                  >
                    <path
                      d={`M175.01,175.01 l${175 - gap},0 A175.01,175.01 0 0,0 ${
                        175 + (175 - gap) * Math.cos(-degToRad(pieAngle))
                      }, ${175 + (175 - gap) * Math.sin(-degToRad(pieAngle))} z`}
                    />

                    <g transform={`rotate(${index * pieAngle - 90} ${iconX} ${iconY})`} pointerEvents="none">
                      {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                        <image
                          href={item.icon}
                          width={iconWidth}
                          height={iconHeight}
                          x={iconX - iconWidth / 2}
                          y={iconY - iconHeight / 2 - iconHeight / 4}
                        />
                      ) : (
                        <LibIcon
                          x={iconX - 14.5}
                          y={iconY - 18}
                          icon={item.icon as IconProp}
                          width={30}
                          height={30}
                          fixedWidth
                          color={GOLD_LIGHT}
                        />
                      )}

                      <text
                        className={classes.itemText}
                        x={iconX}
                        y={iconY + (lines.length > 2 ? 15 : 28)}
                        textAnchor="middle"
                        fontSize={calculateFontSize(item.label)}
                        pointerEvents="none"
                        lengthAdjust="spacingAndGlyphs"
                      >
                        {lines.map((line, lineIndex) => (
                          <tspan x={iconX} dy={lineIndex === 0 ? 0 : '1.2em'} key={lineIndex}>
                            {line}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            <g
              transform="translate(175, 175)"
              onClick={async () => {
                if (menu.page > 1) await changePage();
                else {
                  if (menu.sub) fetchNui('radialBack');
                  else {
                    setVisible(false);
                    fetchNui('radialClose');
                  }
                }
              }}
            >
              <polygon points={getHexPoints(0, 0, 34)} className={classes.centerHex} />
            </g>
          </svg>

          <div className={classes.centerIconContainer}>
            <LibIcon
              icon={!menu.sub && menu.page < 2 ? 'xmark' : 'arrow-rotate-left'}
              fixedWidth
              className={classes.centerIcon}
              color="#101010"
              size="2x"
            />
          </div>
        </ScaleFade>
      </Box>
    </>
  );
};

export default RadialMenu;
