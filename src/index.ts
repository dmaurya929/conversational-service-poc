import { Entry, Event, MessageType } from "./whatsapp/IModel";
import { JourneyManager } from "./form/JourneyManager";
import { FormManager } from "./form/FormManager";
import { Constant } from "./form/Constant";
import {ContextManager} from "./form/ContextManager";
import { Context, Journey } from "./form/model";
// const cors = require('cors');
import cors from 'cors';
import express, { Request, Response, response } from 'express';
//import sampleFormJson from "./forms/sample.form.json"
import { IConversation } from "./form/IConversation";
import { DynamicChatConversation } from "./dynamic-chat/DynamicChatConversation";
import { FormMessage } from "./dynamic-chat/Model";

const VERIFY_TOKEN = "aem-jalagari-conversation-form"
let formManager: FormManager;
let contextManager: ContextManager = new ContextManager();
// let eventManager:EventManager = new EventManager();

let forms:Map<string, any> = new Map();

const setGlobal = async () => {
  //forms.set("/content/forms/af/Wkndform", sampleFormJson); // Hard coded as of now
  FormManager.formDef = forms;
  console.log(FormManager.formDef);
  formManager = new FormManager();
}

const app = express()
app.use(express.json())
app.use(cors());

app.get('/receiver', (request: Request, response: Response) => {
  let query : any = request?.query;
  if(query["hub.verify_token"] == VERIFY_TOKEN) {
    console.log("Received Request");
    response.status(200).send(query["hub.challenge"]);
  }
  response.status(403).send("Token doesn't match")
});

app.post('/receiver', async (request: Request, response: Response) => {
  await setGlobal();
  if(request) {
    //@ts-ignore
    const event:Event = request.body;
    // await eventManager.received(event)
  }
  return response.status(200).send("ACK");
});

app.get('/journey', async (request: Request, response: Response) => {
    let result = await contextManager.getAllContext();
    response.send(result);
});
app.post('/journey', async (request: Request, response: Response) => {
    //@ts-ignore
    const context:Context = request.body;
    if(context && context.id && context.currentKey && context.journey && context.journey.form) {
      context.id = context.id;
      context.journey.id = context.id;
      await contextManager.setContext(context);
      response.status(200).send({ result: true });
      return;
    }
    response.status(400).send("Missing required context data");
});

app.post('/journey/:id/:command', async (request: Request, response: Response) => {
    await setGlobal();
    let id = request?.params?.id || "9876543210";
    let context: Context;
    context = await contextManager.getContext(id);
    let command = request?.params?.command;
    let dcConversation: IConversation = new DynamicChatConversation(context);
    let msgRes = await dcConversation.processMessage(command, request?.body , id);
    let formMsg: FormMessage =  dcConversation.constructMessage(msgRes);
    // delete context.field;
    response.status(200).send(formMsg);
})

app.all('*', (request, response) => response.status(404).send("Not Found"))

export const globalContext : Array<Context> = [];

const port = process.env.PORT || 8082;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});