// PickerItem

import moment from "moment/moment";
import {PickerSettings} from "./picker_settings";

import {
    DAYS,
    WEEKS,
    MONTHS,
    YEARS,
    DECADES,
    CENTURIES,
    MILLENNIA,
    FORMAT_DATE
} from "./_constants";


function getMoment(dateString){
    let result = null;
    if (dateString && dateString.isValid && dateString.isValid() ){
        result = dateString
    } else if ( moment(dateString, FORMAT_DATE).isValid ) {
        result =  moment(dateString, FORMAT_DATE)
    } else if ( moment(dateString).isValid ) {
        result =  moment(dateString)
    }
    return result
}

export class PickerItem {
    constructor(date = moment(), settings = new PickerSettings(), type = MONTHS){
        // let mergedSettings = Object.assign({}, this.settings, settings);
        // console.log(mergedSettings, settings);
        this._date = getMoment(date).clone() || moment() ;

        const m = this.date;
        this.settings = settings;
        this.type = type;
        this.unit = type;
        this.steps = 1;
        this.today = moment();
        this.code = m.format( FORMAT_DATE );
        this.month = m.get(MONTHS);
        this.year = m.get(YEARS);
        this.isHighlighted = this.settings.highlighted.includes( this.code );
        this.cssClasses;
        this.cssClassesString;
        this.start;
        this.end;


        // this.getUnits = this.getUnits.bind(this);
    }


    get number(){
        return this.date.get(this.unit);
    }

    get date(){
        return moment(this._date, FORMAT_DATE).clone();
    }

    set date(dateStringOrMoment){
        this._date = moment(dateStringOrMoment).format(FORMAT_DATE);
    }

    get isSelected(){
        return  this.settings.selected.some( item => moment(item, FORMAT_DATE).isBetween(this.start, this.end, this.unit, '[]') );
    }

    get isInRange(){
        return this.settings.isRangeSelected && this.date.isBetween(this.settings.rangeStart, this.settings.rangeEnd, this.unit, '[]') // || this.isRangeStart || this.isRangeEnd;
    }

    get isRangeStart(){
        return this.settings.rangeStart && this.settings.rangeStart.isBetween(this.start, this.end, this.unit, '[]');
    }

    get isRangeEnd(){
        return this.settings.rangeEnd && this.settings.rangeEnd.isBetween(this.start, this.end, this.unit, '[]');
    }

    get isDisabled(){
        let isContainedInDisabled = this.settings.disabled.includes( this.code );
        let isStartAfterMaxDate =  this.settings.maxDate && this.start.isAfter(this.settings.maxDate);
        let isEndBeforeMinDate = this.settings.minDate && this.end.isBefore(this.settings.minDate);
        let isContainingMinOrMax = false;
        if (this.settings.minDate || this.settings.maxDate) {
            isContainingMinOrMax = this.settings.minDate.isBetween(this.start, this.end) || this.settings.maxDate.isBetween(this.start, this.end);
        }
        return isContainedInDisabled || isStartAfterMaxDate || isEndBeforeMinDate && !isContainingMinOrMax
    }

    get isToday(){
        return this.date.isSame(this.today, this.unit) || this.today.isBetween(this.start, this.end, null, "[]");
    }

    get end(){
        let mod = this.number%this.steps;
        return this.date.clone().add(this.steps-mod-1, this.unit).endOf(this.unit);
    }

    get start(){
        let mod = this.number%this.steps;
        return this.date.clone().add(-mod, this.unit).startOf(this.unit);
    }

    get cssClassesString(){
        return this.cssClasses.join(" ");
    }

    get nextCode(){
        return this.next.code;
    }

    get prevCode(){
        return this.prev.code;
    }

    get isPrevDisabled(){
        return this.settings.minDate && this.prev.end.isBefore(this.settings.minDate)
    }

    get isNextDisabled(){
        return this.settings.maxDate && this.next.start.isAfter(this.settings.maxDate)
    }

    get next(){
        let date = this.date.clone().add(this.steps, this.unit);
        return new clazz[this.type](date, this.settings);
    }
    get prev(){
        let date = this.date.clone().add(-this.steps, this.unit);
        return new clazz[this.type](date, this.settings);
    }

