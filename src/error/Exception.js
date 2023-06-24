import { print, OutputType } from "../helpers/print.js";
export default class Exception extends Error {
    static CANNOT_CONNECT_DB = 'Cannot connect to Mongoose'
    static USER_EXIST = 'User already exists'
    static CANNOT_REGISTER_USER = 'Cannot register user'
    static INCORRECT_USER_AND_PASSWORD = 'Incorrect user and password'
    static CANNOT_LOGIN_USER = 'Cannot login user'
    constructor(message){
        super(message);
        print(message, OutputType.ERROR);
    }
}
