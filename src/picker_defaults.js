import {DAYS, MONTHS, VIEWS, WEEKS} from "./_constants";


export const defaultSettings = {
    rangeStart : null,
    rangeEnd : null,
    rangeSelection : false,
    selected : [],
    disabled : [],
    highlighted : [],
    maxDate: null,
    minDate: null,
    viewMode: VIEWS[0],
    viewDate: null,
    multiple: false,
    selectType: DAYS,
    views: VIEWS,
    maxViewMode: VIEWS.length-1,
    minViewMode: 0,
    calendarWeeks: false,
    cssAnimation: true,
    buttonToday: true,
    buttonClear: true,
    locale: 'en'
};
