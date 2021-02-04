$(document).ready(function () {

  // Get params from script tag.
  // ATTENTION: When the name of this file changes, the filename in the following
  //            JQuery selector (= script[src*=newItemDatepicker]) must be changed
  //            too!
  var scriptTag = $('script[src*=newItemDatepicker]');
  var dateformat = scriptTag.attr('dateformat');
  var startdate = scriptTag.attr('startdate');
  var fromdatefull = scriptTag.attr('fromdatefull');
  var language = scriptTag.attr('language');
  var viewmode = Number(scriptTag.attr('viewmode'));

  /**
   * Initialize bootstrap-datepicker
   */
  $(".form-search-newitem .input-daterange").datepicker({
    format: dateformat,
    startDate: startdate,
    language: language,
    startView: viewmode,
    minViewMode: viewmode,
    maxViewMode: 2,
    // Set endDate to today+1day to avoid unwanted side effects when setting the
    // date with function setDatesOnLoad() below.
    endDate: "+1d", 
    // Disable the date today+1day that was enabled in "endDate" above so that the
    // use can't choose it.
    datesDisabled: "+1d",
    todayBtn: "linked",
    keepEmptyValues: true,
    autoclose: true,
    disableTouchKeyboard: true
  });

  /**
   * Set the date in the hidden "from" field when a date is selected or changed in
   * the datepicker.
   */ 
  $('#datePickerFrom').on('changeDate', function (event) {
    // Max. view in DatePicker is "month"
    if (viewmode == 1) {
      // Get first day of selected month, convert it to ISO-Date in local timezone
      // and set it to the hidden input field.
      var firstDayOfMonth = new Date(
        event.date.getFullYear(),
        event.date.getMonth(), 1, 0, 0, 0, 0
      );
      // Get timezone offset in Milliseconds
      var timeZoneOffset = (firstDayOfMonth).getTimezoneOffset() * 60000;
      var localISOTime = (new Date(firstDayOfMonth - timeZoneOffset)).toISOString();
      $('#datePickerFromHidden').val(localISOTime);
    } else { // Max. view in DatePicker is "day"
      // Get first hour of selected date, convert it to ISO-Date in local timezone
      // and set it to the hidden input field.
      var firstHourOfDay = new Date(
        event.date.getFullYear(),
        event.date.getMonth(),
        event.date.getDate(), 0, 0, 0, 0
      );
      // Get timezone offset in Milliseconds
      var timeZoneOffset = (firstHourOfDay).getTimezoneOffset() * 60000;
      var localISOTime = (new Date(firstHourOfDay - timeZoneOffset)).toISOString();
      $('#datePickerFromHidden').val(localISOTime);
    }

  });

  /**
   * Set the date in the hidden "to" field when a date is selected or changed in the
   * datepicker
   */
  $('#datePickerTo').on('changeDate', function (event) {
    // Max. view in DatePicker is "month"
    if (viewmode == 1) {
      // Get last day of selected month, convert it to ISO-Date in local timezone
      // and set it to the hidden input field.
      var lastDayOfMonth = new Date(
        event.date.getFullYear(),
        event.date.getMonth() + 1, 0, 23, 59, 59, 999
      );
      // Get timezone offset in Milliseconds
      var timeZoneOffset = (lastDayOfMonth).getTimezoneOffset() * 60000;
      var localISOTime = (new Date(lastDayOfMonth - timeZoneOffset)).toISOString();
      $('#datePickerToHidden').val(localISOTime);
    } else { // Max. view in DatePicker is "day"
      // Get last hour of selected date, convert it to ISO-Date in local timezone
      // and set it to the hidden input field.
      var lastHourOfDay = new Date(
        event.date.getFullYear(),
        event.date.getMonth(),
        event.date.getDate(), 23, 59, 59, 999
      );
      // Get timezone offset in Milliseconds
      var timeZoneOffset = (lastHourOfDay).getTimezoneOffset() * 60000;
      var localISOTime = (new Date(lastHourOfDay - timeZoneOffset)).toISOString();
      $('#datePickerToHidden').val(localISOTime);
    }
  });

  /**
   * Set the dates of the datepicker when the new items search form is loaded
   */
  function setDatesOnLoad() {
    // Set the "from" date and pretend it is a UTC date/time so that the datepicker
    // does not convert the local date/time to a UTC date/time which could cause
    // unwanted side effects.
    $('#datePickerFrom').datepicker('setUTCDate', new Date(fromdatefull));

    // Calculate the "to" date in local time
    var now = new Date(new Date().setHours(23, 59, 59, 999));
    var timeZoneOffset = (now).getTimezoneOffset() * 60000;
    var localNow = new Date(now - timeZoneOffset);
    var localNowIsoStr = localNow.toISOString();

    // Set the "to" date and pretend it is a UTC date/time so that the datepicker
    // does not convert the local date/time to a UTC date/time which could cause
    // unwanted side effects.
    $('#datePickerTo').datepicker('setUTCDate', new Date(localNowIsoStr));

    // Set the values of the hidden fields. They will be used for the Solr date range
    // query that is defined in Acdhch\Controller\Plugin\NewItems.
    $('#datePickerFromHidden').val(fromdatefull);
    $('#datePickerToHidden').val(localNowIsoStr);
  }

  // Execute the setDatesOnLoad function
  setDatesOnLoad();

});