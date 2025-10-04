import { logger } from '../../utils/logger';
import {
  UserFormDataType,
  UserModelResponse
} from '../repositories/User/model';
import { userRepository } from '../repositories/User/usersRepository';

export async function createUserDomain(
  userData: Omit<UserFormDataType, 'createdAt'>
): Promise<{ userId: string; created?: boolean }> {
  const existingUserId = await userRepository.findUserByEmail(userData.email);
  if (existingUserId) {
    logger.info('User already exists, returning existing ID', {
      userId: existingUserId,
      email: userData.email
    });
    return { userId: existingUserId, created: false };
  }

  const newUserId = await userRepository.createUser(userData);

  return { userId: newUserId, created: true };
}

export async function getCurrentUserDomain(
  currentUserId: string
): Promise<UserModelResponse | null> {
  return await userRepository.getUserById(currentUserId);
}
