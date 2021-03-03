// Dependencies
import { Context, Scenes } from 'telegraf';
import I18N from 'telegraf-i18n';
import { User } from '../models';

interface QNASceneSession extends Scenes.SceneSessionData {
  data?: any;
}

export interface TelegrafContext extends Context {
  dbuser: User;
  i18n: I18N;
  session: any;
  scene: Scenes.SceneContextScene<TelegrafContext, QNASceneSession>;
  readonly match: RegExpExecArray | undefined;
}
