import axios from 'axios';
import { parse } from 'node-html-parser';
import { QuestionModel, QuestionnaireModel, QuestionType } from '../../models';
import { TelegrafContext } from '../../types';

export const actionImport = async (ctx: TelegrafContext): Promise<void> => {
  ctx.scene.session.data = { step: 'gf_link' };
  await ctx.reply(ctx.i18n.t('qimport_link'));
};

function googleTypeToQuestionType(
  googleType: number,
): QuestionType | undefined {
  switch (googleType) {
    case 0:
    case 1:
      return QuestionType.Short;
    case 4:
      return QuestionType.MultipleChoice;
    case 2:
    case 5:
    case 7:
      return QuestionType.Choice;
    default:
      break;
  }
}

export const actionProcessPayload = async (
  ctx: TelegrafContext,
  next: () => Promise<void>,
): Promise<void> => {
  if (ctx.message && 'text' in ctx.message) {
    if (ctx.scene.session.data?.step === 'gf_link') {
      const url = ctx.message.text;
      if (
        /https:\/\/docs\.google\.com\/forms\/d\/(e\/)?[a-zA-Z0-9_=?-]+\/viewform/.test(
          url,
        )
      ) {
        try {
          const response = await axios.get(url);
          const root = parse(response.data);
          const script = root.querySelector('body > script');
          let strData = script.text;
          strData = strData.replace('var FB_PUBLIC_LOAD_DATA_ = ', '');
          strData = strData.replace(';', '');
          const data = JSON.parse(strData);
          const formData = data[1];
          const formTitle = formData[8];
          const formDescr = formData[0];
          const fieldsData = formData[1];

          const q = new QuestionnaireModel({
            name: formTitle,
            description: formDescr,
            isEnabled: false,
            user: ctx.dbuser,
          });
          let idx = 0;
          for (const field of fieldsData) {
            const qType = googleTypeToQuestionType(field[3]);
            if (qType === undefined) {
              continue;
            }
            const qName = field[1];
            const qDescr = field[2] || undefined;
            const fieldRows = field[4];
            for (const row of fieldRows) {
              const qRequired = row[2];
              const qOptions =
                row[1]?.map((el: string[]) => el[0] || 'any') || undefined;
              const qLabels = row[3] || undefined;
              const question = new QuestionModel({
                name: qName + (qLabels?.length === 1 ? ` ${qLabels[0]}` : ''),
                description: qDescr,
                type: qType,
                questionnaire: q,
                isRequired: qRequired,
                options: qOptions,
                labels: qLabels,
                sortOrder: idx++,
              });
              await question.save();
            }
          }
          await q.save();
          await ctx.reply(ctx.i18n.t('qimport_success'));
          ctx.scene.reenter();
          return;
        } catch (error) {
          await ctx.reply(ctx.i18n.t('qimport_error'));
          return;
        }
      } else {
        await ctx.reply(ctx.i18n.t('qimport_link_wrong'));
        return;
      }
    }
  }
  await next();
};
