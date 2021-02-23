function productDetailsViewModel() {
    var self = this
    self.productId = ko.observable(getUrlParam('id'))
    self.productDetails = ko.observable()
    self.cartProducts = ko.observableArray()
    if(!localStorage.getItem('cartProducts')){
      localStorage.setItem('cartProducts', JSON.stringify([]))
    }
    else{
      self.cartProducts(JSON.parse(localStorage.getItem('cartProducts')))
    }

    getProductDetails()


    self.removeProductFromCart = (product) => {
      console.log(product)
      var cartProducts = JSON.parse(localStorage.getItem('cartProducts'))
      cartProducts.splice(cartProducts.findIndex(v => v.Id === product.Id), 1)
      localStorage.setItem('cartProducts', JSON.stringify(cartProducts))
      self.cartProducts(cartProducts)
    }

    self.addToCart = () => {
      var cartProducts = JSON.parse(localStorage.getItem('cartProducts'))
      if(cartProducts && containsObject(self.productDetails(), cartProducts)){
        Swal.fire({
          title: 'Error!',
          text: 'This Product already exists in Cart',
          icon: 'error',
          confirmButtonText: 'Continue Shopping',
        
        })
      }
      else{
        cartProducts.push(self.productDetails())
        localStorage.setItem('cartProducts', JSON.stringify(cartProducts)) 
        self.cartProducts(JSON.parse(localStorage.getItem('cartProducts')))
        Swal.fire({
          title: 'Success!',
          text: 'Product added to Cart Successfully' ,
          icon: 'success',
          confirmButtonText: 'Continue Shopping',
        })
        console.log(self.cartProducts())
      }
     
    }
    
    function getProductDetails() {
       $.post("http://localhost:3000/api/getProductDetails", {Id: self.productId}, function(data) {
           self.productDetails(data.productDetails)
           console.log(self.productDetails())
       })
    }

    function containsObject(obj, list) {
      if(list.some(listItem => listItem.Id === obj.Id)){
        return true
    } else{
        return false
    }
  }

    function getUrlParam(param) {
      param = param.replace(/([\[\](){}*?+^$.\\|])/g, "\\$1");
      var regex = new RegExp("[?&]" + param + "=([^&#]*)");
      var url   = decodeURIComponent(window.location.href);
      var match = regex.exec(url);
      return match ? match[1] : "";
    }
}
ko.applyBindings(new productDetailsViewModel());