
let process = require('process');
let express = require('express');
let bodyParser = require('body-parser');
let Https = require('https');
let fs = require('fs');



export class Web{
    componentName="Web";
    server:any;
    httpsServer:any;
    constructor(public port:number=1433) {}
    init(){
        let privateKey  = fs.readFileSync('ssl/server.key', 'utf8');
        let certificate = fs.readFileSync('ssl/server.crt', 'utf8');
        let credentials = {key: privateKey, cert: certificate};
        
        
    process.on("SIGUSR1", function () {
        // stop stuff
            this.stop('7');
     });        
        process.on('SIGTERM',()=>this.stop('1'));
        process.on('SIGINT',()=>this.stop('2'));//ctrl+c
        process.on('SIGHUP',()=>this.stop('3'));
        process.on('SIGQUIT',()=>this.stop('4'));  
        process.on('uncaughtException', (err)=>{
                                this.stop('5'+err);
        });       
        process.on('beforeExit', ()=>{this.stop('6')});
        //process.on('exit', ()=>{this.stop('8')});
        //process.on('SIGKILL',()=>this.stop('9'));  

        
        this.server = express();        
        this.httpsServer = Https.createServer(credentials, this.server);        
        
        this.server.use(bodyParser.json()); // for parsing application/json
        this.server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
        
        this.server.use((req, res, next)=>{
           console.log("request", req.originalUrl);
           next();  
        });
        
        
    }
    addStatic(path:string='static',url:string=null){
        if(url)
            this.server.use(url,express.static(path));
        else
            this.server.use(express.static(path));
    }
    start(){
        this.httpsServer.listen(this.port);        
    }
    stop(r:string){
        console.log("stop",r);
        this.httpsServer&&this.httpsServer.close&&this.httpsServer.close(()=>{          
            process.exit(0);
        });
    }
}


