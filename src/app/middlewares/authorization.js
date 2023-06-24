export default async function(req, res, next) {
    const dataUser = req.data;
    const id = req?.params?.id
    switch (dataUser.role) {
        case 'admin':
            next();
            break;
        case 'editor':
            if(req.originalUrl === `/api/${id}` ||  `/api/add`) {
                next();
            }
            break;

    }
}