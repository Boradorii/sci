async function startServer() {
    try {
        const ExpressLoader = await require('./loader/ExpressLoader');
        const loaderObj = new ExpressLoader();
        const app = loaderObj.expressApp;
        const https = require('https');
        const fs = require('fs');

        const options = {
            key: fs.readFileSync('./private.pem'),
            cert: fs.readFileSync('./public.pem')
        };

        app.set("etag", false);

        if (app != null) {
            const appPort = loaderObj.portInfo;
            /* Server Start */
            https.createServer(options, app).listen(appPort, () => {
                console.log('Server up and running on PORT :', appPort);
            });
            // app.listen(appPort, () => {
            //     console.log('Server up and running on PORT :', appPort);
            // })
        } else {
            console.log('Server not starting');
        }
    } catch (err) {
        console.log('Express Load Error!!!!!')
        console.log(err)
    }
};
startServer();