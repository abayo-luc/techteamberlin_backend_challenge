//load database model
const Article = require("../models").article;
const User = require("../models").user;
//helper function to create ne article
const createArticle = ({ title, language, published, author, url }) => {
  User.findOrCreate({
    where: {
      name: author
    }
  }).spread((user, created) => {
    Article.findOne({ where: { url } }).then(article => {
      if (article) {
        return;
      }
      user
        .createArticle({
          title,
          language,
          url,
          createdAt: new Date(published)
        })
        .then(article => article)
        .catch(err => {
          console.log(err);
          return { err: "artcle failed" };
        });
    });
  });
};

module.exports = { createArticle };
