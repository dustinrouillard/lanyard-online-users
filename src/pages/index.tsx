import Head from 'next/head';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LanyardPresence } from '../types/lanyard';

import { lanyard } from '../utils/lanyard';

const WatchedUsers = [
  '94490510688792576', // Phineas
  '156114103033790464', // Dustin
  '338718840873811979', // pxseu
  '83281345949728768', // Tim
];

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

        <Grid>
          {lanyard.users &&
            WatchedUsers.map((id) => {
              const user = lanyard.users.get(id);
              return (
                <Card>
                  <UserAvatar status={user.discord_status} src={`https://cdn.discordapp.com/avatars/${id}/${user.discord_user.avatar}`} />
                  <Username>
                    {user.discord_user.username}#{user.discord_user.discriminator}
                  </Username>
                </Card>
              );
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
  font-size: 4rem;
  text-align: center;
`;

const Description = styled.p`
  line-height: 1.5;
  font-size: 2.5rem;
  text-align: center;
`;

const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  max-width: 800px;

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;
  }
`;

const Card = styled.div`
  margin: 1rem;
  flex-basis: 20%;
  padding: 1.5rem;
  color: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
`;

const UserAvatar = styled.img<{ status: string }>`
  width: 128px;
  height: auto;
  border-radius: 50%;

  border: solid 8px ${({ status }) => (status == 'dnd' ? 'red' : status == 'idle' ? 'yellow' : status == 'online' ? 'green' : 'grey')};
`;

const Username = styled.h2`
  color: #000000;
  font-size: 1rem;
`;

const Footer = styled.div`
  width: 100%;
  height: 50px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;
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
