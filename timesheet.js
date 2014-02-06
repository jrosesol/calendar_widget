/**
* Used to asynchrously request user data to Google Calendar.
*/
function run() {
  var firstWeekDay = getFirstWeekDay();
  var lastWeekDay = getLastWeekDay(firstWeekDay);
  var startDate = {year: firstWeekDay.getFullYear(), month: (firstWeekDay.getMonth() + 1), date : firstWeekDay.getDate(),
                   hour : 0, minute: 0, second: 0};
  var endDate = {year: lastWeekDay.getFullYear(), month: (lastWeekDay.getMonth() + 1), date : lastWeekDay.getDate(),
                 hour : 0, minute: 0, second: 0};

  //var calendars = ['en.usa#holiday@group.v.calendar.google.com',
  //    'en.canadian#holiday@group.v.calendar.google.com'];

  google.calendar.read.getEvents(eventCallback, 'selected', startDate, endDate);
  
}

function datesCallback(dates) {
  var start = dates.startTime;
  var end = dates.endTime;

  var out = start.month + '/' + start.date + ' - ' +
      end.month + '/' + end.date;
  alert(out);
}

function refresh() {
    google.calendar.subscribeToDates(datesCallback);
    window.setInterval(run, 1000);
}

function eventCallback(response) {
  var out = '';
  var widgetOut = '';
  var timeCount = 0.0;
  for (var i = 0; i < response.length; ++i) {
    if ('error' in response[i]) {
      out += 'Can\'t load calendar for ' + response[i].email + '\n';
      continue;
    }

    out += 'CALENDAR: ' + response[i].email + '\n';
    if ('name' in response[i]) {
      out += 'NAME: ' + response[i].name + '\n';
    }

    var events = response[i]['events'];
    var calendarEventsCount = 0;
    for(var j = 0; j < events.length; ++j) {
      var e = events[j];
      if ('title' in e) {
        out += 'Title = ' + e.title + '\n';
      }
      if ('location' in e) {
        out += 'Location = ' + e.location + '\n';
      }
      if ('startTime' in e) {
        if (!e.allDay) {
            out += 'Duration = ' + ((e.endTime.hour - e.startTime.hour) + ((e.endTime.minute - e.startTime.minute)/60.0)) + '\n';
            timeCount += ((e.endTime.hour - e.startTime.hour) + ((e.endTime.minute - e.startTime.minute)/60.0));
            calendarEventsCount += ((e.endTime.hour - e.startTime.hour) + ((e.endTime.minute - e.startTime.minute)/60.0));
        }
      }
      out += '---------\n';
    }
    
    // Add a calendar time count entry only if we have more then 0 accounted time
    if (calendarEventsCount > 0) {
        widgetOut += (response[i].email + '<BR>');
        widgetOut += ('Time: ' + calendarEventsCount + 'h' + '<BR>');
    }
  }
  //alert(out);
  
  var elem = document.getElementById('numberOfHours');
  elem.innerHTML = widgetOut;
  gadgets.window.adjustHeight();
}

function getFirstWeekDay() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getYear();
    if (year < 2000)
    year = year + 1900;
    var offset = today.getDay();
    var week;

    if(offset != 0) {
        day = day - offset;
        if ( day < 1) {
            if ( month == 1) day = 31 + day;
            if (month == 2) day = 31 + day;
            if (month == 3) {
            if (( year == 00) || ( year == 04)) {
            day = 29 + day;
            }
            else {
            day = 28 + day;
               }
            }
            if (month == 4) day = 31 + day;
            if (month == 5) day = 30 + day;
            if (month == 6) day = 31 + day;
            if (month == 7) day = 30 + day;
            if (month == 8) day = 31 + day;
            if (month == 9) day = 31 + day;
            if (month == 10) day = 30 + day;
            if (month == 11) day = 31 + day;
            if (month == 12) day = 30 + day;
            
            if (month == 1) {
                month = 12;
                year = year - 1;
            }
            else {
                month = month - 1;
                }
        }
    }
    
    var firstWeekDayOnMonday = new Date(year, month, day + 1);
    
    return firstWeekDayOnMonday;
}

function getLastWeekDay(firstWeekDay) {
    var lastWeekDay = new Date(firstWeekDay);
    lastWeekDay.setDate(lastWeekDay.getDate() + 6);
    
    return lastWeekDay;
}

// Compute the time on startup
document.body.onload = function() {refresh();}
