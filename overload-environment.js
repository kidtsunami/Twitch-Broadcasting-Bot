var environmentFile = '.env';
try{
    var env = require('node-env-file')(__dirname + '/' + environmentFile);
} catch(envLoadException){
    console.log('No environment variable overloads available at ' + environmentFile);
}