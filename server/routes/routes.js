const mysql = require('../config/mysql');
async function getCategories() {
   let db = await mysql.connect();
   let [categories] = await db.execute(`
      SELECT category_id, category_title 
      FROM categories
      ORDER BY category_title ASC`);
   db.end();
   return categories;
};
module.exports = (app) => {

   app.get('/', async (req, res, next) => {
      let db = await mysql.connect();
      let [categories] = await db.execute('SELECT * FROM categories'); // Nav

      let [featuredArticlesRight] = await db.execute(`
      SELECT 
      *
      FROM articles
      LEFT OUTER JOIN categories ON fk_category_id = category_id
      WHERE article_is_featured = 1
      `);

      let [featuredArticlesMiddle] = await db.execute(`
      SELECT 
      *
      FROM articles
      LEFT OUTER JOIN categories ON fk_category_id = category_id
      WHERE article_is_featured = 2
      `)

      let [featuredArticlesLeft] = await db.execute(`
      SELECT 
      *
      FROM articles
      LEFT OUTER JOIN categories ON fk_category_id = category_id
      LEFT OUTER JOIN authors ON fk_author_id = author_id
      WHERE article_is_featured = 3
      `)

      // console.log(featuredArticlesRight);
      // console.log(featuredArticlesMiddle);
      // console.log(featuredArticlesLeft);



      db.end();
      res.render('home', {
         "categories": categories,
         "dateTest": "2019-05-12",
         "featuredArticlesRight": featuredArticlesRight,
         "featuredArticlesMiddle": featuredArticlesMiddle,
         "featuredArticlesLeft": featuredArticlesLeft
      });

      // let now = new Date('2019-04-02 07:00:14');
      // let formattedDate = app.locals.dateAndTime.format(now, 'D/M | ');
      // console.log(formattedDate);
   });

   //------------------------------------------------------------------

   // app.get('/catagories', (req, res, next) => {
   //    res.render('cat-post');
   // });
   app.get('/categories/:category_id', async (req, res, next) => {
      let db = await mysql.connect();
      let [categories] = await db.execute('SELECT * FROM categories');
      let [articles] = await db.execute(`
         SELECT category_id, article_id, article_likes, category_title, article_title, article_image, article_postdate, author_name, article_text, category_title
         FROM articles 
         LEFT OUTER JOIN authors    ON fk_author_id = author_id
         LEFT OUTER JOIN categories ON fk_category_id = category_id
         WHERE fk_category_id = ?`, [req.params.category_id]);

      let [featuredArticlesRight] = await db.execute(`
         SELECT 
         *
         FROM articles
         LEFT OUTER JOIN categories ON fk_category_id = category_id
         WHERE article_is_featured = 1
         `);

      db.end();
      res.render("cat-post", {
         "featuredArticlesRight": featuredArticlesRight,
         "categories": categories,
         "articles": articles
      });
      // her kan alle kategoriens artikler hentes osv...

   });

   //------------------------------------------------------------------

   app.get('/contact', (req, res, next) => {

      res.render('contact');
   });

   //  tilføjes i routes.js filen f.eks. lige under app.get('/contact') endpoint
   app.post('/contact', async (req, res, next) => {
      let db = await mysql.connect();
      // indsamling af værdierne og oprettelse af de nødvendige variabler.
      let name = req.body.name;
      let email = req.body.email;
      let subject = req.body.subject;
      let message = req.body.message;
      let contactDate = new Date();
      let return_message = [];
      let result = await db.execute(`
      INSERT INTO messages 
      (message_name, message_email, message_subject, message_text, message_date) 
      VALUES 
      (?,?,?,?,?)`, [name, email, subject, message, contactDate]);
      db.end();
      // affected rows er større end nul, hvis en (eller flere) række(r) blev indsat
      if (result[0].affectedRows > 0) {
         return_message.push('Tak for din besked, vi vender tilbage hurtigst muligt');
      } else {
         return_message.push('Din besked blev ikke modtaget.... ');
      }

      let categories = await getCategories(); // denne har jeg ikke forklaret endnu! 
      res.render('contact', {
         'categories': categories,
         'return_message': return_message.join(', '),
         'values': req.body
      });

      // håndter valideringen, alle fejl pushes til et array så de er samlet ET sted
      if (name == undefined || name == 'name') {
         return_message.push('Navn mangler');
      }
      if (email == undefined || email == 'email') {
         return_message.push('Email mangler');
      }
      if (subject == undefined || subject == 'subject') {
         return_message.push('Emne mangler');
      }
      if (message == undefined || message == 'message') {
         return_message.push('Beskedteksten mangler');
      }

      if (return_message.length > 0) {
         // der er mindst 1 information der mangler, returner beskeden som en string.
         let categories = await getCategories(); // denne forklares lige om lidt!
         res.render('contact', {
            'categories': categories,
            'return_message': return_message.join(', '),
            'values': req.body // læg mærke til vi "bare" sender req.body tilbage
         });
      } else {
         res.send(req.body);
      };
   });

   //------------------------------------------------------------------

   app.get('/about', (req, res, next) => {

      res.render('about');
   });

   //------------------------------------------------------------------

   app.get('/single/:article_id', async (req, res, next) => {
      let db = await mysql.connect();
      let [categories] = await db.execute('SELECT * FROM categories'); // Nav
      let [articles] = await db.execute(`
      SELECT category_id, article_id, article_likes, category_title, article_title, article_image, article_postdate, author_name, article_text, category_title
      FROM articles
      LEFT OUTER JOIN categories ON fk_category_id = category_id
      LEFT OUTER JOIN authors    ON fk_author_id = author_id
      `);


      db.end();
      res.render('single-post', {
         "categories": categories,
         "articles": articles
      });
   });

   //------------------------------------------------------------------

   app.get('/database', async (req, res, next) => {
      let db = await mysql.connect();
      // udfør en (elelr flere) forespørgel(er)
      let [products] = await db.execute('SELECT * FROM products');
      // afslut forbindelsen til databasen
      db.end();

      res.render('products', {
         'products': products
      });
   });

   app.get('/fisk/:tal/:type', (req, res, next) => {
      let fiskdata = {
         "antal": req.params.tal,
         "type": req.params.type
      }


      res.render('fisk', {
         "fiskdata": fiskdata
      });
   });

   //------------------------------------------------------------------

};