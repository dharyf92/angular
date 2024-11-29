import { z } from 'zod';
import { Image } from './image.model';
import { PostUser } from './post.model';

export type User = {
  id: string;
  email: string;
  full_name: string;
  username: string;
  phone_number: string;
  address: string;
  bio: string;
  gender: string;
  birthday: string;
  account_type: string;
  interests: Interest[];
  device_token: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  is_new: boolean;
  is_notification_allowed: boolean;
  is_private: boolean;
  avatar: Image;
  cover_avatar: string;
  followers_count: 0;
  followings_count: 0;
  pick_status: Status | null;
  passwordUpdatedAt: string;
  validSince: string;
  lastLoginAt: string;
  createdAt: string;
  lastRefreshAt: string;
  metadata: string;
  firebase_uid: string;
};

type Status = {
  is_follow_request: boolean;
  is_follow_back: boolean;
  is_follow_accepted: boolean;
  is_my_follow_accepted: boolean;
};

export type Profile = {
  id: User['id'];
  username: User['username'];
  full_name: User['full_name'];
  avatar: User['avatar'];
  address: User['address'];
  bio: User['bio'];
  is_private: User['is_private'];
  followers_count: User['followers_count'];
  followings_count: User['followings_count'];
  interests: Interest[];
  pick_status: Status;
  ongoing_posts: PostUser[];
  closed_posts: PostUser[];
};

export type Interest = {
  id: string;
  name: string;
  sub_interests: string[];
};

export type Picker = Pick<User, 'id' | 'full_name' | 'avatar' | 'username'> & {
  pick_status: boolean | null;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const createUserSchema = z.object({
  username: z.string().min(2, 'Pseudo is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be at most 16 characters long')
    .optional(),
  email: z.string().email(),
  full_name: z.string(),
  phone: z
    .string()
    .regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)
    .optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
  birthday: z.string().optional(),
  avatar: z
    .union([
      z
        .instanceof(Blob)
        .refine((file) => file.size <= MAX_FILE_SIZE, 'Max image size is 5MB')
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          'Invalid image type'
        ),
      z.string().url(),
    ])
    .optional(),
  bio: z.string().max(500, 'Max length is 500').optional(),
  interests: z.array(z.string().uuid()).optional(),
  is_provider: z.boolean().optional(),
  idToken: z.string().optional(),
});

export type CreateUser = z.infer<typeof createUserSchema>;

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type LoginUserData = Required<z.infer<typeof loginUserSchema>>;

export const googleUserSchema = z.object({
  authentication: z.object({
    idToken: z.string(),
  }),
  email: z.string().email(),
  displayName: z.string(),
  imageUrl: z.string().url(),
});

export type GoogleUserData = z.infer<typeof googleUserSchema>;
