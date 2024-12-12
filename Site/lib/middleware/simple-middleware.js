exports.simplelog = (req,res,next)=>{
    console.log(`processing request for ${req.url}...`);
    next();
};

exports.terminator = (req,res,next)=>{
    console.log("terminating request");
    res.send("thanks for playing,pipeline terminated");
};

exports.neverCalled = (req,res,next)=>{
    console.warn("i'll never get called :(");

};