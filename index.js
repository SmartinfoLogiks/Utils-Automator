//Main file for starting and controlling the Automator Utility Functions

require('dotenv').config();

global.moment = require('moment');
global._ = require('lodash');
global.axios = require('axios');//.default;
global.glob = require('glob');
global.fs = require('fs');
global.path = require('path');
global.md5 = require('md5');

const cron = require('node-cron');
const {nanoid} = import("nanoid");

const LOADED_PLUGINS = {};
const ACTIVE_JOBS = {};

console.log("\x1b[34m%s\x1b[0m","\nAutomator Initialization Started @ "+moment().format(),"\n");

process.env.START_TIME = moment().format();
process.env.ROOT_PATH  = __dirname;

//Initialize Plugins
fs.readdirSync('./plugins/').forEach(function(file) {
        if ((file.indexOf(".js") > 0 && (file.indexOf(".js") + 3 == file.length))) {
        	var className = file.toLowerCase().replace(".js", "").toUpperCase();
            var filePath = path.resolve('./plugins/' + file);

            LOADED_PLUGINS[className] = require(filePath);
            // console.log(">>>", className, filePath, LOADED_PLUGINS);

            if(LOADED_PLUGINS[className].initialize!=null) {
                LOADED_PLUGINS[className].initialize();
            }
        }
    });

//Initialize Schedullers
const CONFIG = require('./config');
if(CONFIG==null) {
	console.log("\x1b[31m%s\x1b[0m","\nAutomator Configuration Not Found");
	process.exit(0);
}

_.each(CONFIG.JOBS, function(conf, k) {
	if(LOADED_PLUGINS[conf.plugin.toUpperCase()]==null) {
		console.log("\x1b[31m%s\x1b[0m","\nAutomator Not Supported for Plugin -",conf.plugin);
		return;
	}
	if(LOADED_PLUGINS[conf.plugin.toUpperCase()].runJob==null) return;//Not a job type of plugin
	if(conf.schedule==null) {
		console.log("\x1b[31m%s\x1b[0m","\nAutomator Schedule Not Found or Not Supported");
		return;
	}
	if(conf.params==null) conf.params = {};
	//console.log("AUTOMATOR_JOB", k, conf);

	switch (conf.type) {
		case "cron":
			const job = cron.schedule(conf.schedule, () => {
				  LOADED_PLUGINS[conf.plugin.toUpperCase()].runJob(conf.params);
				});
			ACTIVE_JOBS[k] = {
				"opts": conf,
				"job": job,
				"started": moment().format(),
				"status": "active",
			};
			break;
		default:
			console.log("\x1b[31m%s\x1b[0m","\nAutomator Not Supported for Type -",conf.type);
	}
})


//Process Cleanup
function exitHandler(options, exitCode) {
    if(options=="exit") return;
    console.log("\n\x1b[34m%s\x1b[0m","Automator Shutting Down @ "+moment().format());
	process.exit(0);
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, exitHandler.bind(null, eventType));
})

process.on('uncaughtException', function(err) {
    console.error(err.name,err.message,err.stack);
});


console.log("\n\x1b[34m%s\x1b[0m","Automator Initialization Completed @ "+moment().format());
//console.log(`Server Started @ `+moment().format()+` and can be accessed on ${config.host}:${config.port}/`);

// process.exit(0);