var environmentFile = '../.env';
try{
    require('node-env-file')(__dirname + '/' + environmentFile);
} catch(envLoadException){
    console.log('No environment variable overloads available at ' + environmentFile);
}