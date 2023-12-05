import { FieldModel } from "@aemforms/af-core";
import { AdaptiveForm, Context, Journey } from "./model";
import Parser from "./Parser";
import { FormManager } from "./FormManager";
import {ContextManager} from "./ContextManager";
import { Lang } from "./Constant";
import fetch from "node-fetch";
import { log } from "console";

export class JourneyManager {

    contextManager: ContextManager = new ContextManager();
    formManager: FormManager = new FormManager();
    context:Context;
    parser: Parser;

    constructor(context:Context) {
        this.context = context;
        this.parser = new Parser(this.formManager.getFormDef(context?.journey?.form?.path), this.stopJourney);
        if(this.context) {
            this.context.field = this.getField(this.context?.currentKey);
        }
    }

    private stopJourney = async (payload:any) => {
        this.context.stop = true;
        console.log("Payload " ,payload);
        this.context.stopMsg = payload.msg;
    }

    /**
     * Start a new form journey.
     * @param id 
     * @param form 
     */
    public startJourney = async (id: string, form:AdaptiveForm, lang?:Lang) : Promise<Context> => {
        let journey = new Journey(id, form);
        this.parser = new Parser(this.formManager.getFormDef(form.path), this.stopJourney);
        let field = this.parser.getFirstFillableField();
        //@ts-ignore
        let key = field.key;
        let context = new Context(id, journey, key, lang);
        await this.contextManager.setContext(context);
        context.field = this.getField(context.currentKey);
        return context;
    }

    public validateAndUpdateJourney = async (context:Context, value:any) : Promise<[string, Journey]> => {
        let journey: Journey = context.journey;
        let currentKey = context.currentKey;
        if(currentKey) {
            if(journey) {
                this.setValue(journey, currentKey, value);
                console.log("Importing data to form instance");
                this.parser.importData(journey.data);
                let msg = this.parser.getFieldValidationMessage(currentKey)
                console.log("Validation message if any: ", msg);
                if(this.context.stop && this.context.stopMsg) {
                    return [this.context.stopMsg, journey];
                }
                else if(!msg) {
                    let nextKey = this.getNextFillabelFieldKey(currentKey);
                    // Journey ended if next key is not available.
                    if(!nextKey) {
                        journey.ended = new Date().getTime();
                    }
                    context.currentKey = nextKey;
                    await this.contextManager.setContext(context);
                    context.field = this.getField(context.currentKey);
                    return ["", journey];
                } else {
                    return [msg, journey];
                }
            } else {
                console.log("Unable to find journey while updating");
            }
        } else {
            console.log("Journey have already ended")
            throw new Error("Journey have already Ended");
        }
        return ["unexpected case registered", journey];
    }

    public submitJourney = async(journey: Journey):Promise<any>  => {
        this.parser.importData(journey.data);
        journey.data = this.parser?.form?.exportData();
        let action = this.formManager.getSubmitEndpoint(journey?.form?.path);
        let data = {data : journey.data};
        const init = {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'Authorization': 'Basic YWRtaW46YWRtaW4=',
                'content-type': 'application/json;charset=UTF-8',
            },
        }

        let url = "http://localhost:4502" + action;

        let resp = await fetch(url, init);
        log("Response Status", resp.status);
        if(resp.ok) {
            const payload = await resp.json();
            console.log("Payload", payload);
            return payload;
        }
    }

    public valdiateJourney = async(journey: Journey):Promise<any>  => {
        this.parser.importData(journey.data);
        journey.data = this.parser?.form?.exportData();
        return this.parser?.form?.validate();
    }

    public isJourneyEnded = (context:Context) : boolean => {
        return context.journey.ended ? true : false;
    }

    // public getJourney = async (id:string): Promise<Journey> => {
    //     let journeyStr =  await GlobalData.DATA.get(id)
    //     let journey: Journey;
    //     if(journeyStr) {
    //         journey = JSON.parse(journeyStr);
    //         return journey
    //     }
    //     throw Error(`Unable to find Journey for ${id}. Either its expired or doesn't exists`)
    // }

    private getNextFillableField(key: string):  FieldModel | undefined {
        return this.parser.getNextFillableField(key);
    }

    private getNextFillabelFieldKey(key: string):  string {
        let field = this.getNextFillableField(key);
        //@ts-ignore
        return field?.key;
    }

    private getField = (key:string) : FieldModel | undefined => {
        if(key) {
            return this.parser.getFieldByKey(key);
        } else {
            console.log("Unable to find current key");
        }
    }

    private setValue(journey: Journey, path:string, value: any, append:boolean = false) {
        path = path.replace("$form.","");
        if(value && path) {
            let data = journey.data;
            let key, keys = path.split(".");
            for (let index = 0; index < keys.length; index++) {
                key = keys[index];
                if(index == keys.length-1) {
                    if(append) {
                        let existingData = data.get(key);
                        if(existingData instanceof Array) {
                            existingData.push(value);
                        } else if(existingData) {
                            existingData = [existingData, value];
                        } else {
                            existingData = [value];
                        }
                        //@ts-ignore
                        data[key] = existingData;
                    } else {
                        //@ts-ignore
                        data[key] = value;
                    }
                } else if(data.hasOwnProperty(key)) {
                    //@ts-ignore
                    data = data[key];
                } else {
                    let newData:any = {};
                    //@ts-ignore
                    data[key] = newData;
                    data = newData;
                }
            }
        }
    }
}

