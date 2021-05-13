import React, { useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import MenuList from "./MenuList";
import First from "./First";
import GOOGLEMAP from "./GOOGLEMAP";
import D3MAP from "./D3MAPS/D3MAP";
function HOME() {
  const [address, setAdress] = useState("Westminster");
  return (
    <>
      <MenuList />
      <Router>
        <Switch>
          <Route path="/home">
            <First />
          </Route>
          <Route path="/homeprice">
            <GOOGLEMAP address={address} setAdress={setAdress} />
          </Route>
          <Route path="/Map">
            <D3MAP address={address} setAdress={setAdress} />
          </Route>
          <Route path="/">
            <First />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default HOME;
