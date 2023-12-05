import { Command, Hindi_Command, Lang } from "../Constant"

export default class CommandUtil {

    public static getCommand = (msg: string): [Command, Lang] => {

        let lang = this.isHindiCommand(msg) ? Lang.HINDI : Lang.ENGLISH;

        if(this.isFindCommand(msg))
            return [Command.FIND, lang];
        else if(this.isHelpCommand(msg))
            return [Command.HELP, lang];
        else if(this.isListFormCommand(msg))
            return [Command.LIST_FORMS, lang];
        else if(this.isStartCommand(msg))
            return [Command.START, lang];
        else if(this.isResumeCommand(msg))
            return [Command.RESUME, lang];
        else if(this.isSubmitCommand(msg))
            return [Command.SUBMIT, lang];
        return [Command.UNKNOWN, lang];
        
    }


    private static isFindCommand = (msg?: string): boolean => {
        if(msg) {
            msg = msg.toLowerCase();
            return ( 
                msg.startsWith(Command.FIND) ||
                msg.startsWith(Hindi_Command.FIND)
            );
        }
        return false;
    }

    private static isHelpCommand = (msg: string): boolean => {
        if(msg) {
            msg = msg.toLowerCase();
            return ( 
                msg.startsWith(Command.HELP) ||
                msg.startsWith(Hindi_Command.HELP)
            );
        }
        return false;
    }

    private static isStartCommand = (msg?: string): boolean => {
        if(msg) {
            msg = msg.toLowerCase();
            return ( 
                msg.startsWith(Command.START) ||
                msg.startsWith(Hindi_Command.START)
            );
        }
        return false;
    }

    private static isResumeCommand = (msg: string): boolean => {
        if(msg) {
            msg = msg.toLowerCase();
            return ( 
                msg.startsWith(Command.RESUME) ||
                msg.startsWith(Hindi_Command.RESUME)
            );
        }
        return false;
    }

    private static isListFormCommand = (msg: string): boolean => {
        if(msg) {
            msg = msg.toLowerCase();
            return ( 
                msg.startsWith(Command.LIST_FORMS) ||
                msg.startsWith(Hindi_Command.LIST_FORMS)
            );
        }
        return false;
    }

    private static isSubmitCommand = (msg: string): boolean => {
        if(msg) {
            msg = msg.toLowerCase();
            return ( 
                msg.startsWith(Command.SUBMIT) ||
                msg.startsWith(Hindi_Command.SUBMIT)
            );
        }
        return false;
    }

    private static isHindiCommand = (msg:string) => {
        if(msg) {
            let charCode = msg.charCodeAt(0);
            return charCode >= 2309 && charCode <=2361;

        }
        return false;
    }
}