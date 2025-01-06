import { GenericData } from "./generic-data";
import { User } from "./users";

export interface AuthenticateLogin extends GenericData {
  data: AuthenticateLoginData;
}

export interface AuthenticateLoginData extends GenericData {
  token: string;
  user: User;
}

export interface ForgotPasswordRes extends GenericData {
  data: ForgotPasswordData;
}

export interface ForgotPasswordData {
  telephone: string;
  userId: number;
}
