import { Lang } from "../form/Constant";
import { Payload, } from "./IModel";
import {  Message, Parameter, Template, TemplateMessage} from "./Model.js";

export default class MessageService {

    url:string = "https://graph.facebook.com/v14.0/109980408519253/messages"

    //@ts-ignore
    public send = async(to: string, message:Message) : Promise<Payload|undefined> => {
        message.to = to;
        // const init = {
        //     body: JSON.stringify(message),
        //     method: 'POST',
        //     headers: {
        //       'Authorization': 'Bearer ' + GlobalData.ACCESS_TOKEN,
        //       'content-type': 'application/json;charset=UTF-8',
        //     },
        //   };
        //   console.log("Sending request Messaging to whatsapp ");
        //   let payload: Payload | undefined = undefined;
        //   try{ 

        //     let response = await fetch(this.url, init);
        //     console.log(`Response Status ${response?.status}`);
        //     payload = await response.json();
        //     if(!response.ok){
        //         console.log("Fail while sending message", payload);
        //     }
        //   } catch(error) {
        //     console.log("Error", error);
        //   }
        //   return payload;
    }

    public sendTemplate = async (to:string, name:string, lang: Lang,  header_parameters?:Array<Parameter>, body_parameters?: Array<Parameter>, action_parameters?: Array<Parameter>, subType:string = "quick_reply") => {
        let message: TemplateMessage = new TemplateMessage(name, lang, header_parameters, body_parameters, action_parameters, subType);
        await this.send(to, message);
    }
}