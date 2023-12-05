import { Image, Message, ReplyButton, Row, Text } from "./Model";

export class Event {
    object: string = "whatsapp_business_account";
    entry: Entry[];
    constructor(entry : Entry[]) {
        this.entry = entry;
    }
}

export interface Entry {
    id: string;
    changes: Change[];
}

export interface Change {
    value: Payload;
    field: string;
}

export interface Payload {
    messaging_product: string;
    metadata: Metadata;
    contacts: Contact[];
    messages: Message[];
    statuses?: Status[];
}

export interface Status {
    id: string,
    status: string,
    timestamp: string,
    recipient_id: string
}
export interface Metadata {
    display_phone_number: string;
    phone_number_id: string;
}

export interface Profile {
    name: string;
}

export interface Contact {
    profile: Profile;
    input?: number;
    wa_id: string;
}


export enum MessageType {
    TEXT="text",
    IMAGE="image",
    DOCUMENT="document",
    STICKER="sticker",
    UNKNOWN="unknown",
    BUTTON="button",
    LOCATION="location",
    CONTACT="contact",
    INTERACTIVE="interactive",
    TEMPLATE="template"
}

export enum ParameterType {
    TEXT="text",
    IMAGE="image",
    CURRENCY="currency",
    DATE_TIME="date_time",
    PAYLOAD="payload",
    URL="url"
}

export interface MessageContent {

}

export interface Context {
    from: number;
    id: string;
}

export interface Interactive extends MessageContent {
    list_reply?: Row;
    button_reply?: Row;
    type: InteractiveType;
}
export enum InteractiveType {
    LIST="list",
    BUTTON="button",
    LIST_REPLY="list_reply",
    BUTTON_REPLY="button_reply"
}

export interface Error {
    code: number;
    details: string;
    title: string;
}
export interface Location {
    latitude: string;
    longitude: string;
    name: string;
    address: string;
}

export interface Address {
    city: string;
    country: string;
    country_code: string;
    state: string;
    street: string;
    type: string;
    zip: string;
}

export interface Email {
    email: string;
    type: string;
}

export interface Name {
    formatted_name: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    suffix: string;
    prefix: string;
}

export interface Org {
    company: string;
    department: string;
    title: string;
}

export interface Phone {
    phone: string;
    wa_id: string;
    type: string;
}

export interface Url {
    url: string;
    type: string;
}

export interface PhoneContact {
    addresses: Address[];
    birthday: string;
    emails: Email[];
    name: Name;
    org: Org;
    phones: Phone[];
    urls: Url[];
}