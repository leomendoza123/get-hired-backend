import {TestInProgress} from "./test.interface"

export interface Person {
    name?: string;
    email?: string;
    phone?: string;
    web?: string;
    tests?: TestInProgress[];
};