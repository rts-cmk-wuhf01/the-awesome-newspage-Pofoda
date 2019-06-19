const mysql = require('../config/mysql');
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
         "categories":categories,
         "dateTest":"2019-05-12",
         "featuredArticlesRight":featuredArticlesRight,
         "featuredArticlesMiddle":featuredArticlesMiddle,
         "featuredArticlesLeft":featuredArticlesLeft
      });

      // let now = new Date('2019-04-02 07:00:14');
      // let formattedDate = app.locals.dateAndTime.format(now, 'D/M | ');
      // console.log(formattedDate);
   });
   
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
         db.end();
         res.render("cat-post", {
            "categories":categories,
            "articles":articles
         });
      // her kan alle kategoriens artikler hentes osv...
      
   });
   
   app.get('/contact', (req, res, next) => {
      res.render('contact');
   });
   
   app.get('/about', (req, res, next) => {
      res.render('about');
   });
   
   app.get('/single/:article_id', (req, res, next) => {
      res.render('single-post');
   });

   app.get('/database',  async (req,res,next)=>{
      let db = await mysql.connect();
      // udfør en (elelr flere) forespørgel(er)
      let [products] = await db.execute('SELECT * FROM products');
      // afslut forbindelsen til databasen
      db.end();

      res.render('products', {
         'products': products
      });
});

};