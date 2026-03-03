const axios = require('axios');
const client = axios.create({ baseURL: 'http://localhost:4000/api' });
console.log(client.getUri({ url: '/events/123/comments' }));
console.log(client.getUri({ url: 'events/123/comments' }));
