import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../types';
import { handleLanguageSelect } from './actions';
import { localesFiles, sendKeyboard } from './helpers';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { match } = require('telegraf-i18n');

const scene = new Scenes.BaseScene<TelegrafContext>('language');

scene.enter(async (ctx: TelegrafContext) => {
  await sendKeyboard(ctx);
});

scene.action(
  localesFiles().map((file) => file.split('.')[0]),
  handleLanguageSelect,
);

scene.hears(match('back'), async (ctx) => {
  ctx.scene.enter('menu');
});

export default scene;
