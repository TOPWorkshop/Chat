module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('room', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  Model.associate = function associate(models) {
    models.room.hasMany(models.message);
  };

  return Model;
};
