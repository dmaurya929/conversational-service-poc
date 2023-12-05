import { FieldModel } from "@aemforms/af-core";
import { Lang } from "./Constant";

export enum DataType {
    string = "string",
    number = "number",
    boolean = "boolean",
    Integer = "integer",
    Object = "object",
    Array = "array"
}

export enum FieldType {
    Text = "text-input",
    Number = "number-input",
    Data = "date-input",
    File = "file-input",
    List = "drop-down",
    Radio = "radio-group",
    CheckboxGroup = "checkbox-group",
    PlainText = "plain-text",
    Checkbox = "checkbox",
    Button = "button",
    TextArea = "multiline-input",
    Panel = "panel",
    Email = "email"
}

export class AdaptiveForm {
    name: string;
    description: string;
    path: string;
    tags?: Array<string>;
    id: string;

    constructor(name: string, desc: string, path:string, tags: Array<string>) {
        this.name = name;
        this.description = desc;
        this.path = path;
        this.id = path;
        this.tags = tags;
    }

    includeTag(tags: Array<string>) : boolean {
        for (const tag of tags) {
            if(this.tags && this.tags.includes(tag)) {
                return true;
            }
        }
        return false;
    }
}


export class Journey {
    id:string;
    form: AdaptiveForm;
    data: Map<string, any>;
    started: number;
    ended?: number;

    constructor(id: string, form: AdaptiveForm) {
        this.id = id;
        this.form = form;
        this.started = new Date().getTime();
        this.data = new Map();
    }
}

export class Context {
    journey:Journey;
    lang: Lang;
    currentKey:string;
    field?:FieldModel
    id:string;
    stop?:boolean;
    stopMsg?:string;

    constructor(id:string, journey:Journey, key:string, lang:Lang = Lang.ENGLISH, field?:FieldModel) {
        this.id = id;
        this.currentKey = key;
        this.journey = journey;
        this.field = field;
        this.lang = lang;
    }
}