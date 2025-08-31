const authRouter = require('./routes/auth');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const logger = require('./logger');
const sequelize = require('./config/config');
const { sequelize: _, ...rest } = require('./models'); 

const healthRouter = require('./routes/health');
const profileRouter = require('./routes/profile');
const projectsRouter = require('./routes/projects');
const searchRouter = require('./routes/search');
const skillsRouter = require('./routes/skills');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRouter);

app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// API routes
app.use('/health', healthRouter);
app.use('/profile', profileRouter);
app.use('/projects', projectsRouter);
app.use('/search', searchRouter);
app.use('/skills', skillsRouter);

// basic root
app.get('/', (req, res) => res.send('Me-API Playground API. Use /health /profile /projects'));

// sync and start (only when run directly)
if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      logger.info('DB connected.');
      await sequelize.sync();
      app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));
    } catch (err) {
      logger.error('Unable to start server: %o', err);
      process.exit(1);
    }
  })();
}

module.exports = app; 
