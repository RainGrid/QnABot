// Dependencies
import { Context, Scenes } from 'telegraf';
import I18N from 'telegraf-i18n';
import { User } from '../models';

export interface TelegrafContext extends Context {
  dbuser: User;
  i18n: I18N;
  session: any;
  scene: Scenes.SceneContextScene<TelegrafContext, {}>;
}
