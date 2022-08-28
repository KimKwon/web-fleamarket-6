import { css } from 'styled-components';

const reset = css`
  body {
    font-family: 'Noto Sans KR';
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  * {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  *::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  input {
    border: none;
    outline: none;
  }
  ul,
  ol,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  button {
    color: inherit;
    font-family: 'Noto Sans KR';
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
`;

export default reset;
