/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import { Box, createStyles, Stack, Tooltip } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import ListItem from './ListItem';
import Header from './Header';
import FocusTrap from 'focus-trap-react';
import { fetchNui } from '../../../utils/fetchNui';
import type { MenuPosition, MenuSettings } from '../../../typings';
import LibIcon from '../../../components/LibIcon';

const useStyles = createStyles((theme, params: { position?: MenuPosition; itemCount: number; selected: number }) => ({
  tooltip: {
    maxWidth: 360,
    whiteSpace: 'normal',
    color: '#f3e6bf',
    borderRadius: 12,
    padding: '10px 12px',
    background:
      'linear-gradient(145deg, rgba(18,18,18,0.95), rgba(44,37,18,0.92))',
    border: '1px solid rgba(255, 209, 76, 0.3)',
    boxShadow: '0 14px 28px rgba(0,0,0,0.62), 0 0 18px rgba(255,204,61,0.18)',
    fontSize: 12,
    letterSpacing: 0.4,
  },

  container: {
    position: 'absolute',
    pointerEvents: 'none',
    width: 384,
    fontFamily: 'Roboto, Arial, sans-serif',
    perspective: 1000,

    top: params.position === 'top-left' || params.position === 'top-right' ? 18 : undefined,
    bottom: params.position === 'bottom-left' || params.position === 'bottom-right' ? 18 : undefined,
    left: params.position === 'top-left' || params.position === 'bottom-left' ? 18 : undefined,
    right: params.position === 'top-right' || params.position === 'bottom-right' ? 18 : undefined,

    filter: 'drop-shadow(0 24px 35px rgba(0,0,0,0.72))',
  },

  shell: {
    position: 'relative',
    borderRadius: 18,
    background: 'rgba(18,18,18,0.22)',

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: -1,
      borderRadius: 19,
      padding: 1,
      background:
        'linear-gradient(145deg, rgba(255,222,112,0.48), rgba(120,78,10,0.12), rgba(255,222,112,0.28))',
      WebkitMask:
        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      pointerEvents: 'none',
    },
  },

  buttonsWrapper: {
    position: 'relative',
    height: 'fit-content',
    maxHeight: 430,
    overflow: 'hidden',
    padding: 9,
    gap: 8,
    borderBottomLeftRadius:
      params.itemCount <= 6 || params.selected === params.itemCount - 1 ? 18 : 0,
    borderBottomRightRadius:
      params.itemCount <= 6 || params.selected === params.itemCount - 1 ? 18 : 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    background:
      'linear-gradient(155deg, rgba(18,18,18,0.82), rgba(47,47,47,0.48), rgba(12,12,12,0.88))',
    borderLeft: '1px solid rgba(255, 213, 96, 0.2)',
    borderRight: '1px solid rgba(255, 213, 96, 0.2)',
    borderBottom:
      params.itemCount <= 6 || params.selected === params.itemCount - 1
        ? '1px solid rgba(255, 213, 96, 0.22)'
        : 'none',
    boxShadow:
      'inset 0 18px 30px rgba(255, 213, 96, 0.025), inset 0 -22px 34px rgba(0,0,0,0.36)',
  },

  scanLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 77,
    height: 1,
    background:
      'linear-gradient(90deg, transparent, rgba(255, 215, 90, 0.8), transparent)',
    boxShadow: '0 0 14px rgba(255, 204, 61, 0.55)',
    animation: 'scanMove 3s ease-in-out infinite',

    '@keyframes scanMove': {
      '0%': { opacity: 0.15, transform: 'translateY(0)' },
      '50%': { opacity: 0.85, transform: 'translateY(330px)' },
      '100%': { opacity: 0.15, transform: 'translateY(0)' },
    },
  },

  scrollArrow: {
    height: 28,
    textAlign: 'center',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    background:
      'linear-gradient(145deg, rgba(20,20,20,0.92), rgba(50,39,14,0.82))',
    border: '1px solid rgba(255, 213, 96, 0.24)',
    borderTop: 'none',
    boxShadow:
      '0 14px 25px rgba(0,0,0,0.54), inset 0 1px 0 rgba(255,255,255,0.06)',
  },

  scrollArrowIcon: {
    color: '#f4c74e',
    fontSize: 18,
    marginTop: 4,
    filter: 'drop-shadow(0 0 8px rgba(255,204,61,0.72))',
    animation: 'arrowPulse 1.2s ease-in-out infinite',

    '@keyframes arrowPulse': {
      '0%, 100%': { opacity: 0.45, transform: 'translateY(-1px)' },
      '50%': { opacity: 1, transform: 'translateY(2px)' },
    },
  },
}));

