
//-------------------------------
import moment from 'moment';
import {
    ACTION_SELECT, ACTION_SELECT_CLEAR,
    ACTION_SHOW_NEXT,
    ACTION_SHOW_PREV, ACTION_SHOW_TODAY,
    ACTION_VIEW_MODE_UP,
    DAYS,
    MONTHS
} from "../_constants";

export function createView(model){
    let str = `
            <div class="picker ${model.settings.cssAnimation? 'animate' : ''} ${model.lastAction}">
                <div class="picker-heading">
                    ${createNavigation(model)}
                </div>
                <div class="picker-body">
                    ${tableFactory(model)}
                </div>
                <div class="picker-footer">
                    ${createFooter(model)}
                </div>
            </div>
        `;

    return str;
}

//-----------------------------
// Navigation

function createNavigation(model){
    return  `           
        <div class="picker-navigation">
            ${createButton(model.prevCode, ACTION_SHOW_PREV, `<i class="fas fa-arrow-left"></i>`)}
            ${createButton(model.code, ACTION_VIEW_MODE_UP, model.title)}
            ${createButton(model.nextCode, ACTION_SHOW_NEXT, `<i class="fas fa-arrow-right"></i>`)}
        </div>
        `;
}

function createButton(code, action, content){

    return `<a class="btn btn-sm btn-light" data-code="${code}" data-action="${action}">${content}</a>`;
}

//----------------------------------
function createFooter(model){
    let str = "";
    if (model.settings.buttonToday ) {
        str += createButton( "", ACTION_SHOW_TODAY, 'Today' );
    }
    if (model.settings.buttonClear ) {
        str += createButton( "", ACTION_SELECT_CLEAR, "Clear" );
    }
    return str;

}
//-----------------------------

function tableFactory(model){
    let result;
    switch(model.type){
        case MONTHS:
            result = createTableMonth(model) ;
            break;
        default:
            result = createTable(model);
            break;
    }
    return result;
}


//--------------------------------
// Months

function createTableMonth(pickerItem){
    let weeks = pickerItem.getUnits(pickerItem.childType);

    let str = `
        <table class="table table-sm table-borderless picker-table ${pickerItem.type}">
            <thead>
                ${createHeader(weeks[0])}
            </thead>
            <tbody>
                ${createBody(weeks)}
            </tbody>
        </table>`;
    //----------------
    return str;
    //---------------------------------------
    //---------------------------------------

    function createHeader(week){
        let days = week.getUnits(DAYS);
        let header = days.map( day => `<th>${day.nameShort}</th>` ).join("") ;
        let calenderWeek = week.settings.calenderWeeks? '<th class="calender-week">#</th><th class="spacer">&nbsp;</th>' : '';

        return `<tr>${calenderWeek+header}</tr>`;
    }

    function createBody(weeks) {
        let tr = weeks.map(week => `<tr>${createWeek(week)}</tr>`);

        return tr.join("");
    }
    function createWeek (week){
        let days = week.getUnits(DAYS);
        let calenderWeek = week.settings.calenderWeeks? `<td class="calender-week">${week.number}</td><td class="spacer"></td>` : '';
        let tds = days.map( createItem ).join("") ;

        return calenderWeek+tds;
    }


}

//--------------------------
//

function createTable(model) {
    let subUnits = model.getUnits(model.childType);

    let str = `
        <table class="table table-sm table-borderless picker-table ${model.type}">
            <tbody>
                ${createTableBody(subUnits)}
            </tbody>
        </table>`;
    return str;

    function createTableBody(units){
        let itemsPerRow = 3;
        let rows = 4;
        let str = ``;
        for (let i=0; i<rows; i++ ) {
            let items = units.slice(i*itemsPerRow, i*itemsPerRow+itemsPerRow );
            str += `<tr>${createTableCells(items)}</tr>`
        }
        return str;
    }
    function createTableCells(items){
        let result = items.map( createItem ) ;
        return result.join("");
    }

}

//-------------------------------

function createItem(item){
    let str;
    if( item.belongsToNext || item.belongsToPrevious){
        str = `<td></td>`
    } else if (item.isDisabled){
        str = `
            <td class="disabled">
                <div class="${item.cssClassesString}">${item.label}</div>
            </td>`
    } else {
        str = `
            <td  >
                <div class="${item.cssClassesString}" data-action="${ACTION_SELECT}" data-code="${item.code}">${item.label}</div>
            </td>`
    }
    return str;
}

