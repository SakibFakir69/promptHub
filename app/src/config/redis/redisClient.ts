

import redis from 'redis'



export const redisConnect =  redis.createClient({

    url:"gave url",
    port:"23",
    username:"sakib",
    password:""

})

redisConnect.connect();

// set 
redisConnect.SETEX("gmail", 120,45677)
// get
const isMatchPassword = redisConnect.get("gmail");
