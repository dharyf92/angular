import { Image } from './image.model';
import { User } from './user.model';

export type Notification = {
  img: Image | null;
  user: ProfileUser;
  action: 'picked' | 'replied' | 'send request';
  content_id?: string;
  comment_id?: string;
  id?: string;

  created_at: string;
  created_by: ProfileUser;
  is_viewed: boolean;
  message: string;
  post_id: string;
};

type ProfileUser = Pick<User, 'id' | 'username' | 'full_name' | 'avatar'>;
