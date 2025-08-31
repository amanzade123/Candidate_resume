module.exports = (sequelize, DataTypes) => {
  const ProjectSkill = sequelize.define('ProjectSkill', {
  }, { timestamps: false });

  return ProjectSkill;
};
