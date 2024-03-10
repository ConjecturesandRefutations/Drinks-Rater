const router = require("express").Router();

const Alcohol = require("../models/Alcohol.model");
const User = require("../models/User.model"); 

// require (import) middleware functions
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

// GET route to display the form
router.get("/alcohol/create", isLoggedIn, (req, res) => res.render("alcohol/alcohol-create"));

router.post("/alcohol/create", isLoggedIn, (req, res, next) => {
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
      res.render("alcohol/alcohol-edit.hbs", { alcohol: alcoholToEdit });
    })
    .catch((error) => next(error));
});

// POST route to actually make updates on a specific alcohol
router.post("/alcohol/:alcoholId/edit", isLoggedIn, (req, res, next) => {
  const { alcoholId } = req.params;
  const { name, description, rating, percentage, cost } = req.body;

  Alcohol.findByIdAndUpdate(alcoholId, { name, description, rating, percentage, cost }, { new: true })
    .then((updatedAlcohol) => res.redirect(`/alcohol/${updatedAlcohol.id}`)) // go to the details page to see the updates
    .catch((error) => next(error));
});

// POST route to delete an alcohol from the database
router.post("/alcohol/:alcoholId/delete", isLoggedIn, (req, res, next) => {
  const { alcoholId } = req.params;
  console.log(alcoholId)

  Alcohol.findByIdAndDelete(alcoholId)

    .then(() => res.redirect("/alcohol"))
    .catch((error) => next(error));
});

//Get route for retreiving alcohol list
router.get('/alcohol', isLoggedIn, (req, res, next) => {
  User.findById(req.session.currentUser)
  .populate({ path: "drinks", options: { sort: { createdAt: -1 } } })
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
