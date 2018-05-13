import moment from 'moment';
import * as pickerItem from "./picker_items";
import {Picker} from "./picker";
import {EVENT_CHANGED_SELECTION} from "./_constants";


let date = moment().locale('de');

let picker = new Picker(document.getElementById('cal'), {date, multiple: true  });
picker.addSelection( moment(), moment("2018-05-08"), moment("2016-12-05"), moment("2015-11-11"), "2018-05-07" );
picker.addSelection( moment(), moment("2016-12-05"), moment("2016-12-05"), moment("2015-11-11") );
picker.removeSelection(  moment(), moment("2016-12-05") );

// console.log(new pickerItem.Day());

let elm = document.getElementById('cal2');

 let picker2 = new Picker(elm, {
     date,
     multiple: true,
     rangeSelection: true,
     maxDate: moment("2018-05-15", "YYYY-MM-DD"),
     minDate: moment("2009-05-10", "YYYY-MM-DD"),
     // minViewMode: 2,
     // viewMode: "years",
     calendarWeeks: true,
     selectType: "days"
 });


// picker2.on('NEW_MODEL', function (e) {
//     this.addSelection("2018-05-07");
//     let ss= this.getSelection();
//     console.log("NEW_MODEL",ss);
// });
//
// picker.on(EVENT_CHANGED_SELECTION, function (e) {
//     console.log(this.getSelection());
//     picker2.setMinDate(this.getSelection());
// });
//
// picker2.on(EVENT_CHANGED_SELECTION, function (e) {
//     picker.setMaxDate(this.getSelection());
// });



