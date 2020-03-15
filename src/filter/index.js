const toRMB = (value, currency = '￥', decimals = 2) => {
  value = parseFloat(value);
  if (!isFinite(value) || (!value && value !== 0)) return '';
  const decimalStr = value.toFixed(decimals).split('.')[1];
  return currency + Math.abs(value).toLocaleString() + (decimalStr ? '.' + decimalStr : '');
};
export { toRMB };