const ListMenu: React.FC = () => {
  const [menu, setMenu] = useState<MenuSettings>({
    position: 'top-left',
    title: '',
    items: [],
  });

  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [indexStates, setIndexStates] = useState<Record<number, number>>({});
  const [checkedStates, setCheckedStates] = useState<Record<number, boolean>>({});

  const listRefs = useRef<Array<HTMLDivElement | null>>([]);
  const firstRenderRef = useRef(false);

  const { classes } = useStyles({
    position: menu.position,
    itemCount: menu.items.length,
    selected,
  });

  const closeMenu = (ignoreFetch?: boolean, keyPressed?: string, forceClose?: boolean) => {
    if (menu.canClose === false && !forceClose) return;

    setVisible(false);

    if (!ignoreFetch) fetchNui('closeMenu', keyPressed);
  };

  const moveMenu = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (firstRenderRef.current) firstRenderRef.current = false;

    const selectedItem = menu.items[selected];
    if (!selectedItem) return;

    switch (e.code) {
      case 'ArrowDown':
        e.preventDefault();
        setSelected((selected) => {
          if (selected >= menu.items.length - 1) return 0;
          return selected + 1;
        });
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelected((selected) => {
          if (selected <= 0) return menu.items.length - 1;
          return selected - 1;
        });
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (Array.isArray(selectedItem.values)) {
          setIndexStates({
            ...indexStates,
            [selected]:
              indexStates[selected] + 1 <= selectedItem.values.length - 1
                ? indexStates[selected] + 1
                : 0,
          });
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (Array.isArray(selectedItem.values)) {
          setIndexStates({
            ...indexStates,
            [selected]:
              indexStates[selected] - 1 >= 0
                ? indexStates[selected] - 1
                : selectedItem.values.length - 1,
          });
        }
        break;

      case 'Enter':
        e.preventDefault();

        if (selectedItem.checked !== undefined && !selectedItem.values) {
          return setCheckedStates({
            ...checkedStates,
            [selected]: !checkedStates[selected],
          });
        }

        fetchNui('confirmSelected', [selected, indexStates[selected]]).catch();

        if (selectedItem.close === undefined || selectedItem.close) setVisible(false);
        break;
    }
  };

  useEffect(() => {
    if (menu.items[selected]?.checked === undefined || firstRenderRef.current) return;

    const timer = setTimeout(() => {
      fetchNui('changeChecked', [selected, checkedStates[selected]]).catch();
    }, 100);

    return () => clearTimeout(timer);
  }, [checkedStates]);

  useEffect(() => {
    if (!menu.items[selected]?.values || firstRenderRef.current) return;

    const timer = setTimeout(() => {
      fetchNui('changeIndex', [selected, indexStates[selected]]).catch();
    }, 100);

    return () => clearTimeout(timer);
  }, [indexStates]);

  useEffect(() => {
    if (!menu.items[selected]) return;

    listRefs.current[selected]?.scrollIntoView({
      block: 'nearest',
      inline: 'start',
    });

    listRefs.current[selected]?.focus({ preventScroll: true });

    const timer = setTimeout(() => {
      fetchNui('changeSelected', [
        selected,
        menu.items[selected].values
          ? indexStates[selected]
          : menu.items[selected].checked !== undefined
            ? checkedStates[selected]
            : null,
        menu.items[selected].values
          ? 'isScroll'
          : menu.items[selected].checked !== undefined
            ? 'isCheck'
            : null,
      ]).catch();
    }, 100);

    return () => clearTimeout(timer);
  }, [selected, menu]);

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape', 'Backspace'].includes(e.code)) closeMenu(false, e.code);
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  const getTooltipLabel = (item: MenuSettings['items'][number], itemIndex: number) => {
    if (Array.isArray(item.values)) {
      const value = item.values[indexStates[itemIndex]];

      if (typeof value === 'object' && value !== null && value.description) {
        return value.description;
      }
    }

    return item.description;
  };

  useNuiEvent('closeMenu', () => closeMenu(true, undefined, true));

  useNuiEvent('setMenu', (data: MenuSettings) => {
    firstRenderRef.current = true;

    if (!data.startItemIndex || data.startItemIndex < 0) data.startItemIndex = 0;
    else if (data.startItemIndex >= data.items.length) data.startItemIndex = data.items.length - 1;

    setSelected(data.startItemIndex);

    if (!data.position) data.position = 'top-left';

    listRefs.current = [];

    setMenu(data);
    setVisible(true);

    const arrayIndexes: Record<number, number> = {};
    const checkedIndexes: Record<number, boolean> = {};

    for (let i = 0; i < data.items.length; i++) {
      if (Array.isArray(data.items[i].values)) {
        arrayIndexes[i] = (data.items[i].defaultIndex || 1) - 1;
      } else if (data.items[i].checked !== undefined) {
        checkedIndexes[i] = data.items[i].checked || false;
      }
    }

    setIndexStates(arrayIndexes);
    setCheckedStates(checkedIndexes);

    setTimeout(() => {
      listRefs.current[data.startItemIndex!]?.focus();
    }, 0);
  });

  return (
    <>
      {visible && (
        <FocusTrap active={visible}>
          <Box className={classes.container} tabIndex={-1} onKeyDown={moveMenu}>
            <Box className={classes.shell}>
              <Header title={menu.title} />

              <Box className={classes.scanLine} />

              <Stack spacing={8} className={classes.buttonsWrapper}>
                {menu.items.map((item, index) => {
                  const tooltipLabel = getTooltipLabel(item, index);

                  return (
                    <Tooltip
                      key={`menu-item-${index}`}
                      label={tooltipLabel}
                      disabled={!tooltipLabel}
                      position="right"
                      withArrow
                      offset={12}
                      classNames={{ tooltip: classes.tooltip }}
                    >
                      <Box>
                        <ListItem
                          ref={listRefs}
                          item={item}
                          index={index}
                          scrollIndex={indexStates[index]}
                          checked={checkedStates[index]}
                        />
                      </Box>
                    </Tooltip>
                  );
                })}
              </Stack>

              {menu.items.length > 6 && selected !== menu.items.length - 1 && (
                <Box className={classes.scrollArrow}>
                  <LibIcon icon="chevron-down" className={classes.scrollArrowIcon} />
                </Box>
              )}
            </Box>
          </Box>
        </FocusTrap>
      )}
    </>
  );
};

export default ListMenu;
