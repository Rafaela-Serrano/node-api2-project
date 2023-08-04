const server = require("./api/server");

const port = 9000;

server.listen(port,()=>{
console.log(`\nServer Running on http://localhost:${port}\n`)
});
