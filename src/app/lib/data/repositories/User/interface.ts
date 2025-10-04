import { UserFormDataType, UserModelResponse } from './model';

export interface UserRepository {
  createUser(userData: UserFormDataType): Promise<string>;
  findUserByEmail(email: string): Promise<string | null>;
  getUserById(userId: string): Promise<UserModelResponse | null>;
}
