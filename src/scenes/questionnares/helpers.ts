import { Markup } from 'telegraf';
import { QuestionnareModel } from '../../models';
import { TelegrafContext } from '../../types';
import { getKeyboardRows } from '../../utils';

export type Button = {
  cmd: string;
  cb?: (ctx: TelegrafContext) => Promise<void>;
};

export const sendMainKeyboard = async (
  ctx: TelegrafContext,
  buttons: Button[],
): Promise<void> => {
  const rows = getKeyboardRows(buttons.map((btn) => ctx.i18n.t(btn.cmd)));
  const markup = Markup.keyboard(rows).oneTime().resize();
  await ctx.reply(ctx.i18n.t('questionnares'), markup);

  const qs = await QuestionnareModel.find({ user: ctx.dbuser });
  if (qs?.length) {
    let response = '';
    qs.forEach((q, idx) => {
      response += `${idx + 1}. ${q.name} (${q.isEnabled ? 'on' : 'off'})\n`;
    });
    await ctx.reply(response);
  }
};
