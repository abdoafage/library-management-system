import request from "supertest";
import { app } from "../index.js";
import { sequelize } from "../config.js";
import { expect } from "chai";

describe("TEST UPDATING BOOKS ", function () {
  before("re-initialize database", async () => {
    await sequelize.sync({ force: true });
  });

  it("update a book after create it", function (done) {
    const data = {
      title: "book",
      author: "abdo",
      description: "the best seller in goodreads",
      isbn: 1234,
      available_quantity: 15,
      shelf_location: 12,
    };

    request(app)
      .post("/books")
      .send(data)
      .set("Accept", "application/json")
      .expect(201)
      .expect((res) => {
        expect(res.body.id).to.equal(1);
        expect(res.body.title).to.equal(data.title);
        expect(res.body.author).to.equal(data.author);
        expect(res.body.description).to.equal(data.description);
        expect(res.body.isbn).to.equal(data.isbn);
        expect(res.body.available_quantity).to.equal(data.available_quantity);
        expect(res.body.shelf_location).to.equal(data.shelf_location);
      })
      .end((res) => {
        request(app)
          .put("/books/1")
          .send({
            title: "BOOOK",
            author: "abdooo",
            isbn: 4321,
            description: "the funnist seller in goodreads",
            available_quantity: 70,
            any_field: "234", // to test if the client send unvalid arguement.
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.message).to.equal("updated successfully");
          })
          .end((err, res) => {
            request(app)
              .get("/books/1")
              .expect(200)
              .expect((res) => {
                expect(res.body.title).to.equal("BOOOK");
                expect(res.body.author).to.equal("abdooo");
                expect(res.body.isbn).to.equal(4321);
                expect(res.body.description).to.equal(
                  "the funnist seller in goodreads"
                );
                expect(res.body.available_quantity).to.equal(70);
              })
              .end(done);
          });
      });
  });
});
