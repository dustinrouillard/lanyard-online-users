import Head from 'next/head';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Palette } from 'color-thief-react';

import { UserProfile } from '../types/dcdn';
import { LanyardPresence } from '../types/lanyard';
import { Badges, getFlags } from '../utils/flags';

import { lanyard } from '../utils/lanyard';

const WatchedUsers = [
  '94490510688792576', // Phineas
  '156114103033790464', // Dustin
  '338718840873811979', // pxseu
  '83281345949728768', // Tim
  '819287687121993768', // Lanyard
  '911655061594202192', // Shoko Makinohara
];

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

        <Grid>
          {lanyard.users &&
            WatchedUsers.map((id) => {
              const user = lanyard.users.get(id);
              const profile = userProfiles.find((profile) => profile.user.id == id);
              if (!profile) return;

              const flags = getFlags(user.discord_user.public_flags);
              const hasNitro = profile.premium_since;

              return (
                <Card>
                  <Palette src={`https://cdn.discordapp.com/avatars/${id}/${user.discord_user.avatar}`} crossOrigin="anonymous" format="hex" colorCount={4}>
                    {({ data, loading, error }) => (
                      <>
                        {!!profile.user.banner && <UserBanner src={`https://cdn.discordapp.com/banners/${id}/${profile.user.banner}?size=300`} />}
                        {!profile.user.banner && <UserNoBanner fill={profile.user.banner_color ? profile.user.banner_color : data && data[3] ? data[3] : '#6e6e6e'} />}
                        <UserAvatar src={`https://cdn.discordapp.com/avatars/${id}/${user.discord_user.avatar}`}></UserAvatar>
                        <UserStatus status={user.discord_status} />
                        <BottomContent>
                          <Username>
                            {user.discord_user.username}#{user.discord_user.discriminator}
                          </Username>
                          <BadgeDisplay>
                            {flags.map((flag) => (
                              <Badge src={`data:image/png;base64,${Badges[flag]}`} />
                            ))}
                            {hasNitro && <Badge src={`data:image/png;base64,${Badges.Nitro_Subscriber}`} />}
                          </BadgeDisplay>
                        </BottomContent>
                      </>
                    )}
                  </Palette>
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
  color: inherit;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
`;

const UserAvatar = styled.img`
  width: 100px;
  height: auto;
  border-radius: 50%;
  margin-left: 20px;
  margin-top: -50px;
  border: 3px solid #ffffff;
`;

const UserStatus = styled.div<{ status: string }>`
  background-color: ${({ status }) => (status == 'dnd' ? 'red' : status == 'idle' ? 'yellow' : status == 'online' ? 'green' : 'grey')};
  width: 23px;
  height: 23px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  margin-left: 98px;
  margin-top: -25px;
`;

const UserBanner = styled.img`
  height: 128px;
  width: 300px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const UserNoBanner = styled.div<{ fill?: string }>`
  height: 128px;
  width: 300px;
  background-color: ${(props) => (props.fill ? props.fill : '')};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const Username = styled.h2`
  color: #000000;
  font-size: 1.2rem;
  margin-left: 20px;
`;

const Badge = styled.img`
  width: 20px;
  height: 20px;
  margin: 0 0 0 4px;
`;

const BadgeDisplay = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
`;

const BottomContent = styled.div`
  display: flex;
  justify-content: space-between;
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
