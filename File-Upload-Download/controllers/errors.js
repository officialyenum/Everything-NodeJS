exports.getNoPageFound = (req, res, next) => {
  // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
  res.status(404).render("web/404", {
    docTitle: "Page Not Found",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500ErrorPage = (req, res, next) => {
  // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
  res.status(500).render("web/500", {
    docTitle: "An error Occured",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
