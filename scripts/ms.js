/**
 * 
 * @param {String} input Enter the time in short format
 * @returns {Number} the input converted into milliseconds
 */

const ms = (input) => {
    const TimeChart = {
        's':1000,
        'm':60000,
        'h':3600000,
        'd':86400000,
    };
    
    if (input.length < 2) return NaN;
    if (!['d','s','m','h'].includes(input.slice(-1).toLowerCase())) return NaN;

    const inputDigit = Number(input.slice(0,-1));
    const TimeChartMultiplier = TimeChart[input.slice(-1).toLowerCase()];
    return inputDigit*TimeChartMultiplier;
};

module.exports = ms;