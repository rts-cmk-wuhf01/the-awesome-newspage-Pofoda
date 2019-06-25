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

   app.post("/admin/categories", async (req, res, next) => {
      // her skal vi modtage form data og indsætte det i databasen
      // send bruger tilbage til kategori admin listen
   });


};