import { User } from './user.model';

export type Suggestion = {
  text_content: string;
  parent_suggestion_id: string;
  users_tag: Array<any>;
  id: string;
  created_at: string;
  updated_at: string;
  sub_suggestion: Suggestion[];
  pick_status: boolean;
  suggestion_picks_count: 0;
  user: User;
  tagged_users: Array<any>;
};

export type CreateSuggestion = {
  post_id: string;
  text_content: string;
  parent_suggestion_id: string;
  users_tag: Array<any>;
};

export type UpdateSuggestion = Partial<
  Omit<CreateSuggestion, 'post_id' | 'parent_suggestion_id'>
>;

export type LikeSuggestion = {
  user_id: string;
  suggestion_id: string;
  post_id: string;
  pick_status: boolean;
};
