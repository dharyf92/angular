import { CreateUser, createUserSchema } from '../user.model';

export class UserBuilder implements CreateUser {
  username: string;
  password: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  gender: string;
  birthday: string;
  bio: string;
  interests: string[];
  avatar: Blob | string;

  constructor() {
    // Initialize with default values if needed
  }

  setEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  setPassword(password: string): UserBuilder {
    this.password = password;
    return this;
  }

  setUsername(username: string): UserBuilder {
    this.username = username;
    return this;
  }

  setFullName(fullName: string): UserBuilder {
    this.full_name = fullName;
    return this;
  }

  setPhone(phone: string): UserBuilder {
    this.phone = phone;
    return this;
  }

  setAddress(address: string): UserBuilder {
    this.address = address;
    return this;
  }

  setGender(gender: string): UserBuilder {
    this.gender = gender;
    return this;
  }

  setBirthday(birthday: string): UserBuilder {
    this.birthday = birthday;
    return this;
  }

  setAvatar(avatar: Blob | string): UserBuilder {
    this.avatar = avatar;
    return this;
  }

  setBio(bio: string): UserBuilder {
    this.bio = bio;
    return this;
  }

  setInterests(interests: string[]): UserBuilder {
    this.interests = interests;
    return this;
  }

  build(): CreateUser {
    return {
      username: this.username,
      password: this.password,
      email: this.email,
      full_name: this.full_name,
      phone: this.phone,
      address: this.address,
      gender: this.gender,
      birthday: this.birthday,
      avatar: this.avatar,
      bio: this.bio,
      interests: this.interests,
    };
  }

  validate() {
    const safeParse = createUserSchema.safeParse(this);

    return [
      safeParse.error
        ? new Error(safeParse.error.errors[0].message)
        : undefined,
      safeParse.success ? safeParse.data : undefined,
    ] as const;
  }
}
