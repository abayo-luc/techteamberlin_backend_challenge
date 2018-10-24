"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      name: DataTypes.STRING
    },
    {}
  );
  user.associate = function(models) {
    // user association with articles
    user.hasMany(models.article, { as: "articles", foreignKey: "authorId" });
  };
  return user;
};
