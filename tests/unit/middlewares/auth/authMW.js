const { expect } = require("chai");
const authMW = require("../../../../middlewares/auth/authMW");

describe("auth middleware", () => {
  it("should call next when user is logged in", (done) => {
    const mw = authMW({});

    const reqMock = {
      session: {
        isLoggedIn: true,
      },
    };

    const resMock = {};

    mw(reqMock, resMock, (err) => {
      expect(err).to.be.eql(undefined);
      done();
    });
  });
  it("should redirect to login when user is not logged in", (done) => {
    const mw = authMW({});

    const reqMock = {
      session: {},
    };

    const resMock = {
      redirect(to) {
        expect(to).to.eql("/login");
        done();
      },
    };

    mw(reqMock, resMock, () => {
      done();
    });
  });
  it("should send flash error message when user is not logged in", (done) => {
    const mw = authMW({});

    const reqMock = {
      session: {},
    };

    const resMock = {
      redirect: () => {
        expect(typeof reqMock.session.sessionFlash).not.to.be.eql("undefined");
        expect(reqMock.session.sessionFlash).to.be.eql({ type: "danger", message: "Log in to view content." });
        done();
      },
    };

    mw(reqMock, resMock, () => { });
  });
});
