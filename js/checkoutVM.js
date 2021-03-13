
   function cartViewModel() {
    var self = this;
    self.cartProducts = ko.observableArray()
    self.shippingCost = ko.observable(20)
    self.currentUser = ko.observable()
    self.host = ko.observable('http://localhost:3000/')
    self.paymentType = ko.observable('cash')
    self.firstName = ko.observable()
    self.lastName = ko.observable()
    self.email = ko.observable()
    self.mobile = ko.observable()
    self.streetName = ko.observable()
    self.building = ko.observable()
    self.floor = ko.observable()
    self.apartment = ko.observable()
    self.region = ko.observable()
    self.orderNotes = ko.observable()
    self.floor = ko.observable()
    self.orderNotes = ko.observable()

    var amount, orderId, hash, merchantId, merchantRedirect

    if(!localStorage.getItem('cartProducts')){
        localStorage.setItem('cartProducts', JSON.stringify([]))
      }
      else{
        self.cartProducts(JSON.parse(localStorage.getItem('cartProducts')))
      }

      if(localStorage.getItem('loginToken')){
        refreshCurrentUser()
    }

    if(self.cartProducts()){
      generateKashierOrderHash(self.cartProducts())
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


    self.signout = () => {
      localStorage.removeItem('loginToken')
      window.location.href = 'index.html'
    }

    self.placeOrder = () => {
      if(!self.firstName() || !self.lastName() || !self.email()
       || !self.mobile() || !self.streetName() || !self.building() 
       || !self.apartment() || !self.floor() ||!self.region() ){
        Swal.fire({
          title: 'Error!',
          text: 'Please fill out all required fields',
          icon: 'error',
          confirmButtonText: 'Close',
        
        })
       }
       else if(!validateEmail(self.email())){
        Swal.fire({
          title: 'Error!',
          text: 'Please enter a proper email',
          icon: 'error',
          confirmButtonText: 'Close',
        })
      }

       else {
        $.post("http://localhost:3000/api/placeCashOrder",{
          firstName: self.firstName(),
          lastName: self.lastName(),
          email: self.email(),
          mobile: self.mobile(),
          streetName: self.streetName(),
          building: self.building(),
          floor: self.floor(),
          apartment: self.apartment(),
          region: self.region(),
          orderNotes: self.orderNotes(),
          cartProducts: JSON.stringify(self.cartProducts())
        },
        function(data) {
           console.log(data)
           localStorage.removeItem('cartProducts')
           self.cartProducts([])
           Swal.fire({
            title: 'Order Placed!',
            text: 'Your order was placed successfully, we will contact you in 24 hours.',
            icon: 'success',
            confirmButtonText: 'go to home',
          }).then(result => {
            window.location.href = 'index.html'
          }) 

          
       })
       }
    }


    function refreshCurrentUser() {
      $.post("http://localhost:3000/api/refreshCurrentUser",{token: localStorage.getItem('loginToken')},
       function(data) {
          console.log(data)
          self.currentUser(data.user_id)
      })
  }

  function generateKashierOrderHash(cartProducts) {
    console.log(cartProducts)
    $.post("http://localhost:3000/api/generateKashierOrderHash",{cartProducts: JSON.stringify(cartProducts)},
    function(data) {
       console.log(data)
       amount = data.amount
       orderId = data.orderId
       hash = data.hash
       merchantId = 'MID-6166-145'
       merchantRedirect = 'https://www.google.com/'

       createKashierButton(amount, hash, orderId, merchantId, merchantRedirect)

   })

  }

  function createKashierButton(amount, hash, orderId, merchantId, merchantRedirect){
    var kashierContainer = document.getElementById('kashier-container')
    var kashierButton = document.createElement('script')
    kashierButton.id = 'kashier-iFrame'
    kashierContainer.appendChild(kashierButton)
     kashierButton.setAttribute('data-amount', amount)
     kashierButton.setAttribute('src', 'https://test-iframe.kashier.io/js/kashier-checkout.js')
     kashierButton.setAttribute('data-description', 'descriptionarsars')
     kashierButton.setAttribute('data-hash', hash)
     kashierButton.setAttribute('data-currency', 'EGP')
     kashierButton.setAttribute('data-orderId', orderId)
     kashierButton.setAttribute('data-merchantId', merchantId)
     kashierButton.setAttribute('data-merchantRedirect', merchantRedirect)
     kashierButton.setAttribute('data-store', 'online store')
     kashierButton.setAttribute('data-type', 'external')
     kashierButton.setAttribute('data-display', 'en')
  }

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

   }

   ko.applyBindings(new cartViewModel());



