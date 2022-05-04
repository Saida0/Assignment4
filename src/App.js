import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Debits from './components/Debits';
import Credits from './components/Credits';

import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountBalance: 0,
      debits: [],
      credits: [],
    };
  }

  async componentDidMount() {
    let debits = await axios.get('https://moj-api.herokuapp.com/debits');
    let credits = await axios.get('https://moj-api.herokuapp.com/credits');

    //get data from API response
    debits = debits.data;
    credits = credits.data;

    let debitSum = 0,
      creditSum = 0;
    debits.forEach((debit) => {
      debitSum += debit.amount;
    });
    credits.forEach((credit) => {
      creditSum += credit.amount;
    });
    let accountBalance = creditSum.toFixed(2) - debitSum.toFixed(2);
    accountBalance = accountBalance.toFixed(2)
    this.setState({ debits, credits, accountBalance });
  }

  addDebit = (e) => {
    //send to debits view via props
    //updates state based off user input
    e.preventDefault();
    let { debits } = this.state;
    let balance = this.state.accountBalance;

    const description = e.target[0].value;
    const amount = Number(e.target[1].value);
    const today = new Date();

    //formatting to match other dates
    const month = today.getMonth() + 1;
    const date =
      today.getFullYear().toString() +
      '-' +
      month.toString() +
      '-' +
      today.getDate().toString();

    const newDebit = { description, amount, date };
    balance = parseFloat(balance) - amount;// parseFloat() is used to convert balance from string to float
    debits = [...debits, newDebit];
    this.setState({ debits: debits, accountBalance: balance });
  };

  addCredit = (e) => {
    //send to crebits view via props
    //updates state based off user input
    e.preventDefault();
    let { credits } = this.state;
    let balance = this.state.accountBalance;

    const description = e.target[0].value;
    const amount = Number(e.target[1].value);
    const today = new Date();

    //formatting to match other dates
    const month = today.getMonth() + 1;
    const date =
      today.getFullYear().toString() +
      '-' +
      month.toString() +
      '-' +
      today.getDate().toString();

    const newCredit = { description, amount, date };
    balance = parseFloat(balance) + amount; // parseFloat() is used to convert balance from string to float
    credits = [...credits, newCredit];
    this.setState({ credits: credits, accountBalance: balance });
  };

  render() {
    return (
      <div className="App">
        <h1>Welcome to Bank of React!</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/debits"
            element={
              <Debits addDebit={this.addDebit} debits={this.state.debits} />
            }
          />
          <Route
            path="/credits"
            element={
              <Credits
                addCredit={this.addCredit}
                credits={this.state.credits}
              />
            }
          />
        </Routes>
        <h3>{this.state.accountBalance}</h3>
      </div>
    );
  }
}

function Home() {
  return (
    <div>
      <h2>Welcome to the homepage!</h2>
      <div>
        <Link to="/debits">Debits</Link>
      </div>
      <div>
        <Link to="/credits">Credits</Link>
      </div>
    </div>
  );
}

export default App;
