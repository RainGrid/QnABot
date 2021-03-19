import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env` });

import { MongoClient } from 'mongodb';
import { session } from 'telegraf-session-mongodb';
import { setupHelp } from './commands/help';
import { setupStart } from './commands/start';
import { bot } from './helpers/bot';
import { setupError } from './helpers/error';
import { setupI18N } from './helpers/i18n';
import { setupStage } from './helpers/scenes';
import { attachUser } from './middlewares/attachUser';
import { checkTime } from './middlewares/checkTime';

// Start bot
MongoClient.connect(process.env.MONGO!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((client) => {
  const db = client.db();

  setupError(bot);
  // Check time
  checkTime(bot);
  // Attach user
  attachUser(bot);
  // Setup localization
  setupI18N(bot);
  // Setup session
  bot.use(session(db, { collectionName: 'tgsessions' }));
  // Setup scenes
  setupStage(bot);
  // Setup commands
  setupHelp(bot);
  setupStart(bot);

  bot.launch();

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  // Log
  console.info('Bot is up and running');
});
