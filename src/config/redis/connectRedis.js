import  { createClient } from 'redis';
const client = createClient({
    password: 'hczaD2Am87bnyvhECVwXPAAn6raq8Gly',
    socket: {
        host: 'redis-15886.c295.ap-southeast-1-1.ec2.cloud.redislabs.com',
        port: 15886
    }
});

try {
    await client.connect()
    console.log("Connect redis successfully")

} catch (error) {
    console.log('Connect redis error')
}


export default client;
