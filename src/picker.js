import moment from "moment/moment";
import {Day, Week, Month, Year, Decade, Century, Millenium} from "./picker_items";
import {defaultSettings} from "./picker_defaults";
import {PickerSettings} from "./picker_settings";
import {PickerView} from "./picker_view";
import {
    DAYS,
    WEEKS,
    MONTHS,
    YEARS,
    DECADES,
    CENTURIES,
    MILLENNIA,
    FORMAT_DATE,
    EVENT_NEW_MODEL,
    ACTION_SELECT,
    ACTION_SHOW_PREV,
    ACTION_SHOW_NEXT,
    ACTION_VIEW_MODE_UP, ACTION_INIT, ACTION_VIEW_MODE_DOWN
} from "./_constants";


const clazz = {
    [YEARS]: Year,
    [DAYS]: Day,
    [WEEKS]: Week,
    [MONTHS]: Month,
    [DECADES]: Decade,
    [CENTURIES]: Century,
    [MILLENNIA]: Millenium
};

export class Picker {
    constructor(containerNode, options){
        let mergedOptions = Object.assign({}, defaultSettings, options);
        this.containerNode = containerNode;

        let settings = new PickerSettings(mergedOptions);
        settings.addObserver(this);
        this.settings = settings;
        this.observers = [];
        this.view;
        this.model;
        this.registerEvents();
        this.actionController(ACTION_INIT);





        this.action_select = this.action_select.bind(this);
    }

    // ------------------
    notify(event){
        this.fire(event);
    }
    fire(event = {}){
        let e = new Event(event.type);
        this.containerNode.dispatchEvent(e);

        event.model = this.model;
        this.observers.forEach(obs => obs.notify(event));
    }

    on(eventType, callback){
        this.containerNode.addEventListener(eventType, callback.bind(this))
    }

    //------------------
    get model(){
        return this._model;
    }
    set model(model){
        this._model = model;
    }

    setRange(){
        this.settings.setRange();
    }

    addSelection(...dates){
        this.actionController(ACTION_SELECT, ...dates);
    }

    removeSelection(...dates){
        this.settings.removeSelection(...dates);
    }

    clearSelection(){
        this.settings.selected = [];
    }

    setSelection(...dates){
        this.settings.setSelection(...dates)
    }

    getSelection(){
        let selected = this.settings.selected;
        return selected.length === 1? selected[0] : selected
    }

    getSettings(){
        return this.settings
    }

    getMaxDate(){
        return this.settings.maxDate
    }

    setMaxDate(dateString){
        this.settings.maxDate = dateString;
    }

    getMinDate(){
        return this.settings.minDate
    }

    setMinDate(dateString){
        this.settings.minDate = dateString;
    }

    //----------------------------------
    // Events

    registerEvents(){

        this.containerNode.addEventListener('click', (event) => {
            const code = event.target.getAttribute('data-code');
            const action = event.target.getAttribute('data-action');

            if (action){
                this.actionController(action, code);
            }

        } );
    }

    //--------------------------------
    // actions

    actionController(action, ...payload){
        let shouldFire = false;
        switch (action) {
            case ACTION_INIT:
                shouldFire = this.action_init();
                break;
            case ACTION_SELECT:
                shouldFire = this.action_select(...payload);
                break;
            case ACTION_VIEW_MODE_UP:
                shouldFire = this.action_changeViewMode(payload, 1);
                break;
            case ACTION_VIEW_MODE_DOWN:
                shouldFire = this.action_changeViewMode(payload, -1);
                break;
            case ACTION_SHOW_PREV:
                shouldFire = this.action_showPrev(payload);
                break;
            case ACTION_SHOW_NEXT:
                shouldFire = this.action_showNext(payload);
                break;
            default:
                break;
        }
        if (shouldFire){
            this.model.lastAction = action;
            this.fire({
                type: action,
                payload
            });
        }

    }

    action_init(){
        let date = moment(this.settings.viewDate, FORMAT_DATE);
        let type = this.settings.viewMode;

        this.model = new clazz[type](date, this.settings );
        this.view = new PickerView(this.model, this.containerNode);
        this.observers.push(this.view);

        return true;
    }

    action_select(...code){
        let shouldFire = true;

        if (this.settings.viewMode !== this.settings.views[0]){
           this.actionController(ACTION_VIEW_MODE_DOWN, ...code);
            return false;
        }
        // lowest viewMode
        if (this.settings.multiple){
            if (this.settings.selected.includes(...code) ){
                this.settings.removeSelection( ...code )
            } else {
                this.settings.addSelection( ...code );
            }
        } else {
            this.settings.setSelection( ...code );
        }

        return shouldFire;
    }

    action_changeViewMode(code, step){
        let shouldFire = false;
        let indexOfView = this.settings.views.lastIndexOf(this.model.type);
        if (this.settings.views[indexOfView + step]){
            this.settings.viewMode = this.settings.views[indexOfView + step];
            this.model = new clazz[this.settings.viewMode](code, this.settings );
            shouldFire = true;
        }
        return shouldFire;
    }

    action_showNext(code){
        this.model = new clazz[this.model.type](code, this.settings );
        return true;
    }

    action_showPrev(code){
        this.model = new clazz[this.model.type](code, this.settings );
        return true;
    }


}

// ---------------------------------------------------------------------


