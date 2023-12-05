export class Event {
    constructor(entry) {
        this.object = "whatsapp_business_account";
        this.entry = entry;
    }
}
export var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["IMAGE"] = "image";
    MessageType["DOCUMENT"] = "document";
    MessageType["STICKER"] = "sticker";
    MessageType["UNKNOWN"] = "unknown";
    MessageType["BUTTON"] = "button";
    MessageType["LOCATION"] = "location";
    MessageType["CONTACT"] = "contact";
    MessageType["INTERACTIVE"] = "interactive";
    MessageType["TEMPLATE"] = "template";
})(MessageType || (MessageType = {}));
export var ParameterType;
(function (ParameterType) {
    ParameterType["TEXT"] = "text";
    ParameterType["IMAGE"] = "image";
    ParameterType["CURRENCY"] = "currency";
    ParameterType["DATE_TIME"] = "date_time";
    ParameterType["PAYLOAD"] = "payload";
    ParameterType["URL"] = "url";
})(ParameterType || (ParameterType = {}));
export var InteractiveType;
(function (InteractiveType) {
    InteractiveType["LIST"] = "list";
    InteractiveType["BUTTON"] = "button";
    InteractiveType["LIST_REPLY"] = "list_reply";
    InteractiveType["BUTTON_REPLY"] = "button_reply";
})(InteractiveType || (InteractiveType = {}));
//# sourceMappingURL=IModel.js.map