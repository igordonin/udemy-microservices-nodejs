import * as React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const ShowOrder = ({ currentUser, order }) => {
  const [timeLeft, setTimeLeft] = React.useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  });

  React.useEffect(() => {
    const findTimeLeft = () => {
      const timerInMs = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(timerInMs / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order has expired</div>;
  }

  return (
    <div>
      <h1>Display Order</h1>
      <div>Time until expiration: {timeLeft} seconds</div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51L6DoCAwzc1pj85bsBz6SGvmw9KJ9d916pY2khyzXi472LGbUvbMM9wqpf8JQ6UyM0ZqCLvn1ZXiN49OW07ng8us00ebr5561L"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

ShowOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default ShowOrder;
