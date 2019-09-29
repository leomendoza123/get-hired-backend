import {Test} from "./test.interface"

export interface Person {
    name?: string;
    email?: string;
    phone?: string;
    web?: string;
    lastSendTest?: Test;
    tests?: Test[];
};