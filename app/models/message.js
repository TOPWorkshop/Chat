module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('message', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Model.associate = function associate(models) {
    models.message.belongsTo(models.room);
  };

  return Model;
};
