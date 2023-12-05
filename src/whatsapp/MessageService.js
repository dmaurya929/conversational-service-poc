import { TemplateMessage } from "./Model.js";
export default class MessageService {
    constructor() {
        this.url = "https://graph.facebook.com/v14.0/109980408519253/messages";
        //@ts-ignore
        this.send = async (to, message) => {
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
        };
        this.sendTemplate = async (to, name, lang, header_parameters, body_parameters, action_parameters, subType = "quick_reply") => {
            let message = new TemplateMessage(name, lang, header_parameters, body_parameters, action_parameters, subType);
            await this.send(to, message);
        };
    }
}
//# sourceMappingURL=MessageService.js.map