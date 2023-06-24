import apiRouter from './apiRouter.js'
import apiUserRouter from './apiUserRouter.js'
function router(app) {
    app.use('/api', apiRouter)
    app.use('/api/user', apiUserRouter)
}

export default router;