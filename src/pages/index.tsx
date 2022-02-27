import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

import { lanyard } from '../utils/lanyard';
import { UserProfile } from '../types/dcdn';
import { Profile } from '../components/Profile';
import { LanyardPresence } from '../types/lanyard';
import { WatchedUsers } from '../users';

export default function Home() {
  const [onlineUsers, setOnlineUsers] = useState<Number>(0);
  const [totalUsers, setTotalUsers] = useState<Number>(0);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [lastCalledProfiles, setLastCalledProfiles] = useState<{ id: string; date: Date }[]>([]);

  function usersChange(users: Map<string, LanyardPresence>) {
    setTotalUsers(users.size);
    setOnlineUsers([...users.values()].filter((user) => user.discord_status != 'offline').length);
  }

  async function presenceChange(presence: LanyardPresence) {
    let lastCalledProfile;
    if (!WatchedUsers.includes(presence.discord_user.id)) return;

    setLastCalledProfiles((previous) => {
      lastCalledProfile = previous.find((last) => last.id == presence.discord_user.id);
      if (lastCalledProfile && new Date().getTime() - lastCalledProfile.date.getTime() < 30000) return previous;

      const all = previous.filter((last) => last.id != presence.discord_user.id);
      return [...all, { id: presence.discord_user.id, date: new Date() }];
    });

    if (lastCalledProfile && new Date().getTime() - lastCalledProfile.date.getTime() < 30000) return;
    const profile: UserProfile = await fetch(`https://dcdn.dstn.to/profile/${presence.discord_user.id}`).then((r) => r.json());
    setUserProfiles((previous) => {
      const all = previous.filter((Profile) => Profile.user.id != presence.discord_user.id);
      return [...all, profile];
    });
  }

  useEffect(() => {
    lanyard.on('change', usersChange);
    lanyard.on('presence', presenceChange);

    return () => {
      lanyard.removeListener('change', usersChange);
      lanyard.removeListener('presence', presenceChange);
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
              const user = lanyard.users.get(id);
              const profile = userProfiles.find((profile) => profile.user.id == id);
              if (!profile || !user) return;

              return <Profile profile={profile} user={user} />;
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
