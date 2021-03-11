import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../../types';
import { attachButtons, defaultSceneData } from '../../../utils';
import { actionProcessPayload } from './actions';
import { buttons, sendKeyboard } from './helpers';

const scene = new Scenes.BaseScene<TelegrafContext>('questionnare_new');

scene.use(defaultSceneData);

scene.enter(async (ctx: TelegrafContext) => {
  ctx.scene.session.data = { step: 'qname' };
  await sendKeyboard(ctx);
});

attachButtons(scene, buttons);

scene.on('text', actionProcessPayload);

export default scene;
