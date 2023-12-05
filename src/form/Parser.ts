import {Field, createFormInstance, FormModel, ContainerModel, FieldsetModel, FieldModel, Action} from "@aemforms/af-core"
import Util from "./utils/Util";

export default class Parser {

    formDef: any;
    fields: Array<FieldModel>;
    fieldNameMap: Map<string, number>;
    form?: FormModel;

    constructor(formDef:any, listener?:Function) {
        if(formDef) {
            this.form = createFormInstance(formDef);
        }
        this.formDef = formDef;
        this.fields = [];
        this.fieldNameMap = new Map();
        this._parseForm();

        if(this.form) { 
            this.form.subscribe((response: Action) => {
                if(listener) {
                    listener.call(null,response?.payload);
                }
                console.log("Recevied Form end Journey signal", response?.payload);
            }, "journeyEnd");
        }
    }

    _parseForm() {
        if(this.form && this.form.items) {
            this.form.items.forEach(field => {
                this._parseObject(field, this.form?.name)
            })
        }
    }

    _parseObject(field:FieldsetModel | FieldModel| undefined, key : string = "") {
        if(field) {
            let name : string = field.name ? field.name : "";
            if(field.isContainer) {
                key = name ? key + "." + name : key;
                let container : ContainerModel = field as ContainerModel;
                if(container.items) {
                    container.items.forEach(field => {
                        this._parseObject(field, key);
                    });
                }
            } else {
                let id  = name ? key + "." + name : key;
                // @ts-ignore
                field.key = id;
                this.fields.push(field as FieldModel);
                this.fieldNameMap.set(id, this.fields.length-1);
            }
            key = this.form?.name || "";
        }
    }

    getFields() : Array<FieldModel> {
        return this.fields;
    }

    getFieldByKey (key : string): FieldModel | undefined {
        if(key && this.fieldNameMap.has(key)) {
            let index = this.fieldNameMap.get(key);
            if(index != undefined && (index >=0 && index < this.fields.length)) {
                return this.fields[index];
            }
        }
    }

    getFieldByIndex(index: number) : FieldModel | undefined {
        if(index >= 0 && index < this.fields.length) {
            return this.fields[index];
        }
    }

    getNextFillableField(key: string) : FieldModel | undefined {
        let field;
        let index = this.fieldNameMap.get(key);
        if(index != undefined) {
          for(let i = index+1; i<this.fields.length;i++) {
                field = this.fields[i]
                if(Util.isFillableField(field)) {
                  return field
                }
          }
        }
    }

    getFirstFillableField() : FieldModel | undefined {
        for (let index = 0; index < this.fields.length; index++) {
            let field = this.fields[index];
            if(Util.isFillableField(field)) {
                return field;
            }
        }
    }

    setValue(key : string, value: any) : boolean | undefined {
        let field : Field = this.getFieldByKey(key) as Field;
        if(field) {
            field.value = value;
            field.validate();
            return field.valid;
        }
    }

    getValue(key : string) : any {
        let field : Field = this.getFieldByKey(key) as Field;
        if(field) {
            return field.value;
        }
    }

    importData(data: any) {
        this.form?.importData(data);
    }

    isValid(key:string) : boolean {
        //@ts-ignore
        return this.getFieldByKey(key)?.valid;
    }

    getFieldValidationMessage(key: string) : string {
        let field = this.getFieldByKey(key);
        let errorMsg = "";
        if(!field?.valid) {
            let errors = field?.validate();
            if(errors) {
                errors.forEach(error => {
                    if(error && error.errorMessages) {
                        error.errorMessages.forEach(msg => {
                            errorMsg += msg;
                        });
                    }
                });
            }
        }
        return errorMsg;
    }
}