

export default class SubmitService {

    // async execute(model, data, attachments, params) {
    //     logger.info("Execute submit action");
    //     this.model = await this.loadDefinition(params.__ow_headers.origin + afPath);
    //     let actionType = this.model.actionType;
    //     let result;
    //     switch(this.model.actionType) {
    //         case "formsskylinepipeline/customDoRsubmit":
    //             logger.info("Found Doc Gen API");
    //             let docGen = new DocGen();
    //             result = await docGen.execute(data, attachments, this.model, params);
    //             return result;
    //         case "fd/af/components/guidesubmittype/restendpoint":
    //             logger.info("Found rest submit invoking it");
    //             let restSubmit = new RestSubmit();
    //             result = await restSubmit.execute(data, attachments, this.model.restEndpointPostUrl, params);
    //             return result;
    //     }
    //     console.log("Received response " + result);
    // }

}