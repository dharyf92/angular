import { z } from 'zod';
import { Content } from './content.model';
import { Picker, User } from './user.model';

export type Post = {
  id: string;
  text_content: string | null;
  city: string;
  expiration_date: string | null;
  coordinate: string;
  category_id: string;
  created_by: string;
  created_at: string;
  tagged_users: Array<Picker> | null;
  is_clip: boolean;
  is_private: boolean;
  country: string;
  address: string;
  post_contents: Array<Content>;
  category: Category;
  user: User;
  picks_count: number;
  views_count: number;
  suggestions_count: number;
};

export type Category = {
  id: string;
  name: string;
};

export type PostUser = {
  id: Post['id'];
  is_clip: Post['is_clip'];
  text_content: Post['text_content'];
  post_contents: Post['post_contents'];
};

export const createPostSchema = z.object({
  is_private: z.boolean(),
  category_id: z.string(),
  text_content: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  expiration_date: z.string().optional(),
  is_clip: z.boolean(),
  users_tag: z.array(z.string()).optional(),
  post_contents: z
    .array(
      z.union([
        z.object({
          link_url: z.string(),
          image_url: z.string(),
          provider: z.string(),
          link_metadata: z.object({
            savedId: z.string(),
          }),
          category_id: z.string(),
        }),
        z.object({
          question_text: z.string(),
          question_color: z.string(),
        }),
        z.object({
          files: z.array(z.instanceof(Blob)),
        }),
      ])
    )
    .max(5),
});

export type CreatePost = {
  is_private: boolean;
  category_id: string;
  text_content?: string | null;
  city?: string | null;
  country?: string | null;
  address?: string | null;
  expiration_date?: string | null;
  is_clip: boolean;
  users_tag?: string[];
  post_contents: Partial<Content>[];
};

export type SaveLinkBody = {
  link_url: string;
  image_url: string;
  provider: string;
  link_metadata: Metadata;
  category_id: string;
};

export type Metadata = {
  description: string;
  site_name: string;
  title: string;
  url: string;
};

export type SavedItem = {
  id: string;
  category: string;
  saved_link: Array<Content>;
};

export type PostStatistics = {
  id: string;
  text_content?: string;
  post_contents: Content[];
  views_count: number;
  suggestions_count: number;
  shares_count: number;
  pickers_gender: PickersGender;
  pickers_age: PickersAgeGender;
  pickers_whereabouts: PickersWhereabouts;
};

export type PostDataStudio = {
  id: string;
  views_count: number;
  post_contents: Content[];
};

type PickersGenderValue = {
  count: number;
  percentage: number;
};

type PickersGender = {
  male: PickersGenderValue;
  female: PickersGenderValue;
  non_binary: PickersGenderValue;
  unknown: PickersGenderValue;
};

export type PickersAgeGender = {
  '13-17': number;
  '18-30': number;
  '31-45': number;
  '45+': number;
};

export type PickersWhereabouts = {
  country: string;
  count: number;
  percentage: number;
};

export type PostInsights = {
  id: string;
  text_content: string;
  post_contents: Content[];
  views_count: number;
  suggestions_count: number;
  shares_count: number;
  pickers_gender: PickersGender;
  pickers_age: {
    male: PickersAgeGender;
    female: PickersAgeGender;
    unknown: PickersAgeGender;
    non_binary: PickersAgeGender;
  };
  pickers_whereabouts: PickersWhereabouts[];
};
