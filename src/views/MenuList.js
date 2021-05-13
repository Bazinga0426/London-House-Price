import React from "react";
import { Menu, Image } from "antd";
import {
  BankFilled,
  AccountBookFilled,
  CalculatorFilled,
  AppstoreFilled,
} from "@ant-design/icons";
import { HashRouter as Router, Link } from "react-router-dom";

class MenuList extends React.Component {
  state = {
    current: "mail",
  };

  handleClick = (e) => {
    console.log("click ", e);
    this.setState({ current: e.key });
  };

  render() {
    const { current } = this.state;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60% 30%",
          alignItems: "center",
          background: "#f5f5f5",
        }}
      >
        <Router>
          <Image width={200} src="./Logo.png" preview={false} />
          <Menu
            onClick={this.handleClick}
            selectedKeys={[current]}
            mode="horizontal"
            style={{ position: "sticky", top: "0px", background: "#f5f5f5" }}
          >
            <Menu.Item key="Home" icon={<AppstoreFilled />}>
              <Link to="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="HousePrice" icon={<AccountBookFilled />}>
              <Link to="/homeprice">House Price</Link>
            </Menu.Item>
            <Menu.Item key="Map" icon={<BankFilled />}>
              <Link to="/Map">Map</Link>
            </Menu.Item>
            <Menu.Item key="Calculation" icon={<CalculatorFilled />}>
            <Link to="/Calculation">Calculation</Link>
            </Menu.Item>
          </Menu>
        </Router> 
      </div>
    );
  }
}
export default MenuList;
