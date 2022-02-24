export interface UserProfile {
  user: User;
  connected_accounts: ConnectedAccount[];
  premium_since: string;
}

export interface ConnectedAccount {
  type: string;
  id: string;
  name: string;
  verified: boolean;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: null;
  banner_color: string;
  accent_color: number;
  bio: string;
}
