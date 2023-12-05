

export enum Constant {
    JOURNEY_PATH = "/journey",
    GET = "GET",
    POST = "POST",
    APPLICATION_JSON = "application/json;charset=UTF-8",
    CONTENT_TYPE ="content-type",
}

export enum Hindi_Command {
    RESUME = "resume",
    HELP = "जानकारी",
    FIND = "खोजो",
    START = "हिन्दी",
    SUBMIT = "submit",
    LIST_FORMS = "सूची प्रपत्र",
    MULTI_SELECTION_COMPLETED = "multiple_selection_completed"
}

export enum Lang {
    HINDI = "hi",
    ENGLISH = "en"
}
export enum Command {
    RESUME = "resume",
    HELP = "help",
    FIND = "find",
    START = "english",
    SUBMIT = "submit",
    LIST_FORMS = "list forms",
    MULTI_SELECTION_COMPLETED = "multiple_selection_completed",
    UNKNOWN = ""
}

export enum Tempalte {
    RESUME = "resume_journey",
    MISSING_JOURNEY="journey_missing",
    FORM = "form_details",
    HELP = "help",
    NO_RESULT = "no_result",
    MULTIPLE_SELECTION = "multiple_selection",
    ERROR="error",
    SUBMIT="submit_info",
    SUBMIT_UPDATE="submit_update_1",
    QUESTION="question",
    UNEXPECTED_DOCUMENT="unexpected_document"
}


/*export class GlobalData {
    public static IsEdge:boolean = true;
    public static MODELS: any
    public static DATA:any 
    public static ACCESS_TOKEN:string
    public static KM:any
  }*/