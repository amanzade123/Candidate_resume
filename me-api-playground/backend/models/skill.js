module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    proficiency: { type: DataTypes.INTEGER, allowNull: true } 
  });

  return Skill;
};
