var CronJob = require('cron').CronJob;


//Seconds: 0-59
//Minutes: 0-59
//Hours: 0-23
//Day of Month: 1-31
//Months: 0-11 (Jan-Dec)
//Day of Week: 0-6 (Sun-Sat)
// */n - every n
new CronJob('00 00 08 * * *', function() {
	
}, null, true, 'Asia/Almaty');

exports.CronJob = CronJob