async function startServer() {
    try {
        const ExpressLoader = await require('./loader/ExpressLoader');

        const xmlparser = require('express-xml-bodyparser');
        var bodyParser = require('body-parser');
        const loaderObj = new ExpressLoader();
        const app = loaderObj.expressApp;
        // app.use(bodyParser.urlencoded());
        app.use(xmlparser());
        app.set("etag", false);
        if (app != null) {
            const appPort = loaderObj.portInfo;
            /* Server Start */
            app.listen(appPort, () => {
                console.log('Server up and running on PORT :', appPort);
            });
        } else {
            console.log('Server not starting');
        }

    } catch (err) {
        console.log('Express Load Error!!');
        console.log(err);
    }
}
startServer();