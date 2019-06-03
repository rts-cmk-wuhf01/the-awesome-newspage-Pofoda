module.exports = (app) => {

   app.get('/', (req, res, next) => {
      res.render('home', {
         "dateTest":"2019-05-12"
      });

      // let now = new Date('2019-04-02 07:00:14');
      // let formattedDate = app.locals.dateAndTime.format(now, 'D/M | ');
      // console.log(formattedDate);
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