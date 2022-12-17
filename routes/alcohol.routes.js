const router = require("express").Router();

const Alcohol = require("../models/Alcohol.model"); // <== add this line before your routes
const User = require("../models/User.model"); // <== add this line before your routes

// require (import) middleware functions
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

// GET route to display the form
router.get("/alcohol/create", (req, res) => res.render("alcohol/alcohol-create"));

// POST route to save a new alcohol to the database in the alcohol collection
/* router.post("/alcohol/create", isLoggedIn, (req, res, next) => {
  // console.log(req.body);
  const { name, description, rating, percentage, cost } = req.body;


  
  Alcohol.create({ name, description, rating, percentage, cost })
    // .then(alcoholromDB => console.log(`New alcoholcreated: ${alcoholromDB.name}.`))
    .then(() => res.redirect("/alcohol"))
    .catch((error) => next(error));
}); */

router.post("/alcohol/create", (req, res, next) => {
  console.log(req.body);
  const { name, description, rating, percentage, cost } =
    req.body;

  Alcohol.create({ name, description, rating, percentage, cost })
    .then((newAlcohol) => {
      console.log("Post Created");
      return User.findByIdAndUpdate(req.session.currentUser, { $push: { drinks: newAlcohol._id } });
    })
    .then(() => res.redirect("/alcohol"))
    .catch((error) => next(error));
}); 

// GET route to display the form to update a specific alcohol
router.get("/alcohol/:alcoholId/edit", isLoggedIn, (req, res, next) => {
  const { alcoholId } = req.params;

  Alcohol.findById(alcoholId)
    .then((alcoholToEdit) => {
      // console.log(alcoholToEdit);
      res.render("alcohol/alcohol-edit.hbs", { alcohol: alcoholToEdit }); // <-- add this line
    })
    .catch((error) => next(error));
});

// POST route to actually make updates on a specific alcohol
router.post("/alcohol/:alcoholId/edit", (req, res, next) => {
  const { alcoholId } = req.params;
  const { name, description, rating, percentage, cost } = req.body;

  Alcohol.findByIdAndUpdate(alcoholId, { name, description, rating, percentage, cost }, { new: true })
    .then((updatedAlcohol) => res.redirect(`/alcohol/${updatedAlcohol.id}`)) // go to the details page to see the updates
    .catch((error) => next(error));
});

// POST route to delete an alcohol from the database
router.post("/alcohol/:alcoholId/delete", (req, res, next) => {
  const { alcoholId } = req.params;

  Alcohol.findByIdAndDelete(alcoholId)
    .then(() => res.redirect("/alcohol"))
    .catch((error) => next(error));
});

/* // GET route to retrieve and display all the alcohol
router.get("/alcohol", isLoggedIn, (req, res, next) => {
  Alcohol.find()
    .then((allTheAlcoholFromDB) => {
      // -> allTheAlcoholFromDB is a placeholder, it can be any word
      console.log("Retrieved alcohol from DB:", allTheAlcoholFromDB);

      // we call the render method after we obtain the alcohol data from the database -> allTheAlcoholFromDB
      res.render("alcohol/alcohol-list.hbs", { alcohol: allTheAlcoholFromDB }); // pass `allTheAlcoholFromDB` to the view (as a variable alcohol to be used in the HBS)
    })
    .catch((error) => {
      console.log("Error while getting the alcohol from the DB: ", error);

      // Call the error-middleware to display the error page to the user
      next(error);
    });
}); */

router.get('/alcohol', isLoggedIn, (req, res, next) => {
  User.findById(req.session.currentUser)
    .populate('drinks') // 
    .then(dbDrinks => {
      console.log("Drinks from the DB: ", dbDrinks.drinks);
      res.render('alcohol/alcohol-list', { drinks: dbDrinks.drinks });
    })
    .catch(err => {
      console.log(`Err while getting the posts from the DB: ${err}`);
      next(err);
    });
});

// GET route to retrieve and display details of a specific alcohol
router.get("/alcohol/:alcoholId", (req, res, next) => {
  const { alcoholId } = req.params;

  Alcohol.findById(alcoholId)
    .then((theAlcohol) => res.render("alcohol/alcohol-details.hbs", { alcohol: theAlcohol }))
    .catch((error) => {
      console.log("Error while retrieving alcohol details: ", error);

      // Call the error-middleware to display the error page to the user
      next(error);
    });
});

module.exports = router;
