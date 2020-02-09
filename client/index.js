const next              = require('next')
const { createServer }  = require('http')

const PORT          = parseInt(process.env.PORT, 10) || 4000;
const CONTEXT_ROOT  = process.env.UI_CONTEXT_ROOT || '/app';

const dev       = process.env.NODE_ENV !== 'production';
const app       = next({dev});
const handle    = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        handle(req,res);
    }).listen(PORT, (err) => {
        if (err) throw err;
        console.log(`-> Ready on port ${PORT}`)
    })
})
