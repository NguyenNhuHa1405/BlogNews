export default {
    Authorization(role) {
        var user = req.User;
        if(user.Role == role) {
            return (req, res, next) => {
                next();
            }
        }
        return (req, res, next) => {
            return res.json({ success: 1, message: "Không có quyền truy cập" })
        }
    }
}