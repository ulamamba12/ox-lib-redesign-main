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
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const parseTextUiLines = (text?: string) => {
  const value = text ?? '';
  return value
    .split('\n')
    .map((line) => {
      const match = line.match(/^\s*\[([^\]]+)\]\s*-?\s*(.*)$/);
      if (!match) {
        return {
          key: null as string | null,
          label: line,
        };
      }
      return {
        key: match[1],
        label: match[2],
      };
    })
    .filter((item) => item.label || item.key);
};
const useStyles = createStyles((theme, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems:
      params.position === 'top-center'
        ? 'baseline'
        : params.position === 'bottom-center'
        ? 'flex-end'
        : 'center',
    justifyContent:
      params.position === 'right-center'
        ? 'flex-end'
        : params.position === 'left-center'
        ? 'flex-start'
        : 'center',
  },
  container: {
    padding: 0,
    margin: 18,
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    fontFamily: 'Roboto, sans-serif',
  },
  textStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  textRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  keyBox: {
    minWidth: 76,
    height: 42,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '0 14px',
    color: '#1f1f1f',
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 1,
    background: 'linear-gradient(145deg, #fff2b0 0%, #d59b2d 45%, #8b5a12 100%)',
    border: '1px solid rgba(255, 232, 150, 0.95)',
    borderRadius: 10,
    boxShadow:'inset 0 2px 3px rgba(255,255,255,0.65), inset 0 -4px 5px rgba(80,45,0,0.45), 0 0 16px rgba(255,190,70,0.65), 0 8px 0 rgba(80,50,10,0.9), 0 12px 18px rgba(0,0,0,0.55)',
    textShadow:'0 1px 0 rgba(255,255,255,0.6), 0 -1px 0 rgba(0,0,0,0.45)',
    transform: 'perspective(500px) rotateX(7deg)',
  },
  keyIcon: {
    fontSize: 16,
    color: '#1f1f1f',
    filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.45))',
  },
  labelBox: {
    position: 'relative',
    minHeight: 42,
    display: 'flex',
    alignItems: 'center',
    padding: '0 18px',
    color: '#f6d276',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 0.4,
    background: 'linear-gradient(145deg, rgba(75,75,75,0.92), rgba(30,30,30,0.92))',
    border: '1px solid rgba(255,199,87,0.75)',
    borderRadius: 10,
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), 0 0 14px rgba(255,190,70,0.22), 0 8px 18px rgba(0,0,0,0.45)',
    textShadow: '0 0 8px rgba(255,204,92,0.65)',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: 2,
      background:
        'linear-gradient(90deg, transparent, #ffd36a, #fff2b0, #ffd36a, transparent)',
      boxShadow: '0 0 14px rgba(255,211,106,0.9)',
    },

    '& p': {
      margin: 0,
    },
  },
}));

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });
  const textItems = React.useMemo(() => parseTextUiLines(data.text), [data.text]);
  useNuiEvent<TextUiProps>('textUi', (textUiData) => {
    setData({
      ...textUiData,
      position: textUiData.position || 'right-center',
    });

    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <Box className={classes.wrapper}>
      <ScaleFade visible={visible}>
        <Box className={classes.container}>
          <Box className={classes.textStack}>
            {textItems.map((item, index) => (
              <Box className={classes.textRow} key={index}>
                {item.key && (
                  <Box className={classes.keyBox}>
                    {data.icon && (
                      <LibIcon
                        icon={data.icon}
                        fixedWidth
                        animation={data.iconAnimation}
                        className={classes.keyIcon}
                      />
                    )}
                    <span>{item.key}</span>
                  </Box>
                )}
                <Box className={classes.labelBox}>
                  <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                    {item.label}
                  </ReactMarkdown>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default TextUI;
