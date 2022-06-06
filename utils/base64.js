module.exports = {
    encode:string => new Buffer(string,'utf-8').toString('base64'),
    decode:string => new Buffer(string, 'base64').toString('utf-8')
}