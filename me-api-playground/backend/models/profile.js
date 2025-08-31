module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    education: { type: DataTypes.TEXT, allowNull: true },
    github: { type: DataTypes.STRING, allowNull: true },
    linkedin: { type: DataTypes.STRING, allowNull: true },
    portfolio: { type: DataTypes.STRING, allowNull: true }
  });

  return Profile;
};
