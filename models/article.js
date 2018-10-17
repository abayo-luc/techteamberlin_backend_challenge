"use strict";
module.exports = (sequelize, DataTypes) => {
  const article = sequelize.define(
    "article",
    {
      title: DataTypes.STRING,
      url: DataTypes.STRING,
      language: DataTypes.STRING
    },
    {}
  );
  article.associate = function(models) {
    // article user association
    article.belongsTo(models.user, { as: "author", foreignKey: "authorId" });
  };
  return article;
};
