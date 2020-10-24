const { expect } = require("chai");
const getProfileDataMW = require("../../../../middlewares/user/getProfileDataMW");

describe("getProfileData middleware", () => {
  it("should return userData", (done) => {
    const mw = getProfileDataMW({
      userModel: {
        findOne: (param1, cb) => {
          expect(param1).to.be.eql({ email: "asd@gmail.com" });
          cb(null, "mockuser");
        },
      },
    });

    const resMock = {
      locals: {
        isLoggedIn: true,
      },
    };

    mw({
      session: {
        userMail: "asd@gmail.com",
        isLoggedIn: true,
      },
    },
    resMock, (err) => {
      expect(err).to.be.eql(undefined);
      expect(resMock.locals).to.be.eql({ user: "mockuser", isLoggedIn: true });
      done();
    });
  });
  it("should return error when dbError", (done) => {
    const mw = getProfileDataMW({
      userModel: {
        findOne: (param1, cb) => {
          cb("dberror", "mockuser");
        },
      },
    });

    mw({ session: {} }, {}, (err) => {
      expect(err).to.be.eql("dberror");
      done();
    });
  });
  it("should send flash error message when dbError", (done) => {
    const mw = getProfileDataMW({
      userModel: {
        findOne: (param1, cb) => {
          cb("dberror", "mockuser");
        },
      },
    });

    const reqMock = {
      session: {},
    };

    mw(reqMock, {}, () => {
      expect(typeof reqMock.session.sessionFlash).not.to.be.eql("undefined");
      expect(reqMock.session.sessionFlash).to.be.eql({ type: "danger", message: "DB error." });
      done();
    });
  });
});
