import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';

const Payment = () => {
  const { id } = useParams(); // Course ID from URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Step 1: Fetch course details to get the fee
      const courseResponse = await axios.get(`/courses/${id}`);
      const { title, fee } = courseResponse.data;

      // Step 2: Create a payment order
      const orderResponse = await axios.post('/payments/create-order', {
        amount: fee, // Amount in INR
        currency: 'INR',
      });

      const { id: orderId, amount, currency } = orderResponse.data;

      console.log('Order ID:', orderId);
      console.log('Amount:', amount);
      console.log('Currency:', currency);

      // Step 3: Initialize Razorpay payment
      const options = {
        key: 'rzp_test_5UQuMOW8RZFwQD', // Add Razorpay Key ID in .env file rzp_test_AQjlQQp7RxrHDu
        amount,
        currency,
        name: 'Your Platform Name',
        description: `Payment for ${title}`,
        order_id: orderId,
        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          try {
            // Step 4: Verify payment
            await axios.post('/payments/verify-payment', {
              order_id: "helloo",
              payment_id: "helloo",
              signature: "helloo",
              courseId: id, // Passing the course ID for enrollment
            });

            alert('Payment successful! You are now enrolled in the course.');
          } catch (error) {
            setError('Payment verification failed. Please try again.');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: 'User Name', // Replace with authenticated user's name
          email: 'user@example.com', // Replace with authenticated user's email
          contact: '+917012606849', // Replace with authenticated user's contact
        },
        notes: {
          courseId: id, // Additional information for reference
        },
        theme: {
          color: '#3399cc', // Change to your preferred theme color
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
      console.error('Error in payment process:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Payment for Course</h1>
      <p>Course ID: {id}</p>
      <button className="btn btn-primary" onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
};

export default Payment;
