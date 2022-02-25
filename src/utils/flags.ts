export function processFlags(flag: number, nitro: boolean): string[] {
  const badges: string[] = [];

  if (flag & 1) badges.push(Badges.Staff);
  if (flag & 2) badges.push(Badges.Partner);
  if (flag & 4) badges.push(Badges.HypequadEvents);
  if (flag & 8) badges.push(Badges.BugHunterLevelOne);
  if (flag & 64) badges.push(Badges.HypesquadBravery);
  if (flag & 128) badges.push(Badges.HypesquadBrilliance);
  if (flag & 256) badges.push(Badges.HypesquadBalance);
  if (flag & 512) badges.push(Badges.EarlySupporter);
  if (flag & 16384) badges.push(Badges.BugHunter);
  if (flag & 131072) badges.push(Badges.EarlyVerifiedBotDeveloper);
  if (flag & 262144) badges.push(Badges.CertifiedModerator);
  if (nitro) badges.push(Badges.Nitro);

  return badges;
}

export const Badges = {
  Partner: '07742a794bed8ec43505775550b2635e43828c57',
  Nitro: '48f181723d3a3b452eeb7f7044d832e38d6ff411',
  EarlyVerifiedBotDeveloper: 'd9e17819b1eacac4f4e56f94eaf483a26abb8e18',
  EarlySupporter: '151b4354319f7ab29b124b53b0e0cee44b7007a5',
  HypesquadBrilliance: '6901298edcaee0fc8f81c108702ff5fb01955abe',
  HypesquadBalance: 'abacb4abed31ed7a37f4578aadee07143cf0303f',
  HypesquadBravery: '771107b5dec32c6d1cc20c0e8d5682e3c58df87f',
  HypequadEvents: 'dc22ceb9ea3234470468812bee08cff85e993127',
  Staff: 'ecec6059f20760c80c98d68b8a5895aa4f8e5120',
  CertifiedModerator: 'a190fcd2dcd3de6747d97711f56b578764492cd6',
  BugHunterLevelOne: '666ed6955708d9d54083a067ce3d6d85fd7234fc',
  BugHunter: '18ca50e1d7abebd32825eb9957ce04354caf0fce',
};
