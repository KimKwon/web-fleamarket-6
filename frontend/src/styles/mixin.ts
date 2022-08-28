import { css } from 'styled-components';
import colors from './colors';

export default {
  textEllipsis: (line: number) => css`
    display: -webkit-box;
    -webkit-line-clamp: ${line};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  `,
  shadow: {
    low: css`
      box-shadow: 0px 2px 2px rgb(0 0 0 / 10%), 0px 2px 10px rgb(0 0 0 / 10%);
    `,
    normal: css`
      box-shadow: 0px 4px 4px rgb(0 0 0 / 10%), 0px 4px 20px rgb(0 0 0 / 10%);
    `,
    bottom: css`
      box-shadow: 0px 2px 2px -2px ${colors.gray100};
    `,
  },
  concatWonUnit: css`
    &::after {
      content: '원';
    }
  `,
};
