import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { AvatarStatusMobile, AvatarStatusRound, StatusDnd, StatusIdle, StatusOffline, StatusOnline, StatusOnlineMobile } from '../components/Masks';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
      sans-serif;
  }

`;

const theme = {
  colors: {
    primary: '#0070f3',
  },
};

export default function App({ Component, pageProps }) {
  return (
    <>
      <svg viewBox="0 0 1 1" style={{ position: 'absolute', pointerEvents: 'none', top: '-1px', left: '-1px', width: '1px', height: '1px' }} aria-hidden="true">
        <StatusIdle />
        <StatusOnline />
        <StatusDnd />
        <StatusOffline />
        <AvatarStatusRound />
        <AvatarStatusMobile />
        <StatusOnlineMobile />
      </svg>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
