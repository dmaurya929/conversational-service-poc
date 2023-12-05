import { FormJson } from "@aemforms/af-core";
import { AdaptiveForm } from "./model";
import fetch from 'node-fetch';

export class FormManager {

    forms:Array<AdaptiveForm>

    static formDef: Map<string, any>;

    constructor() {
        this.forms = [];
        FormManager.formDef.forEach((value, key) => {
            this.forms.push(new AdaptiveForm(value.metadata.name, value.metadata.description, key, value.metadata.tags));
        })
    }

    public getForms(): Array<AdaptiveForm> {
        return this.forms;
    }

    public async getForm(path:string) : Promise<AdaptiveForm> {
        // for (const form of this.forms) {
        //     if(form.path == path) {
        //         return form;
        //     }
        // }
        // return ;

        // Fetch the form from the server.
        
        let url = "http://localhost:4502" + path + "/jcr:content/guideContainer.model.json";
        console.log("Fetching form from ", url);
        const init = {
            method: 'GET',
            headers: {
                'Authorization': 'Basic YWRtaW46YWRtaW4=',
                'content-type': 'application/json;charset=UTF-8',
            },
        };
       const resp = await fetch(url, init);
       console.log("Response Status", resp.status);
        if(resp.ok) {
            let form = await resp.json() as FormJson;
            console.log("Form: ", form)
            FormManager.formDef.set(path, form);
            return new AdaptiveForm(form.title, "This is some form", path, null);
        }
        return undefined;
    }

    public search(search: string) : Array<AdaptiveForm> | undefined {
        let forms: Array<AdaptiveForm> = [];
        if(search) {
            search = search.toLowerCase();
                let tags = search.split(" ");
                for (const form of this.forms) {
                    if(form.includeTag(tags)) {
                        forms.push(form);
                    }
                }
            }
        return forms;
    }

    public getFormDef(path:string): any {
        return FormManager.formDef.get(path);
    }

    public getSubmitEndpoint(path:string):any {
        return this.getFormDef(path)?.action;
    }

    public getThankYouMsg(path: string) {
        return this.getFormDef(path)?.thankYouMessage; 
    }
}