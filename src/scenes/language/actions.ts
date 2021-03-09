// Dependencies
import { TelegrafContext } from '../../types';

export async function handleLanguageSelect(
  ctx: TelegrafContext,
): Promise<void> {
  await ctx.answerCbQuery();

  if (ctx.callbackQuery?.message && 'data' in ctx.callbackQuery) {
    const user = ctx.dbuser;
    user.language = ctx.callbackQuery.data;
    await user.save();
    const message = ctx.callbackQuery.message;
    ctx.i18n.locale(ctx.callbackQuery.data);

    await ctx.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      ctx.i18n.t('language_selected'),
      {
        parse_mode: 'HTML',
      },
    );

    await ctx.scene.enter('menu');
  }
}
