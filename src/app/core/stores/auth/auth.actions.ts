import { CreateUser, LoginUserData, User } from '@core/models/user.model';

export namespace AuthActions {
  export class Login {
    static readonly type = '[Auth] Login';
    constructor(public payload: LoginUserData) {}
  }

  export class Refresh {
    static readonly type = '[Auth] Refresh Token';
  }

  export class Register {
    static readonly type = '[Auth] Register';
    constructor(public payload: CreateUser) {}
  }

  export class Logout {
    static readonly type = '[Auth] Logout';
  }

  export class VerifyToken {
    static readonly type = '[Auth] VerifyToken';
    constructor(public payload: { idToken: string }) {}
  }

  export class SaveUser {
    static readonly type = '[Auth] SaveUser';
    constructor(public payload: User) {}
  }

  export class GoogleLogin {
    static readonly type = '[Auth] GoogleLogin';
  }
}
