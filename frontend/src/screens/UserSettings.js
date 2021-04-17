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

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));


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

  const handlePricing = (event) => {
    setPricing(event.target.value);
  };

  function loadData(currentUser) {
    Api.getPersonById(currentUser)
      .done((currentPerson) => {
        setChatIsPaid(currentPerson.chatIsPaid);
        setExplicit(currentPerson.hasExplicitLanguage);
        setPricing(currentPerson.pricingPlan);
        setOldPrice(currentPerson.pricingPlan);
        setProductId(currentPerson.stripeProductId);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
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
              <div style={{ display: "flex", alignItems: "baseline" }}>
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
                      max: 1000,
                      min: 0,
                    },
                  }}
                  value={pricing}
                  onChange={handlePricing}
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
