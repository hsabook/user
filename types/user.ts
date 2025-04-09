import { Book } from './book';

export interface RecentVisitsResponse {
  messages: string;
  data: Book[];
  status_code: number;
}

export interface UserTokenData {
  sub: string;
  iat: number;
  exp: number;
}

export interface CheckLoginResponse {
  messages: string;
  data: {
    user: UserTokenData;
  };
  status_code: number;
} 