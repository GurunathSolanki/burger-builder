import React, { Component } from 'react';
import Aux from '../../hoc/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.7,
  cheese: 0.9,
  meat: 1.2,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    axios
      .get('/ingredients.json')
      .then((response) => {
        console.log(response);
        this.setState({
          ingredients: response.data,
        });
      })
      .catch((error) => this.setState({ error: true }));
  }

  updatePurchaseable(ingredients) {
    const sum = Object.keys(ingredients)
      .map((ingKey) => ingredients[ingKey])
      .reduce((sum, el) => (sum = sum + el), 0);

    this.setState({ purchaseable: sum > 0 });
  }

  addIngredientHandler = (type) => {
    let currentQty = this.state.ingredients[type];

    const currIngredients = { ...this.state.ingredients };

    currIngredients[type] = currentQty + 1;

    const priceAddition = INGREDIENT_PRICES[type];

    const newPrice = this.state.totalPrice + priceAddition;

    this.setState({ ingredients: currIngredients, totalPrice: newPrice });

    this.updatePurchaseable(currIngredients);
  };

  removeIngredientHandler = (type) => {
    let currentQty = this.state.ingredients[type];

    const currIngredients = { ...this.state.ingredients };

    let newPrice = this.state.totalPrice;

    if (currentQty > 0) {
      currIngredients[type] = currentQty - 1;
      newPrice = newPrice - INGREDIENT_PRICES[type];
    }

    this.setState({ ingredients: currIngredients, totalPrice: newPrice });

    this.updatePurchaseable(currIngredients);
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    // alert('You Continue !!');
    this.setState({ loading: true });

    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Guru',
        address: {
          street: 'Kingspark road',
          postcode: 'G44 4SX',
        },
      },
    };

    axios
      .post('/ordersss.json', order)
      .then((response) => this.setState({ loading: true, purchasing: false }))
      .catch((error) => this.setState({ loading: true, purchasing: false }));
  };

  render() {
    const disabledInfo = { ...this.state.ingredients };

    let burger = this.state.error ? (
      <p>Error in Loading ingredients !!</p>
    ) : (
      <Spinner />
    );
    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            more={this.addIngredientHandler}
            less={this.removeIngredientHandler}
            disabledInfo={disabledInfo}
            price={this.state.totalPrice}
            ordered={this.purchaseHandler}
            purchaseable={this.state.purchaseable}
          />
        </Aux>
      );
    }

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
      // console.log(disabledInfo[key]);
    }

    let orderSummary = <Spinner />;

    if (this.state.ingredients) {
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.state.totalPrice}
        />
      );
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          cancelled={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
