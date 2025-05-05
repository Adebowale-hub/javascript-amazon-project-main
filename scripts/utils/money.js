export function formatCurrency(priceCents) {
    return (priceCents / 100).toFixed(2);
}

// Default export
export default formatCurrency;