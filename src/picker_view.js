import {createView} from "./themes/bootstrap4";
import {ACTION_SET_MAX_DATE} from "./_constants";

export class PickerView{

    constructor(model, node){
        this.containerNode = node;
        this.model = model;
    }

    update(){
        this.containerNode.innerHTML = createView(this.model);
        this.debug();
    }

    notify(event){
        console.log("VIEW:", event);
        this.model = event.model;
    }

    get model(){
        return this._model
    }

    set model(model){
        this._model = model;
        this.update();
    }

    debug(){
        let debugId = this.containerNode.id + "-debug";
        let obj = this.model.settings;
        let div = document.getElementById(debugId);
        let table = document.createElement('table');

        div.innerHTML = "";
        for (let key in obj){
            let row = document.createElement('tr');
            row.innerHTML = `<td>${key}</td><td><b>${obj[key]}</b></td>`;
            table.append(row);
        }
        div.append(table);
    }

}

