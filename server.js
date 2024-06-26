const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const errorHandler = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");

const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandsRoute = require("./routes/brandsRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const reviewRoute = require("./routes/reviewRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const addressRoute = require("./routes/addressRoute");
const couponRoute = require("./routes/couponRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const { webhookCheckout } = require("./services/orderService");

// Connect with db
dbConnection();

// express app
const app = express();
app.use(cors()); // use for enable another domain to access my API
app.options("*", cors());
// compress all responses
app.use(compression());

// checkout webhook
app.post(
  "/webhook",
  express.raw({ type: "application.json" }),
  webhookCheckout
);
// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandsRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/address", addressRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);

app.all("*", (req, res, next) => {
  // const err = new Error(`Cant find this route: ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`Cant find this route: ${req.originalUrl}`, 400));
});

// Error Handler middlewares for express

app.use(errorHandler);

// Error Handler Rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
  Server.close(() => {
    console.log("Server shutdown...");
    process.exit(1);
  });
});

// Handle
const PORT = process.env.PORT || 3000;
const Server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
