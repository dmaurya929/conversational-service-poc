import { Constant } from "./Constant";
import { AdaptiveForm, Context, Journey } from "./model";
import { globalContext } from "..";

export class ContextManager {

    public  getContext = async (id:string): Promise<Context> => {
        let init = {
            method : Constant.GET
        }
        let response =  this.storageAPI(id, init);
        // let context:Context = await response.json();
        return response;
    }

    public setContext = async (context:Context) => {
        let field = context.field;
        context.field = undefined;
        let init = {
            method : Constant.POST,
            body: JSON.stringify(context),
            headers: {
                'Content-Type': 'application/json'
            },
        }
        await this.storageAPI(context.id, init);
        context.field = field;
        return context;
    }

    public getAllContext =async () : Promise<any> => {
        let init = {
            method : Constant.GET
        }
        let response =  await this.storageAPI("", init);
        // let result = await response.json();
        return response;
    }

    private storageAPI = async(id:string, init) => {
        // let durableObjId = GlobalData.KM.idFromName("FORMS_DO")
        // let durableObjStub = GlobalData.KM.get(durableObjId)
        
        let url = `https://conversation.dmaurya929.workers.dev.workers.dev${Constant.JOURNEY_PATH}`;
        if(id) {
            url += `?id=${id}`
        }
        // let resp = await durableObjStub.fetch(url, init)
        if(init.method === Constant.POST) {
            let idx = globalContext.findIndex((ctx:Context) => ctx.id === id);
            if(idx !== -1) {
                globalContext[idx] = {...globalContext[idx], ...JSON.parse(init.body as string)}
            } else {
                globalContext.push(JSON.parse(init.body as string));
            }
            
        } else if(init.method === Constant.GET) {
            if(id) {
                console.log("globalContext", globalContext);
                console.log("id", id);
                let context = globalContext.find((context:Context) => context.id === id);
                console.log("This is context", context);
                return context ? JSON.parse(JSON.stringify(context)): undefined;
            } else {
                return { contexts : JSON.parse(JSON.stringify(globalContext))};
            }
        }
        // console.log(`Storage Response ${resp.status}`)
        return JSON.parse(init.body as string);
    }
}