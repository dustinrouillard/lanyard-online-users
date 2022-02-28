import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

import { Card } from 'lanyard-card';

import { lanyard } from '../utils/lanyard';
import { LanyardPresence } from '../types/lanyard';
import { WatchedUsers } from '../users';

export default function Home() {
  const [onlineUsers, setOnlineUsers] = useState<Number>(0);
  const [totalUsers, setTotalUsers] = useState<Number>(0);

  function usersChange(users: Map<string, LanyardPresence>) {
    setTotalUsers(users.size);
    setOnlineUsers([...users.values()].filter((user) => user.discord_status != 'offline').length);
  }

  useEffect(() => {
    lanyard.on('change', usersChange);

    return () => {
      lanyard.removeListener('change', usersChange);
    };
  }, []);

  return (
    <Container>
      <Head>
        <title>Lanyard Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Title>
          Online Lanyard Users {onlineUsers.toLocaleString()}/{totalUsers.toLocaleString()}
        </Title>

        <Description>Watched Users</Description>
        <Description no-margin smaller lighter>
          <Link href="https://github.com/dustinrouillard/lanyard-online-users" target="_blank" rel="noopener noreferrer">
            If you want to add yourself submit a PR
          </Link>
        </Description>

        <Grid>
          {lanyard.users &&
            WatchedUsers.map((id) => {
              return <Card id={id} />;
            })}
        </Grid>
      </Main>

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

const Title = styled.h1`
  margin: 0;
  line-height: 1.15;
  font-size: 3rem;
  text-align: center;
`;

const Description = styled.p<{ smaller?: boolean; 'no-margin'?: boolean; lighter?: boolean }>`
  line-height: 1.5;
  text-align: center;
  opacity: ${({ lighter }) => (lighter ? '0.7' : '1')};
  font-size: ${({ smaller }) => (smaller ? '1.4rem' : '2.2rem')};
  margin: ${(props) => (props['no-margin'] ? '0 0 0 0' : '30px 0 0 0')};
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1024px;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;
  }
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
