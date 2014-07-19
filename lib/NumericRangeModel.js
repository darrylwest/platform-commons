/**
 * NumericRangeModel - container for named min/max numbers.  verifies that a number is inclusively between the specified
 * min and max range.
 *
 * @created: 5/5/13 8:25 PM
 * @author: darryl.west@roundpeg.com
 */
var NumericRangeModel = function(params) {
    "use strict";

    var range = this;

    if (!params) params = {};

    this.name = params.name || 'unknown';
    this.min = typeof params.min === 'number' ? params.min : Number.MIN_VALUE;
    this.max = typeof params.max === 'number' ? params.max : Number.MAX_VALUE;

    /**
     * specify a method that can be invoked when a value is between min and max
     */
    this.callbackMethod = params.callbackMethod;

    /**
     * returns true if 'n' is inclusively between min and max
     */
    this.isBetween = function(n) {
        return range.min <= n && n <= range.max;
    };
};
