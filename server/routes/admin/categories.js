const mysql = require("../../config/mysql");

module.exports = app => {
   // her placeres alle de routes administrations panelet har brug for 

   app.get("/admin/categories", async (req, res, next) => {
      // her skal alle kategorier hentes og sendes til template filen.....
      let db = await mysql.connect();
      let [categories] = await db.execute('SELECT * FROM categories');

      console.log(categories);

      db.end();
      res.render("admin_categories", {
         "categories": categories,
      });
   });

   app.get("/admin/categories/delete/:category_id", async (req, res, next) => {
      // benyt endpoint parameter til at slette en kategori fra databasen
      // send bruger tilbage til kategori admin listen
      let db = await mysql.connect();

      let [result] = await db.execute('DELETE FROM categories WHERE category_id = ?', [req.params.category_id]);
      db.end();
      res.redirect("/admin/categories");
   });

   app.post("/admin/categories/edit/:category_id", async (req, res, next) => {
      // her skal vi modtage form data og indsætte det i databasen
      // send bruger tilbage til kategori admin listen
      let db = await mysql.connect();
      let [result] = await db.execute(
         `
            UPDATE categories 
            SET category_title = ?
            WHERE category_id = ?`,

         [category_title, category_id]
      );
      db.end();
      res.redirect("/admin/categories");
   });

   app.post("/admin/categories", async (req, res, next) => {
      // her skal vi modtage form data og indsætte det i databasen
      // send bruger tilbage til kategori admin listen
      let category_title = 0;
      let db = await mysql.connect();
      let [result] = await db.execute(
         `
            INSERT INTO categories 
            SET category_title = ?
         `,
         [category_title]
      );
      db.end();
      res.redirect("/admin/categories");
   });


};