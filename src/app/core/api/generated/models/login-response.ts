/* tslint:disable */
/* eslint-disable */
import { CurrentUser } from './current-user';
export interface LoginResponse {
  success: boolean;
  token: string;
  user: CurrentUser;
}
