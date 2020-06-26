let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  UserPwd: String,
  orderList: Array,
  cartList: [
    {
      productId: String,
      productName: String,
      productImage: String,
      salePrice: Number,
      checked: Number,
      productNum: Number,
    },
  ],
  addressList: [
    {
      addressId: String,
      userName: String,
      streetName: String,
      postCode: Number,
      tel: Number,
      isDefault: Boolean,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
