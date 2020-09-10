// To parse this data:
//
//   import { Convert, CardInterface } from "./file";
//
//   const cardInterface = Convert.toCardInterface(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface CardInterface {
    error:  null;
    status: string;
    result: Result[];
}

export interface Result {
    comment_count:      number;
    subject:            string;
    dueDate:            Date;
    description:        string;
    is_parent:          boolean;
    createdOn:          Date;
    assignedTo:         string;
    updater:            Author;
    archived:           boolean;
    card_type_id:       number;
    id:                 string;
    author:             Author;
    column:             ParentClass;
    updatedOn:          Date;
    priority:           string;
    sequence:           string;
    status_update_date: Date;
    is_subscribed:      boolean;
    position:           Position;
    attachment_count:   number;
    has_description:    boolean;
    startDate:          Date;
}

export interface Author {
    name:        string;
    id:          string;
    nick_name:   string;
    domain_id:   string;
    domain_name: string;
    gender:      string;
}

export interface ParentClass {
    id:          string;
    name:        string;
    parent_id?:  string;
    type:        string;
    parent?:     ParentClass;
    status_id:   number;
    description: string;
    deleted:     boolean;
}

export interface Position {
    board:  Board;
    column: PositionColumn;
    lane:   Lane;
}

export interface Board {
    id:        string;
    name:      string;
    work_type: number;
}

export interface PositionColumn {
    id:        string;
    name:      string;
    parent_id: string;
}

export interface Lane {
    id:   string;
    name: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCardInterface(json: string): CardInterface {
        return cast(JSON.parse(json), r("CardInterface"));
    }

    public static cardInterfaceToJson(value: CardInterface): string {
        return JSON.stringify(uncast(value, r("CardInterface")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "CardInterface": o([
        { json: "error", js: "error", typ: null },
        { json: "status", js: "status", typ: "" },
        { json: "result", js: "result", typ: a(r("Result")) },
    ], false),
    "Result": o([
        { json: "comment_count", js: "comment_count", typ: 0 },
        { json: "subject", js: "subject", typ: "" },
        { json: "dueDate", js: "dueDate", typ: Date },
        { json: "description", js: "description", typ: "" },
        { json: "is_parent", js: "is_parent", typ: true },
        { json: "createdOn", js: "createdOn", typ: Date },
        { json: "assignedTo", js: "assignedTo", typ: "" },
        { json: "updater", js: "updater", typ: r("Author") },
        { json: "archived", js: "archived", typ: true },
        { json: "card_type_id", js: "card_type_id", typ: 0 },
        { json: "id", js: "id", typ: "" },
        { json: "author", js: "author", typ: r("Author") },
        { json: "column", js: "column", typ: r("ParentClass") },
        { json: "updatedOn", js: "updatedOn", typ: Date },
        { json: "priority", js: "priority", typ: "" },
        { json: "sequence", js: "sequence", typ: "" },
        { json: "status_update_date", js: "status_update_date", typ: Date },
        { json: "is_subscribed", js: "is_subscribed", typ: true },
        { json: "position", js: "position", typ: r("Position") },
        { json: "attachment_count", js: "attachment_count", typ: 0 },
        { json: "has_description", js: "has_description", typ: true },
        { json: "startDate", js: "startDate", typ: Date },
    ], false),
    "Author": o([
        { json: "name", js: "name", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "nick_name", js: "nick_name", typ: "" },
        { json: "domain_id", js: "domain_id", typ: "" },
        { json: "domain_name", js: "domain_name", typ: "" },
        { json: "gender", js: "gender", typ: "" },
    ], false),
    "ParentClass": o([
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "parent_id", js: "parent_id", typ: u(undefined, "") },
        { json: "type", js: "type", typ: "" },
        { json: "parent", js: "parent", typ: u(undefined, r("ParentClass")) },
        { json: "status_id", js: "status_id", typ: 0 },
        { json: "description", js: "description", typ: "" },
        { json: "deleted", js: "deleted", typ: true },
    ], false),
    "Position": o([
        { json: "board", js: "board", typ: r("Board") },
        { json: "column", js: "column", typ: r("PositionColumn") },
        { json: "lane", js: "lane", typ: r("Lane") },
    ], false),
    "Board": o([
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "work_type", js: "work_type", typ: 0 },
    ], false),
    "PositionColumn": o([
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "parent_id", js: "parent_id", typ: "" },
    ], false),
    "Lane": o([
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
    ], false),
};
