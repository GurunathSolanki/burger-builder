import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { element } from 'prop-types';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      postCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Post Code',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {
              value: 'fastest',
              displayValue: 'Fastest',
            },
            {
              value: 'cheapest',
              displayValue: 'Cheapest',
            },
          ],
        },
        value: 'fastest',
        valid: true,
      },
    },
    loading: false,
    isFormValid: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    let orderData = {};
    for (let key in this.state.orderForm) {
      orderData[key] = this.state.orderForm[key].value;
    }
    console.log(orderData);

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      orderData: orderData,
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

  checkValidity(value, rules) {
    let isValid = false;
    if (rules.required) {
      isValid = value.trim() !== '';
    }

    return isValid;
  }

  inputChangedHandler = (event, elementIdentifier) => {
    const updatedForm = { ...this.state.orderForm };
    const updatedFormElement = { ...updatedForm[elementIdentifier] };
    updatedFormElement.value = event.target.value;
    updatedFormElement.touched = true;
    if (updatedFormElement.validation) {
      updatedFormElement.valid = this.checkValidity(
        event.target.value,
        updatedFormElement.validation
      );
    }

    updatedForm[elementIdentifier] = updatedFormElement;

    let isFormValid = true;
    for (let element in updatedForm) {
      isFormValid = updatedForm[element].valid && isFormValid;
    }

    this.setState({ orderForm: updatedForm, isFormValid: isFormValid });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({ ...this.state.orderForm[key], key: key });
    }

    const formElements = formElementsArray.map((element) => {
      return (
        <Input
          elementType={element.elementType}
          elementConfig={element.elementConfig}
          value={element.value}
          key={element.key}
          changed={(event) => this.inputChangedHandler(event, element.key)}
          valid={element.valid}
          shouldValidate={element.validation}
          touched={element.touched}
        />
      );
    });

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElements}
        <Button
          btnType='Success'
          disabled={!this.state.isFormValid}
          clicked={this.orderHandler}>
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
