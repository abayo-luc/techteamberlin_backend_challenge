process.env.NODE_ENV = "test";
//import db config and models
const sequelize = require("sequelize");
const truncate = require("../helpers/truncate");
const Article = require("../models").article;
const User = require("../models").user;

//import dev dependencies for testing
const chai = require("chai");
const chaiHTTP = require("chai-http");
const should = chai.should();
//bring the server
const server = require("../server");
chai.use(chaiHTTP);

describe("Articles", () => {
  beforeEach(async () => {
    await truncate();
  });
  //testing /articles end point
  describe("/Get articles", () => {
    it("It should return all article in db", done => {
      chai
        .request(server)
        .get("/articles")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  //testing /fetching_articles end point
  describe("/Post article", () => {
    it("it should return array of articles", done => {
      chai
        .request(server)
        .post("/fetch_articles")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.at.most(10);
          for (let article of res.body) {
            article.should.have.property("title");
            article.should.have.property("language");
            article.should.have.property("url");
            article.should.have.property("id");
            article.should.have.property("createdAt");
            article.should.have.property("authorId");
            article.authorId.should.match(/^\d+$/);
          }
          done();
        });
    });
  });

  //testing /user/:id/articles
  describe("/Get user articles", () => {
    it("It should return user articles", done => {
      User.create({
        name: "Jean Luc"
      })
        .then(user => {
          Article.create({
            title: "Passengers fined for carrying more cash than permitted",
            url: "https://www.ptt.cc/bbs/KoreaStar/M.1540376073.A.1EE.html",
            language: "en",
            authorId: user.id
          })
            .then(article => {
              chai
                .request(server)
                .get(`/users/${user.id}/articles`)
                .end((eer, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a("object");
                  res.body.should.have.property("name");
                  res.body.should.have.property("createdAt");
                  res.body.should.have.property("articles");
                  res.body.articles.should.be.a("array");
                  for (let article of res.body.articles) {
                    article.should.have.property("title");
                    article.should.have.property("language");
                    article.should.have.property("url");
                    article.should.have.property("createdAt");
                  }
                  done();
                });
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });
  });

  //test search end point /search?querySearch='somethign'
  describe("/Search", () => {
    it("it shouldn't find any result, which means return empyth array", done => {
      chai
        .request(server)
        .get(`/search?searchQuery='kdfjdlkanvdkhfk'`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  //test search end point which return results
  describe("/Search", () => {
    it("It should return array containg result", done => {
      User.create({ name: "Jean Luc" }).then(user => {
        Article.create({
          title: "Passengers fined for carrying more cash than permitted",
          url: "https://www.ptt.cc/bbs/KoreaStar/M.1540376073.A.1EE.html",
          language: "en",
          authorId: user.id
        }).then(article => {
          chai
            .request(server)
            .get(`/search?searchQuery=${article.title}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.be.a("array");
              res.body.length.should.be.above(0);
              for (let article of res.body) {
                article.should.have.property("title");
                article.should.have.property("language");
                article.should.have.property("url");
                article.should.have.property("createdAt");
                article.should.have.property("author");
                article.author.should.have.property("name");
              }
              done();
            });
        });
      });
    });
  });
});
