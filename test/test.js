var bcrypt = require('bcrypt');

console.log(bcrypt.hashSync('123456', 10));

var r = bcrypt.compareSync('12345678', '$2a$10$ZPYVYv9nf3UdcmKPeBhGHe652HSsqCIGXUvIdqkvH0OoOUNaXFBJy');

console.log(r);