/*
 * Demo Plugin
 * 
 * this._PLUGINNAME - Gives the plugin name for the current Plugin
 * */

module.exports = {

    initialize: function() {
        LOGGER.initMyLogger(this._PLUGINNAME);

        console.log("Demo Job Initialization", this._PLUGINNAME);
    },

    runJob: function(params) {
        console.log("Running Demo Job", this._PLUGINNAME, params);

        //CACHE.storeData("K1", "Hello 2");
        
        CACHE.fetchData("K1", function(response) {console.log("CACHE TEST", response)}, "XXX");

        _log("TESTING", this._PLUGINNAME, "warn");
        // LOGGER.log("TESTING", this._PLUGINNAME);
    }
}