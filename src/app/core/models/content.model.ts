import { Image } from './image.model';
import { Metadata } from './post.model';

export type Content = {
  id: string;
  created_by: string;
  category_id: string;
  post_id: string;
  question_text?: string;
  question_color?: string;
  link_url?: string;
  image_url?: string;
  provider?: string;
  link_metadata?: Metadata;
  file_name?: string;
  image_path: Image;
  video_path?: string;
  picks_count: number;
  thumbnail: Image;
  score: number;
  pick_status: boolean;
};

export type PickContent = {
  user_id: string;
  content_id: string;
  post_id: string;
  pick_status: boolean | null;
  item_position: string;
};

export type PostFile = {
  name: string;
  path: string;
  type: string;
  size: number;
};

export type CreateContent = Omit<Content, 'link_metadata'> & {
  link_metadata: { savedId: string };
};
