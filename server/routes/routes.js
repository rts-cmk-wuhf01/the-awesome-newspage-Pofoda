module.exports = (app) => {

   app.get('/', (req, res, next) => {
      res.render('home');
   });
   
   app.get('/catagories', (req, res, next) => {
      res.render('cat-post');
   });
   
   app.get('/contact', (req, res, next) => {
      res.render('contact');
   });
   
   app.get('/about', (req, res, next) => {
      res.render('about');
   });
   
   app.get('/single', (req, res, next) => {
      res.render('single-post');
   });

};