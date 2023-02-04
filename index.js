const http = require("http");

const koa = require("koa");
const app = new koa();


// each async "middleware" we create works as a downstream to upstream, instead of callbacks
// so we can create a stream of events throught the lifecycle of the request

// definig a logger middleware with infos about method, url and time
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


// a koa app is just a route with a stream
coa_app = new koa();
coa_app.use(async (ctx) => {
    ctx.body = 'Testing';
});


// http serve configuration
// app.listen(3000); // single server 


http.createServer(app.callback()).listen(3000); // you can mount the koa app in other frameworks using callback()
http.createServer(coa_app.callback()).listen(3001);



/**
 * Settings, you can pass to the constructor or dynamically
 * app.env -> NODE_ENV, defaults to development
 * app.keys -> array of cookie keys
 * app.proxy -> bool, trust proxy headers
 * app.subdomainOffset -> offset of subdomains to ignore, defaults to 2
 * app.proxyIpHeader -> defaults to X-Forwarded-For
 * app.maxIpsCount -> max ip reads from proxy ip header, defaults to 0 (infinity)
 */