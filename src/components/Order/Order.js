import React from 'react';
import classes from './Order.module.css';

const Order = (props) => {
  console.log(props.ingredients);

  let ingredients = [];

  for (let ig in props.ingredients) {
    ingredients.push({ name: ig, quantity: props.ingredients[ig] });
  }

  const output = ingredients.map((ig) => {
    return (
      <span
        key={ig.name}
        style={{
          textTransform: 'capitalize',
          display: 'inline-block',
          margin: '0 8px',
          border: '1px solid #ccc',
          padding: '5px',
        }}
      >
        {ig.name} ({ig.quantity})
      </span>
    );
  });

  return (
    <div className={classes.Order}>
      <p>Ingredients : {output}</p>
      <p>
        Total Price : <strong>USD {props.price.toFixed(2)}</strong>
      </p>
    </div>
  );
};

export default Order;
