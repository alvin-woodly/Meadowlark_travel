const env =  process.env.VNODE_EN || "development";
const credentials = require(`./.credentials.${env}`);
module.exports = {credentials};