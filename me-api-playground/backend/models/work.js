module.exports = (sequelize, DataTypes) => {
  const Work = sequelize.define('Work', {
    company: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: true },
    endDate: { type: DataTypes.DATEONLY, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    links: { type: DataTypes.JSON, allowNull: true }
  });

  return Work;
};
