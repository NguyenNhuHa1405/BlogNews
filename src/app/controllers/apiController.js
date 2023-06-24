import NewsSchema from '../models/newModel.js';
class apiController {
    async getAllNews(req, res, next) {
        try {
            let news = await NewsSchema.find({});
            res.json(news)
        } catch (error) {
            next(error);
        }
    }
    async getDetailsNews(req, res, next) {
        try {
            const id = req.params.id;
            const detailId =  await NewsSchema.findOne({ id }).exec();
            res.json(detailId)
        } catch (error) {
            
        }
    }

    async addNews(req, res, next) {
        try { 
            await NewsSchema.create(req.body);
            res.json({ success: "Add news successfully"})
        } catch (error) {
            
        }
    }
        
    
}

export default new apiController;