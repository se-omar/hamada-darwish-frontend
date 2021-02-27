   function viewAllProductsViewModel() {
    var self = this;
self.filteredProducts = ko.observableArray()
self.allBrands = ko.observableArray([])
self.allCategories = ko.observableArray()
self.currentCategory = ko.observable('ALL PRODUCTS')
self.currentUser = ko.observable()
self.host = ko.observable('http://localhost:3000/')

getAllProducts()
getAllBrands()
getAllCategories()

if(localStorage.getItem('loginToken')){
    refreshCurrentUser()
}

self.filterProductsByCat = async (category) => {
    self.currentCategory(category.name)
   await $.post("http://localhost:3000/api/getCategoryProducts", {Id: category.Id}, function(data) {
      self.filteredProducts(data.categoryProducts)
      console.log(self.filteredProducts())
  })
  }

  self.filterProductsByBrand = async (brand) => {
    self.currentCategory(brand.name)
    await $.post("http://localhost:3000/api/getBrandProducts", {Id: brand.Id}, function(data) {
      self.filteredProducts(data.brandProducts)
      console.log(self.filteredProducts())
  })
  }

  self.filterProductsByFeatured = async () => {
    self.currentCategory('FEATURED PRODUCTS')
    await $.getJSON("http://localhost:3000/api/getAllFeaturedProducts", function(data) {
      self.filteredProducts(data.featuredProducts)
      console.log(self.filteredProducts())
  })
  } 

  self.getAllProducts = () => {
    getAllProducts()
    console.log(self.filteredProducts())
  }

  self.deleteProduct = (product) => {
    console.log(product)
    Swal.fire({
      title: 'Delete Confirmation!',
      text: 'Are You sure You want to delete this Product?!',
      icon: 'warning',
      confirmButtonText: 'Delete Product',
      showCancelButton: true,
    
    }).then((result) => {
      if(result.isConfirmed){
        $.post("http://localhost:3000/api/deleteProduct", {Id: product.Id}, function(data) {
           console.log(data.message)
           location.reload()
  })
      }
    })
  }

  self.addToFeatured = (product) => {
    $.post("http://localhost:3000/api/addToFeatured", {Id: product.Id}, function(data) {
      console.log(data.message)
      Swal.fire({
        title: 'Added to Featured Products!',
        icon: 'success',
        confirmButtonText: 'Close',
      
      }).then((result) => {
        location.reload()
      })  
    })
  }

  self.removeFromFeatured = (product) => {
    $.post("http://localhost:3000/api/removeFromFeatured", {Id: product.Id}, function(data) {
      console.log(data.message)
      Swal.fire({
        title: 'Removed from Featured Products!',
        icon: 'success',
        confirmButtonText: 'Close',
      
      }).then((result) => {
        location.reload()
      })  
    })
  }

  
  function getAllBrands() {
    $.getJSON("http://localhost:3000/api/getAllBrands", function(data) {
      self.allBrands(data.brands)
      console.log(self.allBrands())
    })
}

function getAllCategories() {
  $.getJSON("http://localhost:3000/api/getAllCategories", function(data) {
    self.allCategories(data.categories)
    console.log(self.allCategories())
  })
}

self.signout = () => {
  localStorage.removeItem('loginToken')
  window.location.href = 'index.html'
}


  function getAllProducts() {
    $.getJSON("http://localhost:3000/api/getAllProducts", function(data) {
      self.filteredProducts(data.allProducts)
    })
}

function refreshCurrentUser() {
    $.post("http://localhost:3000/api/refreshCurrentUser",{token: localStorage.getItem('loginToken')},
     function(data) {
        console.log(data)
        self.currentUser(data.user_id)
    })
  }

}

ko.applyBindings(new viewAllProductsViewModel());