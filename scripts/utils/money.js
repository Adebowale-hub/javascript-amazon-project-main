export function formatCurrency(priceCents) {
    return (Math.round(priceCents) / 100).toFixed(2);
}

// Default export of the format currency
export default formatCurrency; 