
function StatusRedisStore(redisClient){
    this.redisClient = redisClient;
}

StatusRedisStore.prototype.getStatus = function(){
    return this.redisClient.getAsync('status').then(function(result){
        return JSON.parse(result);
    });
};

StatusRedisStore.prototype.setStatus = function(status){
    return this.redisClient.setAsync('status', JSON.stringify(status));
};

module.exports = StatusRedisStore;