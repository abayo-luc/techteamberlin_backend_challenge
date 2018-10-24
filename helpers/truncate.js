const map = require("lodash/map");
const models = require("../models");

const truncate = async () => {
  return await Promise.all(
    map(Object.keys(models), key => {
      if (["sequelize", "Sequelize"].includes(key)) return null;

      return models[key].destroy({ where: {}, force: true });
    })
  );
};

module.exports = truncate;
