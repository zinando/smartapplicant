// Paystack payment integration for resume premium and credits purchase

async function handlePaymentResponse(response, type) {
    const isSubscription = type === 'subscription';

    toggleButtonSpinner(
        isSubscription ? 'resume-premium-btn' : 'resume-credit-btn',
        isSubscription ? 'Subscribe Now' : 'Buy Credits Now',
        true,
        isSubscription
            ? 'Payment successful. Updating subscription records...'
            : 'Payment successful. Updating credits records...'
    );

    try {
        const verifyResponse = await API.request(
            `/api/auth/premium-service/verify-order/${response.reference}/`,
            'GET'
        );

        if (!verifyResponse.ok) throw new Error('Failed to submit resume data');

        const result = await verifyResponse.json();
        if (result.status !== 1) throw new Error(result.message);

        API.setUser(result.user);
        showToast('Payment processing completed successfully', 'success');
        // delay for 4 seconds before reloading the page
        await new Promise(resolve => setTimeout(resolve, 4000));
        window.location.reload();
    } catch (error) {
        console.error(error.message);
        showToast(error.message, 'error');

        toggleButtonSpinner(
            isSubscription ? 'resume-premium-btn' : 'resume-credit-btn',
            isSubscription ? 'Subscribe Now' : 'Buy Credits Now',
            false
        );
    }
}

// meta data for the payment
const metaData = {
    custom_fields: [
        {
            display_name: '',
            mobile_number: '',
            payment_purpose: '',
            txn_ref: '',
          },
    ]
}

async function triggerPayment(order, type='subscription'){    
    metaData.custom_fields[0].display_name = order.name;
    metaData.custom_fields[0].mobile_number = order.phone;
    metaData.custom_fields[0].payment_purpose = type === 'subscription' ? 'Subscription' : 'Resume Credits Purchase';
    metaData.custom_fields[0].txn_ref = order.reference;
    
    // Initialize the payment
    const handler = PaystackPop.setup({
        key: order.paystackPublicKey,
        email: order.email,
        amount: `${order.amount * 100}`,
        ref: order.reference,
        metadata: metaData,
        callback: (response) => {
            // Handle successful payment response
            console.log('Payment successful. Reference: ', response.reference);
            handlePaymentResponse(response, type);
        },
        onClose: () => {
            // Handle payment modal close
            console.log('Payment modal closed');
        },
    });

    // Open the Paystack payment modal
    handler.openIframe();
}
