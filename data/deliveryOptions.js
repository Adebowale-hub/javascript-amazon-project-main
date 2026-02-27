 export const deliveryOptions = [{
    id: '1',
    deliveryDays: 7,
    priceCents: 0
  }, {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
  }, {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }];
  
  // Function to get the delivery option
  export function getDeliveryOption(deliveryOptionId) {
    let deliveryOption;
    // Loop into deliveryOptions array and for each option which correspond to an id
    deliveryOptions.forEach((option) => {
      // Each deliveryOptionId chosen by the user gonna be equal to that particular option in the deliveryOptions array
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });
    // Set the delivery option or select the default value
    return deliveryOption || deliveryOptions[1]; 
  }