const   http = require("http")
    ,   koa = require("koa");

const app = new koa();


/** Koa Architecture
 * 
Basically, koa works as a stack of middlewares that cascades upstream
So, we can define a middleware, call the next() function, and pass control to the next middleware on the stack
After there is no middleware to be executed, control comes back cascading from downstream
each async "middleware" we create works as a downstream to upstream, instead of callbacks
so we can create a stream of events throught the lifecycle of the request
*/


// defining a logger middleware with info about method, url and time
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get("X-Response-Time");
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// measuring response time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
})


// Finally we end the request
app.use(async ctx => {
    ctx.body = 'Hello world';
});




app.keys = ["somethingsomethingfortheheader"]; // keys to sign cookies with


// a koa app is just a route with a stream, so we can create another and just serve it
koa_app = new koa();

// app.context is the prototype object for ctx, so we can virtually add anything we may need to it
function println(some_object) {
    // i dont know why yet, but this is running 2 times per call
    console.log(some_object);
}
koa_app.context.println = println;
koa_app.context.some_db_we_may_need = object();
koa_app.use(async (ctx) => {
    ctx.println("Just some stuff");
    ctx.body = 'Hello world from Koa app 2';
    ctx.println("Just some stuff2.0");

});


// http serve configuration
// app.listen(3000); // single server 

http.createServer(app.callback()).listen(3000); // you can mount the koa app in other frameworks using callback()
http.createServer(koa_app.callback()).listen(3001);



/**
 * Settings, you can pass to the constructor or dynamically
 * app.env -> NODE_ENV, defaults to development
 * app.keys -> array of cookie keys
 * app.proxy -> bool, trust proxy headers
 * app.subdomainOffset -> offset of subdomains to ignore, defaults to 2
 * app.proxyIpHeader -> defaults to X-Forwarded-For
 * app.maxIpsCount -> max ip reads from proxy ip header, defaults to 0 (infinity)
 */