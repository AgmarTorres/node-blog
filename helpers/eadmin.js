module.exports = {
  eAdmin: function (req, res, next) {
    if (req.isAuthenticate() && req.user.eAdmin == 1) {
      return next();
    }
    req.flash("error_msg", "Você precisa ser um admin");
    res.redirect("/");
  },
};
