const { http, https } = require('follow-redirects');
const fs = require('fs');
const URL = process.env.TRACK_URL;

//create a server object:
http.createServer(function (request, response) {
    // if it's not a GET requests, return 404
    if( request.method != 'GET' ) {
        response.writeHead(404);
        response.end();
        return;
    }
    var path = request.url;
    var target = "www"+path;
    var isExists = fs.existsSync(target)
    var isDir = isExists ? fs.statSync(target).isDirectory() : false;
    // check target file exists and it's not a directory
    if( isExists) {
        if(isDir){
            target += target.endsWith("/") ? "index.html" : "/index.html";
            isExists = fs.existsSync(target);
            if(!isExists) return;
        }
        console.log("Cache hit : " + target);
        response.writeHead(200);
        response.setHeader();
        response.write(fs.readFileSync(target));
        response.end();
        return;
    }
    // make directories to the target
    var dirs = target.split('/');
    dirs.pop();
    var dir = "";
    for( var i=0; i<dirs.length; i++ ) {
        dirs.forEach(function(d){
            dir+=d+"/";
            if( !fs.existsSync(dir) ) {
                fs.mkdirSync(dir);
                console.log("New directory : " + dir);
            }
        });
    }
    if(fs.existsSync(target) && fs.statSync(target).isDirectory()){
        target += target.endsWith("/") ? "index.html" : "/index.html";
    }
    var stream = fs.createWriteStream(target);
    stream.on('finish', function() {
        console.log("New cache : " + path);
    });
    https.get(URL+path, (res) => {
        var body = '';
        res.pipe(stream);
        res.setEncoding('utf8');
        res.on('data', (d) => {
            body+=d;
            response.write(d);
        });
        res.on('end', () => {
            console.log(body);
            response.end();
        });
    }).on("error",(err)=>{
        response.writeHead(404);
        response.write(err.message);
        response.end();
    });
}).listen(80);