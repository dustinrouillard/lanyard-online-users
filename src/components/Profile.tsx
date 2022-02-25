import styled from 'styled-components';
import { Palette } from 'color-thief-react';

import { UserProfile } from '../types/dcdn';
import { LanyardPresence } from '../types/lanyard';
import { Badges } from '../utils/flags';
import { Bio } from './Bio';

interface ProfileProps {
  flags: string[];
  user: LanyardPresence;
  profile: UserProfile;
  nitroSince: string;
}

export function Profile({ flags, user, profile, nitroSince }: ProfileProps) {
  return (
    <Card>
      <Palette src={`https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}`} crossOrigin="anonymous" format="hex" colorCount={4}>
        {({ data, loading, error }) => (
          <>
            {!!profile.user.banner && <UserBanner src={`https://cdn.discordapp.com/banners/${user.discord_user.id}/${profile.user.banner}?size=300`} />}
            {!profile.user.banner && <UserNoBanner fill={profile.user.banner_color ? profile.user.banner_color : data && data[3] ? data[3] : '#6e6e6e'} />}
            <UserAvatar src={`https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}`}></UserAvatar>
            <UserStatus status={user.discord_status} />
            <BottomContent>
              <Username>
                {user.discord_user.username}
                <Discriminator>#{user.discord_user.discriminator}</Discriminator>
              </Username>
              <BadgeDisplay>
                {flags.map((flag) => (
                  <Badge src={`data:image/png;base64,${Badges[flag]}`} />
                ))}
                {!!nitroSince && <Badge src={`data:image/png;base64,${Badges.Nitro_Subscriber}`} />}
              </BadgeDisplay>
            </BottomContent>
            {user.activities.length > 0 && user.activities.find((activity) => activity.type == 4) && (
              <CustomStatus>
                {user.activities.find((activity) => activity.type == 4)?.emoji?.id ? (
                  <CustomEmoji src={`https://cdn.discordapp.com/emojis/${user.activities.find((activity) => activity.type == 4)?.emoji?.id}`} />
                ) : (
                  <UnicodeEmoji>{user.activities.find((activity) => activity.type == 4)?.emoji?.name}</UnicodeEmoji>
                )}
                {user.activities.find((activity) => activity.type == 4)?.state}
              </CustomStatus>
            )}
            {profile.user.bio && <Bio bio={profile.user.bio} />}
          </>
        )}
      </Palette>
    </Card>
  );
}

const Card = styled.div`
  margin: 1rem;
  flex-basis: 20%;
  color: inherit;
  display: flex;
  /* min-height: 450px; */
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
  display: flex;
`;

const Discriminator = styled.h2`
  color: #000000;
  opacity: 0.6;
  font-size: 1.2rem;
  margin: 0;
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

const CustomStatus = styled.p`
  font-size: 0.9rem;
  margin: 0;
  margin-left: 20px;
  display: flex;
  align-items: center;
`;

const CustomEmoji = styled.img`
  height: 18px;
  margin: 0;
  margin-right: 5px;
`;

const UnicodeEmoji = styled.p`
  margin: 0;
  margin-right: 5px;
`;

const BottomContent = styled.div`
  display: flex;
  justify-content: space-between;
`;
