import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card } from 'lanyard-card';
import styled from 'styled-components';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <Container>
      <Head>
        <title>Lanyard User - {router.query.id}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>{router.query.id && <Card id={router.query.id as string} />}</Main>

      <Footer>
        <Link href="https://github.com/dustinrouillard/lanyard-online-users" target="_blank" rel="noopener noreferrer">
          Made by Dustin Rouillard. View Source on Github
        </Link>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (prefers-color-scheme: dark) {
    background: #000000;
    color: #ffffff;
  }
`;

const Main = styled.div`
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.div`
  width: 100%;
  height: 50px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (prefers-color-scheme: dark) {
    border-top: 1px solid #262626;
  }
`;

const Link = styled.a`
  color: inherit;
  text-decoration: none;

  :hover,
  :focus,
  :active {
    text-decoration: underline;
  }
`;
