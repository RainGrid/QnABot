import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../../types';
import { attachButtons } from '../../../utils';
import { actionProcessPayload } from './actions';
import { buttons, sendMainKeyboard } from './helpers';
import { takeMenuMiddleware } from './menus';
import { actionHandleAnswer, qaMenuMiddleware } from './menus/qaSingle';

const scene = new Scenes.BaseScene<TelegrafContext>('questionnare_take');

scene.enter(async (ctx: TelegrafContext) => {
  await sendMainKeyboard(ctx);
  if (ctx.session.qaId) {
    ctx.scene.session.data = { qaId: ctx.session.qaId };
    delete ctx.session.qaId;
    await qaMenuMiddleware.replyToContext(ctx);
  } else {
    await takeMenuMiddleware.replyToContext(ctx);
  }
});

scene.use(takeMenuMiddleware);
scene.use(qaMenuMiddleware);

attachButtons(scene, buttons);

scene.on('text', actionProcessPayload);
scene.on('text', actionHandleAnswer);

export default scene;
