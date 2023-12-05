import { Command, Lang } from "./Constant";
import { FormManager } from "./FormManager";
import { ContextManager } from "./ContextManager";
import { AdaptiveForm, Context } from "./model";
import { JourneyManager } from "./JourneyManager";
import { FieldModel } from "@aemforms/af-core";
import Util from "./utils/Util";
import CommandUtil from "./utils/CommandUtil";
import { FormMessage } from "../dynamic-chat/Model";
import { Response } from "express";

export abstract class IConversation {

    formManager: FormManager = new FormManager();
    contextManager:ContextManager = new ContextManager();
    journeyManager: JourneyManager;
    context:Context;

    constructor(context:Context) {
        this.context = context;
        this.journeyManager = new JourneyManager(context);
        console.log("Field details cons ", context?.field?.name)
    }

    public processMessage = async (msg:string, payload, from?: string) => {
        if(msg) {
            switch(msg) {
                case "start":
                    if(from && payload) {
                        var msgg = await this.startJourney(from, payload.formId, Lang.ENGLISH);
                        return { status: "SUCCESS" , msg: msgg};
                    } else {
                        return { status: "FAILURE", msg: "Unable to start journey. Please try again."};
                    } 
                    break;
                default: 
                    let field = this.context?.field;
                    let value = this.convertValues(field, payload.inputVal);
                    console.log("Input value is ", value);
                    const msg = await this.updateAndMove(value);
                    if(this.journeyManager.isJourneyEnded(this.context)) {
                        const resp = await this.submitForm();
                        return resp;
                     }
                     if(!msg) {
                        return {status: "SUCCESS"};
                     }
                    return { msg: msg, status: "FAILURE" };

            }
        }
        return null;
    }

    protected convertValues = (field:FieldModel | undefined, value:any) : any => {
        if(field) {
            if(Util.isMultiSelection(field) && field.enum) {
                let indexes = value.split(",");
                let response = [];
                for (const index of indexes) {
                    response.push(field.enum[parseInt(index)-1]);
                }
                return response;
            } else if(field && Util.isCheckbox(field)) {
                return (value === 'true');
            }
        } 
        return value;
    }

    protected updateAndMove = async (value:any) => {
        let context = this.context;
        let to = context?.id;
        try {
            let [msg, journey] = await this.journeyManager.validateAndUpdateJourney(context, value);
            console.log("update journey: ", journey)
            return msg;
            // if(!msg) {
            //     await this.renderField();
            // } else {
            //     if(context.stop) {
            //         await this.journeyEnded(msg);
            //     } else if(context.field) {
            //        await this.renderErrorField(msg, context?.field);
            //     } else {
            //         console.log(`unable to find the next field in form and its not even end of Form Journey`);
            //     }
            // }
        } catch (error) {
            console.log("Error while updating & moving journey", JSON.stringify(error));
            return `Unable to find Form Journey for ${to}. Either it expired or doesn't exist.`;
        }
    }

    private findForms = async (search: string, lang: Lang) => {
        console.log("Finding forms");
        let forms: Array<AdaptiveForm> = [];
        if(search) {
            search = search.toLowerCase();
            let tags = search.split(" ");
            for (const form of this.formManager.getForms()) {
                if(form.includeTag(tags)) {
                    forms.push(form);
                }
            }
        }
        await this.renderForms(forms, search, lang);
    }

    protected startJourney = async (id: string, path: string, lang: Lang) => {
        let form = await this.formManager.getForm(path);
        console.log("Starting new journey", path, form)
        if(form) {
            this.context = await this.journeyManager.startJourney(id, form, lang);
        } else {
            let msg = `Unable to find form with path - ${path}`;
            console.log (msg);
            return msg;
        }
        return null;
    }

    protected renderField = async () => {
        let context = this.context;
        let field = context.field;
        if(field) {
            if(Util.isChoice(field) && field.enum) {
                await this.renderChoice(field);
            } else if(Util.isMultiSelection(field)) {
                await this.renderMultiselection(field);
            } else if(Util.isCheckbox(field)) {
                await this.renderCheckbox(field);
            } else {
                await this.renderTextField(field);
            }
        } else if(this.journeyManager.isJourneyEnded(context)) {
           await this.submitForm();
        } else {
            console.log(`unable to find the next field in form and its not even end of Form Journey`);
        }
    }
    
    private submitForm = async () => {
        let context = this.context;
        try {
            const payload = await this.journeyManager.submitJourney(context.journey);
            return { msg: payload.thankYouMessage ? payload.thankYouMessage : "Thank You for sumitting Form", status: "SUCCESS"};
        } catch (error) {
            console.log("Error while submitting form", JSON.stringify(error));
            return { status: "FAILURE", msg:`Error while submitting form.` };
        }
    }

    public abstract renderForms(form:Array<AdaptiveForm>, search: string, lang: Lang): Promise<void>;

    public abstract renderHelp(lang: Lang) : Promise<void>;
    public abstract renderChoice(field: FieldModel): Promise<void>;
    public abstract renderCheckbox(field: FieldModel): Promise<void>;
    public abstract renderMultiselection(field: FieldModel): Promise<void>;
    public abstract renderTextField(field: FieldModel): Promise<void>;
    public abstract constructMessage(msgRes): FormMessage;

    public abstract renderErrorField(msg: string, field: FieldModel): Promise<void>;

    public abstract journeyEnded(msg: string): Promise<void>;
    public abstract handleError(msg: string): Promise<void>;

    public abstract preSubmit(): Promise<void>;
    public abstract postSubmit(result:any, thankYouMsg: string): Promise<void>;

    public abstract resume(to: string): Promise<void>;


    protected getLabel(field : FieldModel, lang: Lang): string {
        let label = field?.label?.value || "Unknown Label";
        //@ts-ignore
        if(lang == Lang.HINDI &&  field?.label?.hi) {
            //@ts-ignore
            label = field?.label?.hi; 
        }
        return label;
    }

    protected getTitle(field : FieldModel, lang: Lang): string {
        let label = field?.properties?.title?.value || this.getLabel(field, lang);
        if(lang == Lang.HINDI && field?.properties?.title?.hi) {
            label = field?.properties?.title?.hi
        }
        return label;
    }
}