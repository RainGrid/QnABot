// Dependencies
import { getModelForClass, post, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { QuestionnareModel } from './Questionnare';

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
export class User {
  _id?: Types.ObjectId;

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
export async function findUser(id: number): Promise<User> {
  const user = await UserModel.findOne({ id });
  if (!user) {
    const newUser = new UserModel({ id });
    await newUser.save();
    return newUser;
  }
  return user;
}
