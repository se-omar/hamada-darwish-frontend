
   function cartViewModel() {
    var self = this;
    self.cartProducts = ko.observableArray()
    self.shippingCost = ko.observable(20)
    self.currentUser = ko.observable()
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

    function refreshCurrentUser() {
      $.post("http://localhost:3000/api/refreshCurrentUser",{token: localStorage.getItem('loginToken')},
       function(data) {
          console.log(data)
          self.currentUser(data.user_id)
      })
  }

   }

   ko.applyBindings(new cartViewModel());



