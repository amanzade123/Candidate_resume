const Sequelize = require('sequelize');
const sequelize = require('../config/config');

const Profile = require('./profile')(sequelize, Sequelize.DataTypes);
const Skill = require('./skill')(sequelize, Sequelize.DataTypes);
const Project = require('./project')(sequelize, Sequelize.DataTypes);
const Work = require('./work')(sequelize, Sequelize.DataTypes);
const ProjectSkill = require('./projectSkill')(sequelize, Sequelize.DataTypes);

Profile.hasMany(Project, { foreignKey: 'profileId', as: 'projects' });
Project.belongsTo(Profile, { foreignKey: 'profileId' });

Profile.hasMany(Work, { foreignKey: 'profileId', as: 'work' });
Work.belongsTo(Profile, { foreignKey: 'profileId' });

Profile.belongsToMany(Skill, { through: 'ProfileSkills', as: 'skills' });
Skill.belongsToMany(Profile, { through: 'ProfileSkills' });

Project.belongsToMany(Skill, { through: ProjectSkill, as: 'skills' });
Skill.belongsToMany(Project, { through: ProjectSkill });

module.exports = {
  sequelize,
  Profile,
  Skill,
  Project,
  Work,
  ProjectSkill
};
