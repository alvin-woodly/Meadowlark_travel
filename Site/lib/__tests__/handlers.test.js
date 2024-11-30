const handlers = require("../handlers");

test("Home page renders",()=>{
    const req ={};
    const res ={render: jest.fn()};
    handlers.getHome(req,res);
    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe("home");
});