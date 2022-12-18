// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");


const password = encodeURIComponent(process.env.MONGODB_PASSWORD)

const MONGO_URI = `mongodb+srv://Conjectures:${password}@cluster0.n9h6bsz.mongodb.net/alcohol-rater-2?retryWrites=true&w=majority` ||
  "mongodb://0.0.0.0:27017/alcohol-rater-2";

  mongoose.set('strictQuery', true);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${databaseName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
