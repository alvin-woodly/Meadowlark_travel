const handlers = require("../handlers");

test("Home page renders",()=>{
    const req ={};
    const res ={render: jest.fn()};
    handlers.getHome(req,res);
    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe("home");
});

//* Pay extra attention , this about test takes in an extra object (look at the about function in the handler module)
test("about page renders",()=>{
    const req ={};
    const res = {render: jest.fn()};
    handlers.getAbout(req,res);
    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe("about");

    //*the book ditches this feature because it would be a lot of work to maintain:
    expect(res.render.mock.calls[0][1]).toBeDefined();

    //*the render function gets passed an object , we use toEqual for object checking:
    expect(res.render.mock.calls[0][1]).toEqual(expect.objectContaining({fortune: expect.stringMatching(/\W/)}));
});



test("error 404 page renders",()=>{
    const req ={};
    const res = {render:jest.fn()}
    handlers.getPageError(req,res);
    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe("404");
});


test("error 500 page renders",()=>{
    const err = new Error("new error");
    const req = {};
    const res = {render:jest.fn()};
    const next = jest.fn();

    handlers.getServerError(err,req,res,next);
    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe("500");
});