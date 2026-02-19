export function formatCurrency(priceCents) {
<<<<<<< HEAD
    return (priceCents / 100).toFixed(2);
}
=======
    return (Math.round(priceCents) / 100).toFixed(2);
}

// Default export of the format currency
export default formatCurrency; 
>>>>>>> 38a8d167b8bd99ce2655c39fe84e700eaa37898c
