define([], function () {

    return {
        round: function (num, length) {
            if (length === undefined) {
                length = 0;
            }

            return parseFloat(Math.round(num * Math.pow(10, length)) / Math.pow(10, length));
        },

        formatMinutesAndSeconds: function (minutes, seconds) {
            if (seconds < 10) {
                seconds = '0' + seconds.toString();
            }

            return minutes + ':' + seconds;
        },

        secondsToTime: function (seconds) {
            return {
                weeks: Math.floor(seconds / 604800),
                days: Math.floor(seconds / 86400),
                hours: Math.floor((seconds % 86400) / 3600),
                minutes: Math.floor(((seconds % 86400) % 3600) / 60),
                seconds: ((seconds % 86400) % 3600) % 60
            };
        },

        formatSize: function (bytes, precision) {
            var kilobyte = 1024,
                megabyte = kilobyte * 1024,
                gigabyte = megabyte * 1024,
                terabyte = gigabyte * 1024;

            if ((bytes >= 0) && (bytes < kilobyte)) {
                return bytes + 'b';
            } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
                return (bytes / kilobyte).toFixed(precision) + 'kb';
            } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
                return (bytes / megabyte).toFixed(precision) + 'mb';
            } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
                return (bytes / gigabyte).toFixed(precision) + 'gb';
            } else if (bytes >= terabyte) {
                return (bytes / terabyte).toFixed(precision) + 'tb';
            } else {
                return bytes + 'b';
            }
        }
    };
});