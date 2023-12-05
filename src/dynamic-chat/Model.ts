import { FieldType } from "../form/model";
import { CardSubType } from "./IModel";

export abstract class FormMessage {
    type: string;
    text: string;
    placeholder?: string;
    continueConversation: boolean = true;
    pickList?: Array<string>;
    pickValueList?: Array<string>;
    action?: string;
}

export class SubmitMessage extends FormMessage {
    constructor(text: string) {
        super();
        this.type = CardSubType.TEXT;
        this.text = text;
        this.continueConversation = false;
        this.action = "SUBMIT_SUCCESS"
    }
}

export class TextField extends FormMessage {

    constructor(text: string, placeholder?: string) {
        super();
        this.type = CardSubType.TEXT;
        // this.fieldType = FieldType.Text;
        this.text = text;
        this.placeholder = placeholder;
    }
}

export class NumberField extends FormMessage {

    constructor(label: string, placeholder?: string) {
        super();
        this.type = 
        // this.fieldType = FieldType.Number
        this.text = label;
        this.placeholder = placeholder;
    }
}

export class DateInput extends FormMessage {

    constructor(label: string, placeholder?: string) {
        super();
        this.type = CardSubType.DATE;
        // this.fieldType = FieldType.Data
        this.text = label;
        this.placeholder = placeholder;
    }
}

export class PlainText extends FormMessage {
        value: string;
        constructor(label: string) {
            super();
            this.type = CardSubType.TEXT;
            // this.fieldType = FieldType.PlainText
            this.value = label;
        }
}

export class DropDown extends FormMessage {

    constructor(label: string, pickList: string[], pickValueList: string[]) {
        super();
        this.type = CardSubType.TEXT;
        // this.fieldType = FieldType.List
        this.text = label;
        this.pickList = pickList;
        this.pickValueList = pickValueList;
    }
}

export class EmailInput extends FormMessage {
    constructor(label: string, placeholder?: string) {
        super();
        this.type = CardSubType.EMAIL;
        // this.fieldType = FieldType.Text
        this.text = label;
        this.placeholder = placeholder;
    }
}