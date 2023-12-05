import { Lang } from "../form/Constant";
import {  Interactive, InteractiveType, MessageContent, MessageType, ParameterType, Payload, PhoneContact } from "./IModel";


export abstract class Message {
    messaging_product:string = "whatsapp";
    recipient_type: string =  "individual";
    to?: string;
    from?: string;
    id?: string;
    timestamp?: string;
    text?: Text;
    image?: Image;
    document?: Document;
    sticker?: Image;
    contacts?: PhoneContact[];
    errors?: Error[];
    button?: Parameter;
    button_reply?:ReplyButton;
    interactive?: Interactive;
    abstract type: MessageType;

    getMessage?(): MessageContent | undefined {
        return undefined;
    }
}

export class TemplateMessage extends Message {
    type: MessageType = MessageType.TEMPLATE;
    template: Template;

    constructor(name: string, lang:Lang, header_parameters?:Array<Parameter>, body_parameters?: Array<Parameter>, action_parameters?: Array<Parameter>, subType:string = "quick_reply") {
        super();
        this.template = new Template(name, header_parameters, body_parameters, action_parameters, subType)
        if(lang) {
            this.template.language = {code : lang}
        }
    }
}

export class TextMessage extends Message {
    text: Text;
    type: MessageType = MessageType.TEXT;

    constructor(text: Text) {
        super();
        this.text = text;
    }
    getMessage(): Text {
        return this.text;
    }
}

export class ImageMessage extends Message {
    image: Image;
    type: MessageType = MessageType.IMAGE;
    constructor(image: Image) {
        super();
        this.image = image;
    }
    getMessage(): Image {
        return this.image;
    }
}

export class DocumentMessage extends Message {
    document: Document;
    type: MessageType = MessageType.DOCUMENT;
    constructor(document: Document) {
        super();
        this.document = document;
    }
    getMessage(): Document {
        return this.document;
    }
}

export class InteractiveMessage extends Message {
    interactive: Interactive;
    type: MessageType = MessageType.INTERACTIVE;
    constructor(interactive: Interactive) {
        super();
        this.interactive = interactive;
    }
    getMessage(): Interactive {
        return this.interactive;
    }
}

export class Template implements MessageContent {
    name: string;
    language?: {code : string};
    components?: Array<Component>;

    constructor(name: string, header_parameters?:Array<Parameter>, body_parameters?: Array<Parameter>, action_parameters?: Array<Parameter>, subType:string = "quick_reply") {
        this.name = name;
        this.language = { code : "en"}
        this.components = [];
        if(header_parameters) {
            this.components.push(new Component("header", header_parameters));
        }
        if(body_parameters) {
            this.components.push(new Component("body", body_parameters));
        }
        if(action_parameters) {
            let i = 0;
            for(let parameter of action_parameters) {
                let component = new Component(MessageType.BUTTON, [parameter]);
                component.sub_type = subType;
                component.index = i+"";
                this.components.push(component);
                i++;
            }
        }
    }
}

export class Component {
    type: string;
    sub_type?: string;
    parameters?: Array<Parameter>
    index?: string;

    constructor(type: string, parameters:Array<Parameter>) {
        this.type = type;
        this.parameters = parameters;
    }
}

export class Parameter {
    type: ParameterType;
    text?: string;
    payload?: string;
    image?: Image
    constructor(type: ParameterType, value: string) {
        this.type = type;
        switch(type) {
            case ParameterType.TEXT :
                this.text = value;
                break;
            case ParameterType.IMAGE:
                this.image = new Image(value);
            case ParameterType.PAYLOAD:
                this.payload = value;
        }
    }
}

export class Text implements MessageContent {
    preview_url?: boolean = false;
    body: string;

    constructor(body: string, preview_url: boolean = false) {
        this.body = body;
        this.preview_url = preview_url
    }
}

export class Image implements MessageContent {
    caption?: string;
    mime_type?: string;
    sha256?: string;
    id?: string;
    link?: string;

    constructor(value: string) {
        if(value.indexOf("http") !=-1) {
            this.link = value;
        } else {
            this.id = value;
        }
    }
}

export class Document extends Image {
    fileName?: string;
}

export class ReplyButton {
    type: string = "reply";
    reply: Row;

    constructor(id: string, title:string) {
        this.reply = new Row(id, title);
    }
}
export class ReplyInteractive implements Interactive {
    type: InteractiveType = InteractiveType.BUTTON;
    header?: Header;
    body:Value;
    footer?: Value;
    action?: {buttons: Array<ReplyButton>}
    constructor(body: Value, buttons: ReplyButton[], header: Header, footer: Value) {
        this.body = body;
        this.action = {buttons : buttons};
        this.header = header;
        this.footer = footer;
    }
}


export class ListInteractive implements Interactive {
    type: InteractiveType = InteractiveType.LIST;
    header?: Header;
    body:Value;
    footer?: Value;
    action: Action;
    constructor( body: Value, action: Action, header: Header, footer: Value ) {
        this.body = body;
        this.action = action;
        this.header = header;
        this.footer = footer;
    }
}

export class Value{
    text: string;

    constructor(text: string) {
        this.text = text;
    }
}

export class Header extends Value {
    type: string = MessageType.TEXT;
    constructor(text: string) {
        super(text);
    }
}

export class Action {
    button: string;
    sections: Section[];

    constructor(button: string, sections: Section[]) {
        this.button = button;
        this.sections = sections;
    }
}

export class Row {
    id: string;
    title: string;
    description?: string;

    constructor(id: string, title: string, desc?: string) {
        this.id = id;
        this.title = title;
        this.description = desc;
    }
}

export class Section {
    title: string;
    rows: Row[];

    constructor(title: string, rows: Row[]) {
        this.title = title;
        this.rows = rows;
    }
}

