import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
  state = {
    orders: [],
    loading: true,
  };
  componentDidMount() {
    axios
      .get('/orders.json')
      .then((res) => {
        let fetchedOrders = [];

        for (let key in res.data) {
          fetchedOrders.push({
            ...res.data[key],
            id: key,
          });
        }
        this.setState({ loading: false, orders: fetchedOrders });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }
  render() {
    let orders = <Spinner />;
    if (!this.state.loading) {
      console.log(this.state.orders);

      orders = this.state.orders.map((order) => {
        return (
          <Order
            price={+order.price}
            key={order.id}
            ingredients={order.ingredients}
          />
        );
      });

      //   orders = (
      //     <div>
      //       <Order />
      //       <Order />
      //     </div>
      //   );
    }
    return <div>{orders}</div>;
  }
}

export default withErrorHandler(Orders, axios);
