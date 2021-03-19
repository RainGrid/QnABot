// Dependencies
import { DocumentType } from '@typegoose/typegoose';
import { Context, Scenes } from 'telegraf';
import I18N from 'telegraf-i18n';
import { User } from '../models';

interface QNASceneSession extends Scenes.SceneSessionData {
  data?: { [key: string]: any };
}

export interface TelegrafContext extends Context {
  dbuser: DocumentType<User>;
  i18n: I18N;
  session: any;
  scene: Scenes.SceneContextScene<TelegrafContext, QNASceneSession>;
  match: RegExpExecArray | undefined;
}

export type Button = {
  cmd: string;
  cb?: (ctx: TelegrafContext) => Promise<void>;
};
