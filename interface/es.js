const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
    host: 'localhost:9200',
});

module.exports = esClient;