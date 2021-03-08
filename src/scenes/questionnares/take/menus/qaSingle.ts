import { createBackMainMenuButtons, MenuTemplate } from 'telegraf-inline-menu';
import { TelegrafContext } from '../../../../types';

const qRegex = new RegExp('/q:(.*)/$');

export const qaSingleMenu = new MenuTemplate<TelegrafContext>(
  async (ctx, path) => {
    return '';
  },
);

qaSingleMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);
