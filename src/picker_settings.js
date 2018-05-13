import moment from "moment/moment";
import {defaultSettings} from "./picker_defaults";
import {ACTION_SELECT, EVENT_CHANGED_SELECTION, FORMAT_DATE, VIEWS} from "./_constants";

Array.prototype.unique = function() {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
};

function getMoment(dateString){
    let result;
    if (!dateString){
        result = null
    }else if (dateString && dateString.isValid && dateString.isValid() ){
        result = dateString
    } else if ( moment(dateString, FORMAT_DATE).isValid ) {
        result =  moment(dateString)
    } else if ( moment(dateString).isValid ) {
        result =  moment(dateString)
    }
    return result
}

function getDateStrings(dateStrings){
    let result = [];
    [...dateStrings].forEach( dateString => {
        getMoment(dateString) ? result.push(getMoment(dateString).format(FORMAT_DATE) ) : null
    });
    return result;
}


export class PickerSettings{
    constructor(options = defaultSettings){
        this._selected = options.selected;
        this.disabled = options.disabled;
        this.rangeSelection = options.rangeSelection;
        this.rangeStart = options.rangeStart;
        this.rangeEnd = options.rangeEnd;

        this.highlighted = options.highlighted;
        this.viewDate = getMoment(options.date);
        this.viewMode = options.viewMode;
        this.minDate = options.minDate;
        this.maxDate = options.maxDate;
        this.multiple = options.multiple ;
        this.selectType = options.selectType;
        this.views = VIEWS.slice(options.minViewMode, options.maxViewMode+1);
        this.calenderWeeks = options.calendarWeeks;
        this.cssAnimation = options.cssAnimation;
        this.buttonToday = options.buttonToday;
        this.buttonClear = options.buttonClear;
        this.locale = options.locale;

        this.observers = []


    }
    addObserver(observer){
        if (observer.notify){
            this.observers.push(observer);
        } else {
            console.log("adding observer failed: no notify()");
        }
    }
    fire(event){
        this.observers.forEach(obs => obs.notify(event))
    }

    get maxDate(){
        return this._maxDate
    }

    set maxDate(dateString){
        this._maxDate = getMoment(dateString);
    }

    get minDate(){
        return this._minDate
    }

    set minDate(dateString){
        this._minDate = getMoment(dateString);
    }

    get selected(){
        return this._selected
    }
    set selected(arr){
        let oldValue = this.selected.slice();

        this._selected = arr;
        let newValue = this.selected.slice();
        this.setRange();
        // this.fire({
        //     type: ACTION_SELECT,
        //     oldValue,
        //     newValue
        // });
    }

    get isRangeSelected(){
        return this.rangeSelection && this.selected.length === 2
    }

    setRange(){
        if (this.rangeSelection) {
            this.selected.splice(0, this.selected.length-2 );
        }
        if (!this.isRangeSelected) {
            return;
        }
        let a = moment(this.selected[0], FORMAT_DATE);
        let b = moment(this.selected[1], FORMAT_DATE);

        this.rangeStart = moment.min(a, b);
        this.rangeEnd = moment.max(a, b);
    }

    addSelection(...dates){
        let input = getDateStrings(dates);
        let newSelected = [...this.selected, ...input].unique();
        this.selected = newSelected
    }

    removeSelection(...dates){
        let input = getDateStrings(dates);
        let result = this.selected.filter( date => !input.includes(date) );
        this.selected = result;
    }

    setSelection(...dates){
        this.selected = getDateStrings(dates);
    }

}
