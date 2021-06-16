module.exports.BILL_TYPES = {
  TRUSTED: 'trusted',
  NORMAL: 'normal'
};

module.exports.toPlainBillObject = (bill) => {
  const billObject = bill.toObject({ getter: true });
  return {
    ...billObject,
    total: billObject.products.reduce(
      (accumulator, product) => accumulator + product.price * product.quantity,
      0
    )
  };
};
