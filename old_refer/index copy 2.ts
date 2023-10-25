import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import axios from "axios";

const port = 8001;
const app = express();

// Middleware to parse the form data
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Handle form submission
app.post("/submit", (req, res) => {
  const {
    MerchantPassword = "test12345",
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
    PageTimeout, // Make sure PageTimeout is included in your form
  } = req.body;

  // Construct the Sign source string
  const signSourceString = `${MerchantPassword}${TxnType}${MerchantID}${MerchantPymtID}${MerchantOrdID}${MerchantRURL}${MerchantTxnAmt}${MerchantCurrCode}${CustIP}${MerchantCallbackURL}${
    PageTimeout || ""
  }`;

  // Calculate the SHA-512 hash
  const sign = crypto.createHash("sha512").update(signSourceString).digest("hex");

  const formData = axios.toFormData({
    TxnType: TxnType,
    MerchantID: MerchantID,
    MerchantPymtID: MerchantPymtID,
    MerchantOrdID: MerchantOrdID,
    MerchantOrdDesc: MerchantOrdDesc,
    MerchantRURL: MerchantRURL,
    MerchantTxnAmt: MerchantTxnAmt,
    MerchantCurrCode: MerchantCurrCode,
    CustIP: CustIP,
    CustName: CustName,
    CustEmail: CustEmail,
    CustPhone: CustPhone,
    PageTimeout: PageTimeout,
    MerchantCallbackURL: MerchantCallbackURL,
    Sign: sign,
  });
  // {
  // TxnType,
  // MerchantID,
  // MerchantPymtID,
  // MerchantOrdID,
  // MerchantOrdDesc,
  // MerchantRURL,
  // MerchantTxnAmt,
  // MerchantCurrCode,
  // CustIP,
  // CustName,
  // CustEmail,
  // CustPhone,
  // PageTimeout,
  // MerchantCallbackURL,
  // Sign: sign,
  // };

  // Log the form data and the calculated Sign
  console.log("Form Data:", req.body);
  console.log("Calculated Sign:", sign);

  // Define the URL of the payment gateway
  const paymentGatewayURL = "https://dev.paydibs.com/PPGSG/PymtCheckout.aspx";

  axios
    .post(paymentGatewayURL, {
      formData,
    })
    .then(function (response) {
      // console.log(response);
      res.redirect(paymentGatewayURL);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
