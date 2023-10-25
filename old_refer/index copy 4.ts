import express, { Express, Request, Response } from "express";
import bodyParser, { json } from "body-parser";
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

  const formData = {
    MerchantPassword: "test12345",
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
  };

  // Log the form data and the calculated Sign
  console.log("Form Data:", req.body);
  console.log("Calculated Sign:", sign);

  // Define the URL of the payment gateway
  const paymentGatewayURL = "https://dev.paydibs.com/PPGSG/PymtCheckout.aspx";

  // Make an HTTP POST request to the payment gateway
  axios
    .post(paymentGatewayURL, formData)
    .then((response) => {
      // Log the response from the payment gateway
      // console.log("Payment Gateway Response:", response.data);
      console.log("Payment Gateway Response:", formData);

      // You can process the response here

      // Instead of redirecting, open the payment gateway URL in a new tab
      // Note that this action depends on the client's browser settings
      res.send(`<script>window.open('${paymentGatewayURL}${signSourceString}', '_blank')</script>`);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("An error occurred while processing the payment.");
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
