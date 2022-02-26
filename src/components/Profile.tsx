import styled from 'styled-components';
import { Palette } from 'color-thief-react';

import { UserProfile } from '../types/dcdn';
import { LanyardPresence } from '../types/lanyard';
import { Bio } from './Bio';
import { Activity } from './Activity';

interface ProfileProps {
  flags: string[];
  user: LanyardPresence;
  profile: UserProfile;
}

const StatusMap = {
  dnd: 'hsl(359, calc(var(--saturation-factor, 1) * 82.6%), 59.4%)',
  online: 'hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)',
  idle: 'hsl(38, calc(var(--saturation-factor, 1) * 95.7%), 54.1%)',
  offline: 'hsl(214, calc(var(--saturation-factor, 1) * 9.9%), 50.4%)',
};

export function Profile({ flags, user, profile }: ProfileProps) {
  return (
    <Card>
      <Palette src={`https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}`} crossOrigin="anonymous" format="hex" colorCount={4}>
        {({ data }) => (
          <>
            <Heading>
              {!!profile.user.banner && <UserBanner src={`https://cdn.discordapp.com/banners/${user.discord_user.id}/${profile.user.banner}?size=600`} />}
              {!profile.user.banner && <UserNoBanner fill={profile.user.banner_color ? profile.user.banner_color : data && data[3] ? data[3] : '#6e6e6e'} />}
            </Heading>
            <TopContent>
              <AvatarDiv>
                <svg width="128" height="100" viewBox="0 0 138 100" aria-hidden="true">
                  <foreignObject
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    mask={`url(#${user.active_on_discord_mobile && user.discord_status == 'online' ? 'svg-mask-avatar-status-mobile' : 'svg-mask-avatar-status-round'})`}
                  >
                    <Avatar>
                      <img height="100px" width="100px" src={`https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}`} />
                    </Avatar>
                  </foreignObject>
                  {!user.active_on_discord_mobile && (
                    <rect width="24" height="24" x="71" y="71" fill={StatusMap[user.discord_status]} mask={`url(#svg-mask-status-${user.discord_status})`} />
                  )}
                  {user.active_on_discord_mobile && user.discord_status == 'online' && (
                    <rect width="24" height="36" x="71" y="60" fill={StatusMap[user.discord_status]} mask="url(#svg-mask-status-online-mobile)" />
                  )}
                </svg>
              </AvatarDiv>
              <BadgeDisplay>
                {flags.map((flag) => (
                  <Badge src={`/badges/${flag}.svg`} />
                ))}
              </BadgeDisplay>
            </TopContent>
            <BottomContent>
              <Username>
                {user.discord_user.username}
                <Discriminator>#{user.discord_user.discriminator}</Discriminator>
              </Username>
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
            <Activity user={user} />
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
  width: 300px;
  flex-direction: column;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
  padding-bottom: 20px;

  @media (prefers-color-scheme: dark) {
    border: 1px solid #262626;
  }
`;

const AvatarDiv = styled.div`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-left: 15px;
  margin-top: -50px;
  z-index: 6;
`;

const UserBanner = styled.img`
  height: 128px;
  width: 300px;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
`;

const UserNoBanner = styled.div<{ fill?: string }>`
  height: 128px;
  width: 300px;
  background-color: ${(props) => (props.fill ? props.fill : '')};
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
`;

const Username = styled.h2`
  color: #000000;
  font-size: 1.2rem;
  margin-left: 15px;
  display: flex;

  @media (prefers-color-scheme: dark) {
    color: #ffffff;
  }
`;

const Discriminator = styled.h2`
  color: #000000;
  opacity: 0.6;
  font-size: 1.2rem;
  margin: 0;

  @media (prefers-color-scheme: dark) {
    color: #ffffff;
  }
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
  margin-right: 15px;
  margin-top: 10px;
  max-width: 240px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const CustomStatus = styled.p`
  font-size: 0.9rem;
  margin: 0;
  margin-left: 15px;
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

const Avatar = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 8;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  z-index: 5;
`;

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  z-index: 6;
`;

const BottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -5px;
`;
