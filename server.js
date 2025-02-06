const server = require('./config/app');
const CFG = require('./config/config');
const connectToMongo = require('./config/db');
const socketConfig = require('./config/socket'); 
const open = require('open');

connectToMongo();
const io = socketConfig(server);

server.listen(CFG.PORT, () => {
  console.log(`Labtest 1 server is running on port: ${CFG.PORT}`);
  open(`http://localhost:${CFG.PORT}/user/login`);
});

