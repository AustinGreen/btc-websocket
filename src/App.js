import React, { Component } from "react";
import axios from "axios";
import numbro from "numbro";
import { Spring } from "react-spring";
import "./App.css";

const formatNumber = (num, format) =>
  num || num === 0 ? numbro(num).format(format) : "—";

class App extends Component {
  state = { price: 0, direction: "up" };

  componentDidMount() {
    axios
      .get("https://data.messari.io/api/v1/assets/btc/metrics")
      .then(response => {
        this.setState({ price: response.data.data.market_data.price_usd });
        const btcUsdTrades = new WebSocket(
          "wss://data.messari.io/api/v1/trades/kraken/btc-usd"
        );
        btcUsdTrades.addEventListener("message", this.setPrice);
      });
  }

  setPrice = msg => {
    if (msg && msg.data) {
      const price = JSON.parse(msg.data).price;
      const direction = this.state.price > price ? "down" : "up";
      this.setState({ price, direction });
    }
  };

  render() {
    const { price, direction } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>
            BTC Price:{" "}
            <Spring
              from={{ color: "white" }}
              to={{ color: direction === "up" ? "green" : "red" }}
            >
              {props => (
                <div style={{ color: props.color }}>
                  {`${direction === "up" ? "▲" : "▼"} ${formatNumber(
                    price,
                    "$0,0.00"
                  )}`}
                </div>
              )}
            </Spring>{" "}
          </h1>
        </header>
      </div>
    );
  }
}

export default App;
