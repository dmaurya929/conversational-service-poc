// import { Constant } from "./Constant";
// import { Context } from "./model";

// class KeyManager {

    
//     state: DurableObjectState;

//     constructor(state:DurableObjectState) {
//         this.state = state;
//     }
  
//     async fetch(request: Request) {
//       let url = new URL(request.url);
//       let query = new URLSearchParams(url.search)
//       let id = query.get("id");
//       let value: any;

//       if(url.pathname == Constant.JOURNEY_PATH) {
//           if(id) {
//               if(request.method == Constant.POST) {
//                   value = await request.json()
//                   await this.state.storage.put(id, JSON.stringify(value));
//               } else if(request.method == Constant.GET) {
//                   value = await this.state.storage?.get(id);
//                   if(!value) {
//                         value = JSON.stringify({id : id});
//                   }
//               } else {
//                   return new Response("Method not supported", { status: 400 });
//               }
//           } else if(request.method == Constant.GET) {
//                 let response = await this.state.storage.list();
//                 let result:any = {contexts : []};
//                 if(response) {
//                     response.forEach((context:any) => {
//                         result.contexts.push(JSON.parse(context));
//                     })
//                 }
//                 value = JSON.stringify(result);

//           } else {
//               return new Response("Missing id", {status : 400});
//           }
//         } else {
//             return new Response("Not found", { status: 404 });
//         }
//       return new Response(value, {
//         headers: {
//           'content-type': Constant.APPLICATION_JSON,
//         }});
//     }
//   }