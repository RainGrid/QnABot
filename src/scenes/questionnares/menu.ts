import { TelegrafContext } from '../../types';
import { MenuTemplate, MenuMiddleware } from 'telegraf-inline-menu';
import { QuestionModel, QuestionnareModel } from '../../models';

const menu = new MenuTemplate<TelegrafContext>((ctx) =>
  ctx.i18n.t('questionnares'),
);

const singleMenu = new MenuTemplate<TelegrafContext>((ctx) => {
  return ctx.match![1];
});

const questionsMenu = new MenuTemplate<TelegrafContext>((ctx) => {
  return ctx.i18n.t('questions');
});

const questionMenu = new MenuTemplate<TelegrafContext>((ctx) => {
  return ctx.match![1];
});

singleMenu.submenu((ctx) => ctx.i18n.t('questions'), 'qus', questionsMenu);

singleMenu.toggle((ctx) => ctx.i18n.t('qenabled'), 'enabled', {
  set: async (ctx, choice) => {
    const q = await QuestionnareModel.findOne({ name: ctx.match![1] });
    if (q) {
      q.isEnabled = choice;
      await q.save();
    }
    return true;
  },
  isSet: async (ctx) => {
    const q = await QuestionnareModel.findOne({ name: ctx.match![1] });
    if (q) {
      return q.isEnabled;
    }
    return false;
  },
});

singleMenu.interact((ctx) => ctx.i18n.t('delete'), 'delete', {
  do: async (ctx) => {
    const q = await QuestionnareModel.findOne({ name: ctx.match![1] });
    if (q) {
      await q.remove();
    }
    return '..';
  },
});

singleMenu.interact((ctx) => ctx.i18n.t('back'), 'backtolist', {
  do: () => {
    return '..';
  },
});

questionsMenu.interact((ctx) => ctx.i18n.t('back'), 'backtolist', {
  do: () => {
    return '..';
  },
});

questionMenu.interact((ctx) => ctx.i18n.t('back'), 'backtolist', {
  do: () => {
    return '..';
  },
});

questionsMenu.chooseIntoSubmenu(
  'q',
  async () => {
    const qs = await QuestionModel.find({});
    return qs.map((q) => q.name.substr(0, 2));
  },
  questionMenu,
  {},
);

menu.chooseIntoSubmenu(
  'q',
  async (ctx) => {
    const qs = await QuestionnareModel.find({ user: ctx.dbuser });
    return qs.map((q) => q.name.substr(0, 20));
  },
  singleMenu,
  {},
);

export const menuMiddleware = new MenuMiddleware('/', menu);
