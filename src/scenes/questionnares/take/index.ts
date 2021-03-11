import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../../types';
import { attachButtons } from '../../../utils';
import { actionProcessPayload } from './actions';
import { buttons, sendMainKeyboard } from './helpers';
import { takeMenuMiddleware } from './menus';

const scene = new Scenes.BaseScene<TelegrafContext>('questionnare_take');

scene.use(takeMenuMiddleware);

scene.enter(async (ctx: TelegrafContext) => {
  await sendMainKeyboard(ctx);
  takeMenuMiddleware.replyToContext(ctx);
});

attachButtons(scene, buttons);

scene.on('text', actionProcessPayload);

export default scene;
