import { Book } from './book';

export interface RecentVisitsResponse {
  messages: string;
  data: Book[];
  status_code: number;
} 