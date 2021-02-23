
   function homeViewModel() {
    var self = this;
    self.filteredProducts = ko.observableArray()
    self.allBrands = ko.observableArray()
    self.allCategories = ko.observableArray()
    self.currentCategory = ko.observable('FEATURED PRODUCTS')

    getAllFeaturedProducts()
    getAllBrands()
    getAllCategories()
    
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

    function getAllFeaturedProducts() {
        $.getJSON("http://localhost:3000/api/getAllFeaturedProducts", function(data) {
          self.filteredProducts(data.featuredProducts)
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



   }

   ko.applyBindings(new homeViewModel());



