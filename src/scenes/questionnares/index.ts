import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../types';
import { attachButtons } from '../../utils';
import { actionProcessPayload } from './actions';
import { buttons, sendMainKeyboard } from './helpers';
import { menuMiddleware } from './menus';
import { qDescr, qName } from './menus/qSingle';
import { quNewName } from './menus/quList';
import { quDescr, quName } from './menus/quSingle';

const scene = new Scenes.BaseScene<TelegrafContext>('questionnares');

scene.use(quName);
scene.use(quDescr);
scene.use(qName);
scene.use(qDescr);
scene.use(quNewName);
scene.use(menuMiddleware);

scene.enter(async (ctx: TelegrafContext) => {
  await sendMainKeyboard(ctx);
  menuMiddleware.replyToContext(ctx);
});

attachButtons(scene, buttons);

scene.on('text', actionProcessPayload);

export default scene;
