function brandProductsViewModel() {
    var self = this
    self.brandId = ko.observable(getUrlParam('id'))
    self.brandDetails = ko.observable()
    self.brandProducts = ko.observableArray()
    self.allCategories = ko.observableArray()
    self.currentCategory = ko.observable()
    self.cartProducts = ko.observableArray()
    if(!localStorage.getItem('cartProducts')){
      localStorage.setItem('cartProducts', JSON.stringify([]))
    }
    else{
      self.cartProducts(JSON.parse(localStorage.getItem('cartProducts')))
    }

    getBrandDetailsAndProducts()
    getAllCategories()


    self.removeProductFromCart = (product) => {
        console.log(product)
        var cartProducts = JSON.parse(localStorage.getItem('cartProducts'))
        cartProducts.splice(cartProducts.findIndex(v => v.Id === product.Id), 1)
        localStorage.setItem('cartProducts', JSON.stringify(cartProducts))
        self.cartProducts(cartProducts)
      }

      self.addToCart = (product) => {
        var cartProducts = JSON.parse(localStorage.getItem('cartProducts'))
        if(cartProducts && containsObject(product, cartProducts)){
          Swal.fire({
            title: 'Error!',
            text: 'This Product already exists in Cart',
            icon: 'error',
            confirmButtonText: 'Continue Shopping',
          
          })
        }
        else{
          cartProducts.push(product)
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
    
    function getBrandDetailsAndProducts() {
       $.post("http://localhost:3000/api/getBrandDetailsAndProducts", {Id: self.brandId}, function(data) {
           self.brandDetails(data.brandDetails)
           self.brandProducts(data.brandProducts)
           console.log(self.brandProducts())
       })
    }

    function getAllCategories() {
        $.getJSON("http://localhost:3000/api/getAllCategories", function(data) {
          self.allCategories(data.categories)
          console.log(self.allCategories())
        })
    }

    self.filterProductsByCatAndBrand = async (category) => {
        self.currentCategory(category.name)
       await $.post("http://localhost:3000/api/getCategoryAndBrandProducts", {category_id: category.Id, brand_id: self.brandId}, function(data) {
          self.brandProducts(data.brandAndCategoryProducts)
          console.log(self.brandProducts())
      })
      }

      self.getAllBrandProducts = () => {
        getBrandDetailsAndProducts()
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
ko.applyBindings(new brandProductsViewModel());