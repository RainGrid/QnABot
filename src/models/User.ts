// Dependencies
import {
  DocumentType,
  getModelForClass,
  post,
  prop,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { newUserNotification } from '../utils';
import { QuestionnareModel } from './Questionnare';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface User extends Base {}

async function deleteDependencies(user: User): Promise<void> {
  await QuestionnareModel.deleteMany({ user });
}

@post<User>('findOneAndRemove', async (user) => {
  await deleteDependencies(user);
})
@post<User>('findOneAndDelete', async (user) => {
  await deleteDependencies(user);
})
@post<User>('remove', async (user) => {
  await deleteDependencies(user);
})
@post<User>('deleteOne', async (user) => {
  await deleteDependencies(user);
})
@post<User>('deleteMany', async (users) => {
  for (const q of users) {
    await deleteDependencies(q);
  }
})
export class User extends TimeStamps {
  @prop({ required: true, index: true, unique: true })
  id!: number;

  @prop({ required: true, default: 'en' })
  language!: string;
}

// Get User model
export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});

// Get or create user
export async function findUser(id: number): Promise<DocumentType<User>> {
  let user = await UserModel.findOne({ id });
  if (!user) {
    user = new UserModel({ id });
    await user.save();

    await newUserNotification();
  }
  return user;
}
