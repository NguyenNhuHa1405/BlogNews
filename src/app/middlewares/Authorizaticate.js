export default {
    Authorization(role) {
        return (req, res, next) => {
            var user = req.User;
            if(!user) return res.redirect("/login")
            if(user.Role == role) return next();
            res.json({ message: "Không thể truy cập "});
        }
    }
}