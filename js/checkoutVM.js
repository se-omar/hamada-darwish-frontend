
   function cartViewModel() {
    var self = this;
    self.cartProducts = ko.observableArray()
    self.shippingCost = ko.observable(20)
    self.currentUser = ko.observable()
    self.host = ko.observable('http://localhost:3000/')
    
    if(!localStorage.getItem('cartProducts')){
        localStorage.setItem('cartProducts', JSON.stringify([]))
      }
      else{
        self.cartProducts(JSON.parse(localStorage.getItem('cartProducts')))
      }

      if(localStorage.getItem('loginToken')){
        refreshCurrentUser()
    }

      self.totalPrice = ko.computed(function() {
        var total = 0
        for(let i =0; i<self.cartProducts().length; i++){
            
            total += self.cartProducts()[i].price * self.cartProducts()[i].quantity
        }
        return total
    }, self);

    self.grandTotal = ko.computed(function() {
        return self.totalPrice() + self.shippingCost()
    }, self);


    self.checkout = () => {
      const configuration = {
        locale : "en",  //default en
        mode: DISPLAY_MODE.POPUP,  //required, allowed values [POPUP, INSIDE_PAGE, SIDE_PAGE]
    };
FawryPay.checkout(buildChargeRequest(), configuration);
    }

    function buildChargeRequest() {
      const chargeRequest = {
                      merchantCode: '4ba1a545911c462c926aa3845b914428',
                      merchantRefNum: '2312465464',
                      customerMobile: '01154378588',
                      customerEmail: 'miroayman639@gmail.com',
                      customerName: 'Customer Name',
                      customerProfileId: '1212',
                      paymentExpiry: '1631138400000',
                      chargeItems: [
                              {
                                  itemId: '6b5fdea340e31b3b0339d4d4ae5',
                                  description: 'Product Description',
                                  price: 50.00,
                                  quantity: 2,
                                  imageUrl: 'https://your-site-link.com/photos/45566.jpg',
                              },
                              {
                                  itemId: '97092dd9e9c07888c7eef36',
                                  description: 'Product Description',
                                  price: 75.25,
                                  quantity: 3,
                                  imageUrl: 'https://your-site-link.com/photos/639855.jpg',
                              },
                      ],
                      selectedShippingAddress: {
                        governorate: 'GIZA', //Governorate code at Fawry
                        city: 'MOHANDESSIN', //City code at Fawry
                        area: 'GAMETDEWAL', //Area code at Fawry
                        address: '9th 90 Street, apartment number 8, 4th floor',
                        receiverName: 'Receiver Name'
                      },
                      returnUrl: 'index.html',
                      authCaptureModePayment: false,
                      signature: "2ca4c078ab0d4c50ba90e31b3b0339d4d4ae5b32f97092dd9e9c07888c7eef36"
                  };
return chargeRequest;
}


    self.signout = () => {
      localStorage.removeItem('loginToken')
      window.location.href = 'index.html'
    }

    function refreshCurrentUser() {
      $.post("http://localhost:3000/api/refreshCurrentUser",{token: localStorage.getItem('loginToken')},
       function(data) {
          console.log(data)
          self.currentUser(data.user_id)
      })
  }

   }

   ko.applyBindings(new cartViewModel());



