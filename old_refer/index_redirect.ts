import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// POST route to handle form submission
app.post("/submit", (req, res) => {
  // Extract form data
  const formData = req.body;

  console.log(formData);

  // Hash the form data with SHA-512
  const hashedData = crypto.createHash("sha512").update(JSON.stringify(formData)).digest("hex");

  // Redirect the user to the payment page
  // const redirectUrl = `https://dev.paydibs.com/PPGSG/PymtCheckout.aspx?hash=${hashedData}`;
  const redirectUrl =
    "https://dev.paydibs.com/PPGSG/PymtCheckout.aspx?TxnType=PAY&MerchantID=TEST&MerchantPymtID=Testh001&MerchantOrdID=Order_001&MerchantOrdDesc=Payment+for+abc&MerchantTxnAmt=10.99&MerchantCurrCode=MYR&MerchantRURL=https%3A%2F%2FMerchantTestEnv.com%2Fresponse.aspx&CustIP=123.123.123.10&CustName=Test&CustEmail=test%40testmail.com&CustPhone=60123334567&PageTimeout=&Sign=d6bfbcc1c7b998c595c2376cf8c6720d744c7179387450554e932819b719bdaaa7aa530d10680d73d7b45a63ce0a492d1838f520b1c19a4fcb0f4d8de2313b92&MerchantCallbackURL=http%3A%2F%2FMerchantTestEnv.com%2Fcallbackresponse.aspx";
  console.log(redirectUrl);
  res.redirect(redirectUrl);
});

// Start the server
const port = 8002;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
