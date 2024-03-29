// Dependencies
import * as mongoose from 'mongoose';

// Connect to mongoose
mongoose.connect(process.env.MONGO!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('useCreateIndex', true);

// Export models
export * from './Answer';
export * from './Question';
export * from './Questionnaire';
export * from './QuestionnaireAttempt';
export * from './User';
