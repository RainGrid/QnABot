// Dependencies
import { Telegraf } from 'telegraf';
import { TelegrafContext } from '../types';

export const bot = new Telegraf<TelegrafContext>(process.env.TOKEN!);
