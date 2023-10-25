import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// POST route to handle form submission
// pay request from the frontend form
app.post("/pay", (req, res) => {
  // Extract form data
  const {
    MerchantPassword = "test12345", // password needed for hash sha512
    TxnType,
    MerchantID,
    MerchantPymtID,
    MerchantOrdDesc,
    MerchantOrdID,
    MerchantRURL,
    MerchantTxnAmt,
    MerchantCurrCode,
    CustIP,
    CustName,
    CustEmail,
    CustPhone,
    MerchantCallbackURL,
    PageTimeout,
  } = req.body;

  const signSourceString = `${MerchantPassword}${TxnType}${MerchantID}${MerchantPymtID}${MerchantOrdID}${MerchantRURL}${MerchantTxnAmt}${MerchantCurrCode}${CustIP}${MerchantCallbackURL}${
    PageTimeout || ""
  }`;
  // console.log(req.body);

  // Hash the form data with SHA-512
  const hashedData = crypto.createHash("sha512").update(signSourceString).digest("hex");
  // console.log(signSourceString);
  // console.log(hashedData);

  // Redirect the user to the payment page
  const redirectUrl = `https://dev.paydibs.com/PPGSG/PymtCheckout.aspx?TxnType=${TxnType}&MerchantID=${MerchantID}&MerchantPymtID=${MerchantPymtID}&MerchantOrdID=${MerchantOrdID}&MerchantOrdDesc=${MerchantOrdDesc}&MerchantTxnAmt=${MerchantTxnAmt}&MerchantCurrCode=${MerchantCurrCode}&MerchantRURL=${MerchantRURL}&CustIP=${CustIP}&CustName=${CustName}&CustEmail=${CustEmail}&CustPhone=${CustPhone}&PageTimeout=${PageTimeout}&Sign=${hashedData}&MerchantCallbackURL=${MerchantCallbackURL}`;

  // console.log(redirectUrl);
  res.redirect(redirectUrl);
});

// Start the server
const port = 8002;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
