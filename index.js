const schedule = require('node-schedule');
const {exec} = require('child_process');

// schedule to run "httrack" every 10 minutes
schedule.scheduleJob( process.env.CRON || '*/10 * * * *', run);

function run(){
    let cmd = `httrack "${process.env.HTTRACK_URI}" ${process.env.HTTRACK_OPTS}`;
    console.log("Running " + cmd);
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            reject(error,stderr);
        }
        resolve(stdout);
    });
}