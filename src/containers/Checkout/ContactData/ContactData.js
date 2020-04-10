import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postCode: '',
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      customer: {
        name: this.state.name,
        address: {
          street: this.state.address.street,
          postcode: this.state.address.postCode,
        },
      },
    };

    axios
      .post('/orders.json', order)
      .then((response) => {
        console.log(response);
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch((error) => this.setState({ loading: true }));
  };

  render() {
    let form = (
      <form>
        <input
          type='text'
          name='name'
          placeholder='Your Name'
          onChange={(event) => {
            this.setState({ name: event.target.value });
          }}
        />
        <input
          type='email'
          name='email'
          placeholder='Your Email'
          onChange={(event) => {
            this.setState({ email: event.target.value });
          }}
        />
        <input
          type='text'
          name='street'
          placeholder='street'
          onChange={(event) => {
            this.setState({
              address: { ...this.state.address, street: event.target.value },
            });
          }}
        />
        <input
          type='text'
          name='postCode'
          placeholder='Post Code'
          onChange={(event) => {
            this.setState({
              address: {
                ...this.state.address,
                postCode: event.target.value,
              },
            });
          }}
        />
        <Button btnType='Success' clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    );
  }
}

export default withRouter(ContactData);
