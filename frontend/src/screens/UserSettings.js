import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import paymentApi from "../helpers/paymentApi";
import { useAlert } from "react-alert";
import Select from "react-select";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));



const bank = [
  { value: "DBS", label: "DBS" },
  { value: "OCBC", label: "OCBC" },
  { value: "SC", label: "SC" },
  { value: "POSB", label: "POSB" },
];

function stringToBank(bankStr) {
  for (var i = 0; i < bank.length; i++) {
    if (bank[i].value === bankStr) {
      return bank[i];
    }
  }
}

export default function UserSettings() {
  const alert = useAlert();
  const classes = useStyles();
  const [refresh, setRefresh] = useState(true);

  const currentUser = useSelector((state) => state.currentUser);

  const [explicit, setExplicit] = React.useState(false);
  const [chatIsPaid, setChatIsPaid] = React.useState(false);
  const handleExplicit = (event) => {
    setExplicit(event.target.checked);
  };


  const handleChatIsPaid = (event) => {
    setChatIsPaid(event.target.checked);
  };

  const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText("#3B21CB"),
      backgroundColor: "#3B21CB",
      "&:hover": {
        backgroundColor: "#260eab",
      },
    },
  }))(Button);

  const [pricing, setPricing] = React.useState(0);
  const [oldPrice, setOldPrice] = React.useState(0);
  const [productId, setProductId] = React.useState();
  const [bankAccount, setBankAccount] = React.useState();
  const [bankName, setBankName] = React.useState();
  const [accountNumber, setAccountNumber] = React.useState();

  const handleBankName = (event) => {
    setBankName(event.target.value);
  };

  const handlePricing = (event) => {
    setPricing(event.target.value);
  };

  const handleAccountNumber = (event) => {
    setAccountNumber(event.target.value);
  };

  function loadData(currentUser) {
    Api.getPersonById(currentUser)
      .done((currentPerson) => {
        setChatIsPaid(currentPerson.chatIsPaid);
        setExplicit(currentPerson.hasExplicitLanguage);
        setPricing(currentPerson.pricingPlan);
        setOldPrice(currentPerson.pricingPlan);
        setProductId(currentPerson.stripeProductId);
        setBankAccount(currentPerson.bankAccount);

        if (currentPerson.bankAccount) {
          setAccountNumber(currentPerson.bankAccount.accountNumber);
          setBankName(stringToBank(currentPerson.bankAccount.bankEnum))
        }
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(bankName);

    if (pricing !== 0 && accountNumber == "") {
      alert.show("Cannot remove your bank Account if you have a price!")
      setRefresh(!refresh);
      return;
    } else if (accountNumber == "") {
      Api.deleteBankAccountForPerson(currentUser);
      setAccountNumber(undefined);
      setBankName(undefined)
    }


    if (bankAccount === undefined) {
      // this case pricing plan cannot be non zero
      if (pricing !== 0) {
        alert.show("Please add a bank account first");
        return;
      } else {
        if (bankName == undefined) {
          alert.show("Please select a bank");
        }
        await Api.createBankAccount(currentUser, accountNumber, bankName.value)
        setRefresh(!refresh);
      }
    } else {
      Api.updateBankAccount(bankAccount.id, accountNumber, bankName.value);
    }


    if (productId === undefined) {
      try {
        const data = await paymentApi.createProductForUser(currentUser);
        setProductId(data.productId);
        await Api.updateStripeProductId(currentUser, data.productId);
        await Api.updateExplicitAndChat(currentUser, explicit, chatIsPaid);
        console.log(productId);
        const result = await paymentApi.createPricingPlan(currentUser, pricing, oldPrice, data.productId);
        const { stripePrice } = result;
        const { id: stripePriceId } = stripePrice;
        console.log(stripePriceId);
        await Api.updatePricingPlan(currentUser, pricing, stripePriceId)
        alert.show("Settings saved!");
        setRefresh(!refresh);
      } catch (e) {
        alert.show("An unexpected error has occured.");
      }

    } else {
      try {
        await Api.updateExplicitAndChat(currentUser, explicit, chatIsPaid);
        console.log(productId);
        const result = await paymentApi.createPricingPlan(currentUser, pricing, oldPrice, productId);
        const { stripePrice } = result;
        const { id: stripePriceId } = stripePrice;
        console.log(stripePriceId);
        await Api.updatePricingPlan(currentUser, pricing, stripePriceId)
        alert.show("Settings saved!");
        setRefresh(!refresh);
      } catch (e) {
        alert.show("An unexpected error has occured.");
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser);
    }
  }, [currentUser, refresh]);

  return (
    <div
      style={{ paddingTop: "24px", paddingLeft: "17px" }}
      className="content-wrapper"
    >
      <div class="col-md-9" style={{ textAlign: "left" }}>
        <div class="card card-primary">
          <form
            onSubmit={handleSubmit}
            className={classes.root}
            noValidate
            autoComplete="off"
          >
            <div class="card-body">
              <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                Subscription pricing
              </Box>
              <div style={{ display: "flex", alignItems: "baseline", marginBottom: "20px" }}>
                <Box fontWeight="fontWeightBold" fontSize={18} m={1}>
                  Pricing
                </Box>

                <TextField
                  id="outlined-number"
                  type="number"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    inputProps: {
                      max: 50,
                      min: 0,
                    },
                  }}
                  value={pricing}
                  onChange={handlePricing}
                />
              </div>
              <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                Bank Account
              </Box>
              <div className="form-group" style={{ marginLeft: "10px", marginRight: "480px" }}>
                <label htmlFor="inputBankName">Bank</label>
                {bankName !== undefined ? (
                  <Select
                    name="bank"
                    options={bank}
                    value={bankName}
                    onChange={setBankName}
                    classNamePrefix="select"
                  />
                ) : (
                  <Select
                    name="banks"
                    options={bank}
                    onChange={setBankName}
                    classNamePrefix="select"
                  />
                )}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", marginBottom: "20px" }}>
                <Box fontWeight="fontWeightBold" fontSize={18} m={1}>
                  Account Number
                </Box>

                <TextField
                  id="outlined-number"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={accountNumber}
                  onChange={handleAccountNumber}
                />
              </div>

              <br></br>
              <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                Content settings
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={explicit}
                    onChange={handleExplicit}
                    name="explicit"
                    color="primary"
                  />
                }
                label="Explicit Language"
                labelPlacement="start"
              />

              <Box fontWeight="fontWeightRegular" m={1}>
                Enable this setting if your stream contains language that may be
                inappropriate for younger audiences. You should not broadcast
                content that contains any sexual activity, nudity, threats or
                extreme violence. Doing so will result in immediate, irrevocable
                termination of your account.
              </Box>
              <br></br>
              <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                Chat settings
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={chatIsPaid}
                    onChange={handleChatIsPaid}
                    name="subscriberOnly"
                    color="primary"
                  />
                }
                label="Subscriber-only"
                labelPlacement="start"
              />

              <Box fontWeight="fontWeightRegular" m={1}>
                Only enable private chat for subscribers.
              </Box>
              <div style={{ textAlign: "right" }}>
                <ColorButton
                  style={{
                    height: "30px",
                    width: "100px",
                    outline: "none",
                    marginRight: "3%",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Save
                </ColorButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
