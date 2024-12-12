const cluster = require("cluster");


function startworker()
{
    const worker = cluster.fork();
    console.log(`CLUSTER: worker with id-> ${worker.id} has been started`);
}

if(cluster.isPrimary){
    require("os").cpus().forEach(startworker);

    // log any workers that disconnect; if a worker disconnects, it
    // should then exit, so we'll wait for the exit event to spawn
    // a new worker to replace it
    cluster.on("disconnect",worker=> console.log(`CLUSTER ${worker.id}`));

    // when a worker dies (exits), create a worker to replace it
    cluster.on("exit",(worker,code,signal)=>{
        console.log(`CLUSTER: Worker ${worker.id} died with exit code ${code} (${signal})`);
        startworker();
    });
}
else{
    const port =process.env.PORT || 3000;
    // start our app on worker; see meadowlark.js
    require("./meadowlark.js")(port);

}