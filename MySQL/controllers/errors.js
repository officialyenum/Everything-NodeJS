
exports.getNoPageFound = (req, res, next) => {
    // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
    res.status(404).render('web/404', {
        docTitle: 'Page Not Found'
    });
}