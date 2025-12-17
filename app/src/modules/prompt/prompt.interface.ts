import { IUser } from "../users/user.interface";


export interface IPrompt {
    title:string,
    prompt:string,
    category:[string],
    tags:[string],
    upVote:number,
    downVote:number,
    createdBy:IUser


}