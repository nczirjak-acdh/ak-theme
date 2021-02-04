$(document).ready(function () {
    // Get params from script tag.
    // ATTENTION: When the name of this file changes, the filename in the following
    //            JQuery selector (= script[src*=newItemDatepicker]) must be changed
    //            too!
    var scriptTag = $('script[src*=newUserDatepicker]');
    var dateformat = scriptTag.attr('dateformat');
    var language = scriptTag.attr('language');

    $('#birthdayDatePicker').datepicker({
        format: dateformat,
        language: language,
        startView: 2,
        maxViewMode: 2,
        endDate: "0d",
        autoclose: true,
        disableTouchKeyboard: true,
        enableOnReadonly: true
    });


});