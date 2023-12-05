import { FieldModel, FieldsetModel } from "@aemforms/af-core";
import { Lang } from "../Constant";
import { FieldType } from "../model";

export default class Util {
    public static isFillableField(field : FieldModel) : boolean {
        switch(field.fieldType) {
            case FieldType.List:
            case FieldType.Radio:
            case FieldType.CheckboxGroup:
            case FieldType.Checkbox:
            case FieldType.Number:
            case FieldType.Text:
            case FieldType.TextArea:
            case FieldType.File:
            case FieldType.Data:
            case FieldType.Email:
                return field.enabled == true && field.visible == true && field.readOnly == false;
        }
        return false;
    }
    public static isStaticField( field : FieldsetModel | FieldModel) : boolean {
        return field && field.fieldType ==FieldType.PlainText ;
    }
    public static isButton( field : FieldsetModel | FieldModel) : boolean {
        return field && field.fieldType ==FieldType.Button ;
    }
    public static isChoice( field : FieldsetModel | FieldModel) : boolean {
        return (field && field.fieldType == FieldType.List) || 
				(field && field.fieldType == FieldType.Radio);
    }

    public static isMultiSelection(field : FieldsetModel | FieldModel) : boolean {
        return field.fieldType == FieldType.CheckboxGroup;
    }

    public static isFileType(field : FieldModel) : boolean {
        return field && field.fieldType == FieldType.File;
    }

    public static isCheckbox(field : FieldsetModel | FieldModel) : boolean {
        return field && field.fieldType == FieldType.Checkbox;
    }
}