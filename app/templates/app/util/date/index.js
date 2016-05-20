define(
  'app/util/date/index', [
    'moment',
    'components/datepickerwrapper'
  ],
  function(
    moment, DatePickerWrapper
  ) {
    // body...
    var SHORTCUTS = DatePickerWrapper.SHORTCUTS;

    var Helpers = {
      moment: moment,
      getDateDescription: function(start, end, maxDays) {
        var FORMAT = 'YYYY-MM-DD';
        var today = moment();
        /*jshint unused: false*/
        var last7 = moment().subtract(7, 'days');
        var yesterday = moment().subtract(1, 'days');
        var k, v;
        var result;

        maxDays = maxDays || 90;

        if (!start) {
          // 默认实时的接口请求
          start = yesterday;
        }

        if (typeof start === 'string') {
          start = moment(start);
        }

        if (!end) {
          // 默认实时的接口请求
          end = last7;
        }

        if (typeof end === 'string') {
          end = moment(end);
        }

        if (end.valueOf() < start.valueOf()) {
          var temp = start;
          start = end;
          end = temp;
        }

        if (end.diff(start, 'days') >= maxDays) {
          start = moment(end).subtract(maxDays - 1, 'days');
        }

        // 需要获得日期的快捷描述 

        result = {
          today: today,
          start: start,
          end: end,
          yesterdayStr: yesterday.format(FORMAT),
          startStr: start.format(FORMAT),
          endStr: end.format(FORMAT)
        };

        for (k in SHORTCUTS) {
          if (Object.hasOwnProperty.call(SHORTCUTS, k)) {
            v = SHORTCUTS[k];
            if (v[0].format(FORMAT) == result.startStr && v[1].format(FORMAT) == result.endStr) {
              result.quickStr = k;
            }
          }
        }

        return result;
      },
      /**
       * 统一的日期校验方式，后续可能很多的判断逻辑
       * @param  {[type]}  start [description]
       * @param  {[type]}  end   [description]
       * @return {Boolean}       [description]
       */
      isValid: function(start, end) {
        // body...
        /*jshint unused: false*/
        var me = this;
        var FORMAT = 'YYYY-MM-DD';
        var f = true;

        if ((typeof start === 'string') || (start instanceof Date)) {
          start = moment(start);
        }

        if ((typeof end === 'string') || (end instanceof Date)) {
          end = moment(end);
        }

        if (start.valueOf() > end.valueOf()) {
          f = false;
        }
        return f;
      },
      isDiff: function(start, end, maxDays) {
        var f = true;
        maxDays = parseInt(maxDays, 10) - 1;

        if ((typeof start === 'string') || (start instanceof Date)) {
          start = moment(start);
        }

        if ((typeof end === 'string') || (end instanceof Date)) {
          end = moment(end);
        }

        if (end.diff(start, 'days') > maxDays) {
          f = false;
        }
        return f;
      }
    };
    return Helpers;
  }
);