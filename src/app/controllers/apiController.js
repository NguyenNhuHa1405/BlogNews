import NewsSchema from '../models/newModel.js';
class apiController {
    async getAllNews(req, res, next) {
        try {
            console.log(req.data);
            let news = await NewsSchema.find({});
            res.json(news)
        } catch (error) {
            next(error);
        }
    }
    async getDetailsNews(req, res, next) {
        try {
            const id = req?.params?.id;
            const detailId =  await NewsSchema.findOne({ id }).exec();
            if(detailId) {
               return res.status(200).json(detailId)
            }
           else {
            return res.status(500).json({ error: 'Khong tim thay'})
           }
        } catch (error) {
            return res.status(500).json({ error: 'Khong tim thay'})
        }
    }

    async addNews(req, res, next) {
        try { 
            await NewsSchema.create(req.body);
            res.json({ success: "Add news successfully"})
        } catch (error) {
            res.json({ error: "Khong the them"})
        }
    }

    async updateNews(req, res) {
        try {
            
        } catch (error) {
            
        }
    }
        
    
}

export default new apiController;