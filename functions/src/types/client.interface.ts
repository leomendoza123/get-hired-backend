import { Campaign } from "./campaign.interface";

export interface Client {
    name: string;
    campaign: Campaign[];
    admin: string [];
}