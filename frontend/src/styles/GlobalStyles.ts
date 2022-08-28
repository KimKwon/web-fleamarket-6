import { createGlobalStyle } from 'styled-components';
import colors from './colors';
import reset from './reset';

const GlobalStyles = createGlobalStyle`
  ${reset}

  body {
    color: ${colors.black};
  }

  @font-face {
    font-family: 'LeferiPoint-WhiteObliqueA';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/LeferiPoint-WhiteObliqueA.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
`;

export default GlobalStyles;
