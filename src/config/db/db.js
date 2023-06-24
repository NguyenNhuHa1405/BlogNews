import mongoose from "mongoose";
import { OutputType, print } from '../../helpers/print.js';
import Exception from '../../error/Exception.js'
async function connect() {

    try {
        await mongoose.connect(process.env.MONGOOSE_URI);
        print("Thanh Cong", OutputType.SUCCESS)
    } catch (error) {
        throw new Exception(Exception.CANNOT_CONNECT_DB)
    }
}

export default  {connect}