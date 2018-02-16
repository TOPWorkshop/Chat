module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Message', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Model.associate = function associate(models) {
    models.Message.belongsTo(models.Room);
  };

  return Model;
};
