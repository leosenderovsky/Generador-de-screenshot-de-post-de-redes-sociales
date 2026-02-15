
export type SocialNetwork = 'instagram' | 'facebook' | 'x' | 'none';
export type Layout = 'vertical' | 'wide';
export type Theme = 'light' | 'dark';
export type ExportFormat = 'png' | 'jpeg';

export interface PostData {
  network: SocialNetwork;
  displayName: string;
  username: string;
  profilePic: string;
  text: string;
  mediaUrl: string;
  likes: string;
  comments: string;
  retweets: string;
  date: string;
  isVideo: boolean;
  isVerified: boolean;
}