    get cssClasses(){
        let result = ["picker-item", this.type];
        if (this.isInRange) {
            result.push("range")
        }
        if (this.isSelected) {
            result.push("active")
        }
        if (this.isHighlighted) {
            result.push("highlight")
        }
        if (this.isDisabled) {
            result.push("disabled")
        }
        if (this.isToday) {
            result.push("today")
        }
        if (this.belongsToPrevious) {
            result.push("old")
        }
        if (this.belongsToNext) {
            result.push("new")
        }
        if (this.isRangeEnd) {
            result.push("range-end")
        }
        if (this.isRangeStart) {
            result.push("range-start")
        }
        return result;
    }

    getUnits(units) {
        let result = [];
        if (units === DECADES || units === YEARS || units === CENTURIES){
            let steps = this.steps/10 || 1;
            let item = this.start.clone().add(-steps, YEARS);
            while (item.isBefore(this.end.clone().add(steps, YEARS))) {
                let subUnit = new clazz[units](item, this.settings);
                subUnit.parent = this;
                result.push( subUnit );
                item.add(steps, YEARS)
            }
        } else {
            let unit = this.start.clone().startOf(units);
            while (unit.isBefore(this.end)) {
                let subUnit = new clazz[units](unit, this.settings);
                subUnit.parent = this;
                result.push( subUnit );
                unit.add(1, units)
            }
        }
        return result
    }

    get belongsToPrevious(){
        let result;
        if (this.type === DAYS){
            result = this.parent && this.parent.parent && this.date.isBefore( this.parent.parent.start, MONTHS );
        } else {
            result = this.parent && this.date.isBefore( this.parent.start, this.unit );
        }
        return result
    }
    get belongsToNext(){
        let result;
        if (this.type === DAYS){
            result = this.parent && this.parent.parent && this.date.isAfter( this.parent.parent.end, MONTHS );
        } else {
            result = this.parent && this.date.isAfter( this.parent.end, this.unit );
        }
        return result;
    }


}

// ---------------------------------------------------------------------
// export Subclasses

export class Day extends PickerItem{
    constructor(date, settings){
        super(date, settings, DAYS);
        const m = this.date;
        this.dayOfWeek = m.weekday();
        this.nameShort = m.format('dd');
        this.nameMedium = m.format('ddd');
        this.nameLong = m.format('dddd');
        this.label = this.number;
        this.parentType = MONTHS;
    }

    get number(){
        return this.date.date()
    }


}

export class Month extends PickerItem{
    constructor(moment, settings){
        super(moment, settings, MONTHS);
        this.daysCount = this.date.daysInMonth();
        this.nameShort = this.date.format('MMM');
        this.nameLong = this.date.format('MMMM');

        this.label = this.nameShort;
        this.title = `${this.nameShort} ${this.year}`;
        this.childType = WEEKS;
        this.parentType = YEARS;
    }

}

export class Week extends PickerItem {
    constructor(moment, settings){
        super(moment, settings, WEEKS);

        this.label = this.number;
        this.title = this.label;
        this.childType = DAYS;
        this.parentType = MONTHS;
    }

}

export class Year extends PickerItem{
    constructor(moment, settings){
        super(moment, settings, YEARS);
        this.steps = 1;
        this.unit = YEARS;
        this.label = this.number;
        this.title = this.label;
        this.childType = MONTHS;
        this.parentType = DECADES;

    }



}

export class Decade extends Year{
    constructor(date, settings){
        super(date, settings, YEARS);

        this.steps = 10;

        this.label = `${this.start.get(YEARS)} - ${this.end.get(YEARS)}`;
        this.title = this.label;

        this.childType = YEARS;
        this.type = DECADES;
        this.parentType = CENTURIES;
    }

}

export class Century extends Decade{
    constructor(date, settings){
        super(date, settings);
        this.steps = 100;
        this.childType = DECADES;
        this.parentType = MILLENNIA;
        this.type = CENTURIES;
        this.label = `${this.start.get(YEARS)} - ${this.end.get(YEARS)}`;
        this.title = this.label;

    }
}

export class Millenium extends Decade{
    constructor(date, settings){
        super(date, settings);
        this.steps = 1000;
        this.childType = CENTURIES;
        this.parentType = false;
        this.type = MILLENNIA;
        this.label = `${this.start.get(YEARS)} - ${this.end.get(YEARS)}`;
        this.title = this.label;

    }
}

function createModel(type, date, settings){
    return new clazz[type](date, settings)
}

const clazz = {
    [YEARS]: Year,
    [DAYS]: Day,
    [WEEKS]: Week,
    [MONTHS]: Month,
    [DECADES]: Decade,
    [CENTURIES]: Century,
    [MILLENNIA]: Millenium
};