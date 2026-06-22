export const formatFee = (fee?: number | null) => (fee != null && !Number.isNaN(fee)) ? `Rs. ${fee.toLocaleString()}` : '--'
