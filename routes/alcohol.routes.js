const router = require("express").Router();

const Alcohol = require("../models/Alcohol.model");
const User = require("../models/User.model"); 

// require (import) middleware functions
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

// GET route to display the form
router.get("/alcohol/create", isLoggedIn, (req, res) => res.render("alcohol/alcohol-create", {userInSession: req.session.currentUser}));

router.post("/alcohol/create", isLoggedIn, (req, res, next) => {
  console.log(req.body);
  const { name, description, rating, percentage, cost } = req.body;

  Alcohol.create({ name, description, rating, percentage, cost })
    .then((newAlcohol) => {
      console.log("Post Created");
      return User.findByIdAndUpdate(req.session.currentUser._id, { $push: { drinks: newAlcohol._id } });
    })
    .then(() => res.redirect("/lists/my-drinks"))
    .catch((error) => next(error));
});



// GET route to display the form to update a specific alcohol
router.get("/alcohol/:alcoholId/edit", isLoggedIn, (req, res, next) => {
  const { alcoholId } = req.params;

  Alcohol.findById(alcoholId)
    .then((alcoholToEdit) => {
      // console.log(alcoholToEdit);
      res.render("alcohol/alcohol-edit.hbs", { alcohol: alcoholToEdit, userInSession: req.session.currentUser });
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

    .then(() => res.redirect("/lists/my-drinks"))
    .catch((error) => next(error));
});

//Get route for retreiving alcohol list
router.get('/lists/my-drinks', isLoggedIn, (req, res, next) => {
  User.findById(req.session.currentUser)
  .populate({ path: "drinks", options: { sort: { createdAt: -1 } } })
    .then(dbDrinks => {
      console.log("Drinks from the DB: ", dbDrinks.drinks);
      res.render('lists/my-drinks', { drinks: dbDrinks.drinks, userInSession: req.session.currentUser });
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
    .then((theAlcohol) => res.render("alcohol/alcohol-details.hbs", { alcohol: theAlcohol, userInSession: req.session.currentUser }))
    .catch((error) => {
      console.log("Error while retrieving alcohol details: ", error);

      // Call the error-middleware to display the error page to the user
      next(error);
    });
});

// GET route to retrieve and display drinks of every user
router.get("/lists/all-drinks", isLoggedIn, (req, res, next) => {
  Alcohol.find({})
    .populate('user') // Populate the 'user' field within each drink
    .sort({ createdAt: -1 })
    .then((allDrinks) => {
      console.log('allDrinks:', allDrinks);
      res.render("lists/all-drinks", { drinks: allDrinks, userInSession: req.session.currentUser });
    })
    .catch((error) => next(error));
});


module.exports = router;
