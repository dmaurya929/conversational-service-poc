import { FieldModel } from "@aemforms/af-core";
import { Lang } from "../form/Constant";
import { ContextManager } from "../form/ContextManager";
import { IConversation } from "../form/IConversation";
import { JourneyManager } from "../form/JourneyManager";
import { AdaptiveForm, Context, FieldType } from "../form/model";
import { DropDown, EmailInput, FormMessage, PlainText, SubmitMessage } from "./Model";
import { DateInput, NumberField, TextField } from "./Model";

export class DynamicChatConversation  extends IConversation {

    public renderForms(form: AdaptiveForm[], search: string, lang: Lang): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public renderHelp(lang: Lang): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public renderChoice(field: FieldModel): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public renderCheckbox(field: FieldModel): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public renderMultiselection(field: FieldModel): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public renderTextField(field: FieldModel): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public renderErrorField(msg: string, field: FieldModel): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public journeyEnded(msg: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public handleError(msg: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public preSubmit(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public postSubmit(result: any, thankYouMsg: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public resume(to: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public constructMessage = (msgRes): FormMessage => {
        let label = "";
        let field ;
        let fieldType;
        if(msgRes.status === "FAILURE") {
            label = msgRes.msg;
            field = this.journeyManager.parser.getFieldByKey(this.context.currentKey);
            fieldType = field?.fieldType;
        } else {
            field = this.context?.field;
            fieldType = field?.fieldType;
            label = field?.label?.value || "Unknown Label";
        }
        if(this.journeyManager.isJourneyEnded(this.context)) {
            return new SubmitMessage(msgRes.msg);
         }
           
        switch(fieldType) {
            case FieldType.Text:
                return new TextField(label, field?.placeholder);
                break;
            case FieldType.Number:
                return new NumberField(label, field?.placeholder);
                break;
            case FieldType.Data: 
                return new DateInput(label, field?.placeholder);
                break;
            case FieldType.List:
                let enumNames = field?.enumNames.map((name) => {
                    if(typeof name === "string") {
                        return name;
                    } 
                    return name.value;
                })
                return new DropDown(label, enumNames, field?.enum,);
            case FieldType.Email:
                return new EmailInput(label, field?.placeholder);
            default:
                throw new Error(`Unknown field type ${fieldType}`);
        }
        // if(this.context.stop) {
        //     return new PlainText(msgRes.msg);
        // } else if(this.context.field) {
        //     return new PlainText(msgRes.msg); // also to check for the re-enter
        // }
        
        // return null;
    }
}