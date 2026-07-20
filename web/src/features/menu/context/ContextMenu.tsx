/*
 * This file is based on ox_lib by Overextended.
 * Original project: overextended/ox_lib
 * License: GNU LGPL-3.0
 *
 * Modified by: Maulana / ulamamba12
 * Modification: UI redesign / styling changes
 * Date: 2026-07-04
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text, TextInput } from '@mantine/core';
import { ContextMenuProps, Option } from '../../../typings';
import ContextButton from './components/ContextButton';
import HeaderButton from './components/HeaderButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui('openContext', { id, back: true });
};

const useStyles = createStyles(() => ({
  container: {
    position: 'absolute',
    top: '14%',
    right: '23%',
    width: 390,
    padding: 0,
    margin: 0,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    backdropFilter: 'none',
    borderRadius: 0,
    overflow: 'visible',
    perspective: 1200,

    '&::before': {
      display: 'none',
      content: '""',
    },

    '&::after': {
      display: 'none',
      content: '""',
    },
  },

  header: {
    position: 'relative',
    zIndex: 2,
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },

  titleContainer: {
    position: 'relative',
    flex: '1 1 auto',
    minHeight: 46,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    overflow: 'hidden',

    background:
      'linear-gradient(145deg, rgba(42, 42, 45, 0.96) 0%, rgba(18, 18, 20, 0.94) 45%, rgba(6, 6, 7, 0.94) 100%)',

    border: '1px solid rgba(230, 188, 82, 0.55)',

    boxShadow:
      '0 8px 0 rgba(0, 0, 0, 0.32), 0 18px 26px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 238, 174, 0.28), inset 0 -2px 0 rgba(83, 55, 12, 0.85)',

    '&::before': {
      display: 'none',
      content: '""',
    },

    '&::after': {
      display: 'none',
      content: '""',
    },
  },

  titleText: {
    width: '100%',
    color: '#ffe39a',
    fontSize: 15,
    fontWeight: 900,
    letterSpacing: 1.4,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadow:
      '0 1px 0 rgba(0, 0, 0, 0.95), 0 0 10px rgba(218, 176, 76, 0.55)',

    '& p': {
      margin: 0,
    },
  },

  searchWrapper: {
    position: 'relative',
    zIndex: 2,
    marginBottom: 10,
    borderRadius: 14,

    background:
      'linear-gradient(145deg, rgba(34, 33, 31, 0.78), rgba(8, 8, 9, 0.72))',

    border: '1px solid rgba(225, 178, 63, 0.38)',

    boxShadow:
      '0 4px 0 rgba(43, 28, 5, 0.55), 0 13px 18px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 238, 174, 0.14), inset 0 -2px 0 rgba(59, 38, 6, 0.62)',

    overflow: 'hidden',
  },

  searchInput: {
    height: 42,
    minHeight: 42,
    paddingLeft: 14,
    paddingRight: 14,

    background: 'transparent',
    border: 'none',
    color: '#ffe7a8',

    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0.45,

    textShadow: '0 1px 0 rgba(0,0,0,0.85)',

    '&::placeholder': {
      color: 'rgba(255, 231, 168, 0.45)',
      fontWeight: 700,
    },

    '&:focus': {
      border: 'none',
      outline: 'none',
    },
  },

  buttonsContainer: {
    position: 'relative',
    zIndex: 2,

    background: 'transparent',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',

    margin: 0,
    padding: '0 8px 2px 0',

    // INI BAGIAN SCROLLBAR
    maxHeight: 'calc(74vh - 118px)',
    overflowY: 'auto',
    overflowX: 'hidden',

    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255, 215, 122, 0.9) rgba(0, 0, 0, 0.22)',

    '&::-webkit-scrollbar': {
      width: 6,
    },

    '&::-webkit-scrollbar-track': {
      background: 'rgba(0, 0, 0, 0.22)',
      borderRadius: 99,
      marginTop: 4,
      marginBottom: 4,
      border: '1px solid rgba(225, 178, 63, 0.12)',
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: 99,
      background:
        'linear-gradient(180deg, rgba(255, 232, 159, 0.95), rgba(190, 132, 35, 0.95), rgba(104, 66, 12, 0.95))',
      boxShadow:
        '0 0 10px rgba(255, 211, 107, 0.5), inset 0 1px 0 rgba(255, 245, 190, 0.5)',
      border: '1px solid rgba(255, 220, 130, 0.25)',
    },

    '&::-webkit-scrollbar-thumb:hover': {
      background:
        'linear-gradient(180deg, rgba(255, 241, 190, 1), rgba(220, 158, 45, 1), rgba(126, 82, 18, 1))',
    },

    '&::before': {
      display: 'none',
      content: '""',
    },

    '&::after': {
      display: 'none',
      content: '""',
    },
  },

  buttonsFlexWrapper: {
    gap: 10,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    padding: 0,
    margin: 0,

    '&::before': {
      display: 'none',
      content: '""',
    },

    '&::after': {
      display: 'none',
      content: '""',
    },
  },

  emptyState: {
    minHeight: 58,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    background:
      'linear-gradient(145deg, rgba(34, 33, 31, 0.65), rgba(8, 8, 9, 0.58))',

    border: '1px solid rgba(225, 178, 63, 0.28)',

    boxShadow:
      'inset 0 1px 0 rgba(255, 238, 174, 0.10), inset 0 -2px 0 rgba(59, 38, 6, 0.55)',
  },

  emptyText: {
    color: 'rgba(255, 231, 168, 0.62)',
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textShadow: '0 1px 0 rgba(0,0,0,0.85)',
  },
}));

const getMetadataText = (metadata: unknown): string => {
  if (!metadata) return '';

  if (Array.isArray(metadata)) {
    return metadata
      .map((item) => {
        if (typeof item === 'string') return item;

        if (typeof item === 'object' && item !== null) {
          return Object.values(item)
            .map((value) => String(value))
            .join(' ');
        }

        return String(item);
      })
      .join(' ');
  }

  if (typeof metadata === 'object') {
    return Object.entries(metadata as Record<string, unknown>)
      .map(([key, value]) => `${key} ${String(value)}`)
      .join(' ');
  }

  return String(metadata);
};

const getOptionSearchText = (key: string, option: Option): string => {
  const optionData = option as any;

  return [
    key,
    optionData.title,
    optionData.description,
    optionData.menu,
    getMetadataText(optionData.metadata),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
};

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: {},
  });

  const filteredOptions = useMemo(() => {
    const options = Object.entries(contextMenu.options || {}) as [string, Option][];
    const search = searchValue.trim().toLowerCase();

    if (!search) return options;

    return options.filter(([key, option]) => {
      return getOptionSearchText(key, option).includes(search);
    });
  }, [contextMenu.options, searchValue]);

  const closeContext = () => {
    if (contextMenu.canClose === false) return;

    setVisible(false);
    setSearchValue('');
    fetchNui('closeContext');
  };

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') closeContext();
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible, contextMenu.canClose]);

  useNuiEvent('hideContext', () => {
    setVisible(false);
    setSearchValue('');
  });

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setSearchValue('');
    setContextMenu(data);
    setVisible(true);
  });

  if (!visible) return null;

  return (
    <Box className={classes.container}>
        <Flex className={classes.header}>
          {contextMenu.menu && (
            <HeaderButton
              icon="chevron-left"
              iconSize={16}
              handleClick={() => openMenu(contextMenu.menu)}
            />
          )}

          <Box className={classes.titleContainer}>
            <Text className={classes.titleText}>
              <ReactMarkdown components={MarkdownComponents}>
                {contextMenu.title}
              </ReactMarkdown>
            </Text>
          </Box>

          <HeaderButton
            icon="xmark"
            canClose={contextMenu.canClose}
            iconSize={18}
            handleClick={closeContext}
          />
        </Flex>

        <Box className={classes.searchWrapper}>
          <TextInput
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            placeholder="Search menu..."
            classNames={{
              input: classes.searchInput,
            }}
          />
        </Box>

        <Box className={classes.buttonsContainer}>
          <Stack className={classes.buttonsFlexWrapper} spacing={10}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <ContextButton option={option} key={`context-button-${index}`} />
              ))
            ) : (
              <Box className={classes.emptyState}>
                <Text className={classes.emptyText}>No menu found</Text>
              </Box>
            )}
          </Stack>
        </Box>
    </Box>
  );
};

export default ContextMenu;
