/**
 * 
 * @param {Number} Time The time from timestamp (in milliseconds)
 * @returns {Number} Time in milliseconds Converted into unix time stamp
 */
function toUnix(Time){
    const toReturn = Math.floor(Time / 1000);
    return toReturn;
};

module.exports = toUnix;