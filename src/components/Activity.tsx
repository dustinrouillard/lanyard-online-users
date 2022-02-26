import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { LanyardPresence } from '../types/lanyard';
import { msToTime } from '../utils/time';

interface ActivityProps {
  user: LanyardPresence;
}

export function Activity(props: ActivityProps) {
  const [timestamp, setTimestamp] = useState<number>(new Date().getTime());
  const [currentActivity, setCurrentActivity] = useState(props.user.activities.filter((activity) => activity.type == 0 && activity.assets)[0]);

  useEffect(() => {
    const activity = props.user.activities.filter((activity) => activity.type == 0 && activity.assets)[0];
    if (activity) {
      setCurrentActivity(activity);
      const int = setInterval(() => {
        setTimestamp(new Date().getTime() - activity.timestamps.start);
      }, 1000);

      return () => {
        clearInterval(int);
      };
    }
  }, [props.user]);

  return !!currentActivity ? (
    <Container>
      <ContainerHeading>Activity</ContainerHeading>
      <Content>
        <LeftSide>
          <ActivityImage
            mask={!!currentActivity.assets.small_image}
            src={
              currentActivity.assets.large_image.startsWith('mp:external')
                ? currentActivity.assets.large_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, '$2:/')
                : `https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.large_image}.webp`
            }
          />
          {currentActivity.assets.small_image && (
            <ActivitySmallImage
              src={
                currentActivity.assets.small_image.startsWith('mp:external')
                  ? currentActivity.assets.small_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, '$2:/')
                  : `https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.small_image}.webp`
              }
            />
          )}
        </LeftSide>
        <RightSide>
          <ActivityName>{currentActivity.name}</ActivityName>
          {currentActivity.details && (
            <ActivityDetails>{currentActivity.details.length > 27 ? `${currentActivity.details.substring(0, 27).trim()}...` : currentActivity.details}</ActivityDetails>
          )}
          {currentActivity.state && (
            <ActivityState>{currentActivity.state.length > 27 ? `${currentActivity.state.substring(0, 27).trim()}...` : currentActivity.state}</ActivityState>
          )}
          {timestamp && <ActivityTimestamp>{msToTime(timestamp)} elapsed</ActivityTimestamp>}
        </RightSide>
      </Content>
    </Container>
  ) : (
    <></>
  );
}

const Container = styled.div`
  margin: 0 15px 0 15px;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContainerHeading = styled.h3`
  font-size: 14px;
  opacity: 0.6;
  margin-bottom: 10px;
`;

const LeftSide = styled.div`
  display: flex;
  position: relative;
  align-self: flex-start;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ActivityImage = styled.img<{ mask?: boolean }>`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  mask: ${({ mask }) => (mask ? `url('/masks/5af5e97267f80928790a8c0a1228a8cbb6c29815.svg')` : '')};
  mask-size: cover;
`;

const ActivitySmallImage = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  bottom: -4px;
  right: -4px;
`;

const ActivityName = styled.h3`
  font-size: 12px;
  margin: 0 0 0 10px;
`;

const ActivityDetails = styled.h3`
  font-size: 12px;
  margin: 3px 0 0 10px;
`;

const ActivityState = styled.h3`
  font-size: 12px;
  margin: 3px 0 0 10px;
`;

const ActivityTimestamp = styled.h3`
  font-size: 10px;
  margin: 3px 0 0 10px;
`;
