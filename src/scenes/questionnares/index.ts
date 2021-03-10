import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../types';
import { actionProcessPayload } from './actions';
import { buttons, sendMainKeyboard } from './helpers';
import { menuMiddleware } from './menus';
import { qDescr, qName } from './menus/qSingle';
import { quNewName } from './menus/quList';
import { quDescr, quName } from './menus/quSingle';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { match } = require('telegraf-i18n');

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

buttons.map((button) => {
  if (button.cb) {
    scene.hears(match(button.cmd), button.cb);
  }
});

scene.on('text', actionProcessPayload);

export default scene;
