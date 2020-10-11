
//INCLUDE LIB
const elasticsearch = require('elasticsearch');
const cities = require('./data.json');
const client = new elasticsearch.Client({

    hosts:['http://localhost:9200']
});


// CHECK IF ELASTIC FRAMEWORK IS RUNNING


client.ping({

    requestTimeout: 30000,
},function(error)
{
    if (error) {
        console.error('Elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});

//create index to store city list

client.indices.create(

    {
        index: 'scotch.io-tutorial'
    }, function(error, response, status) {
        if (error) {
            console.log("already created");
        } else {
            console.log("created a new index", response);
        }
  }

);

// ADD DATA TO ALREADY CREATED INDEX

client.index({
    index: 'scotch.io-tutorial',
    id: '1',
    type: 'cities_list',
    body: {
        "Key1": "Content for key one",
        "Key2": "Content for key two",
        "key3": "Content for key three",
    }
}, function(err, resp, status) {
    console.log(resp);
});
//loop through each city and create and push two objects into the array in each loop
//first object sends the index and type you will be saving the data as
//second object is the data you want to index
var bulk = [];
cities.forEach(city =>{
    bulk.push({index:{ 
                  _index:"scotch.io-tutorial", 
                  _type:"cities_list",
              }          
          })
   bulk.push(city)
 });

 //perform bulk indexing of the data passed
client.bulk({body:bulk}, function( err, response  ){ 
    if( err ){ 
        console.log("Failed Bulk operation".red, err) 
    } else { 
        console.log("Successfully imported %s".green, cities.length); 
    } 
});