import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../types';
import { attachButtons } from '../../utils';
import { actionProcessPayload } from './actions';
import { buttons, sendMainKeyboard } from './helpers';
import { menuMiddleware } from './menus';
import { optNewName } from './menus/opList';
import { qDescr, qName } from './menus/qSingle';
import { quNewName } from './menus/quList';
import { quDescr, quName } from './menus/quSingle';

const scene = new Scenes.BaseScene<TelegrafContext>('questionnares');

scene.enter(async (ctx: TelegrafContext) => {
  await sendMainKeyboard(ctx);
  await menuMiddleware.replyToContext(ctx);
});

attachButtons(scene, buttons);

scene.use(quName);
scene.use(quDescr);
scene.use(qName);
scene.use(qDescr);
scene.use(quNewName);
scene.use(optNewName);
scene.use(menuMiddleware);

scene.on('text', actionProcessPayload);

export default scene;
