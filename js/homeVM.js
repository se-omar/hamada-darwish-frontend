
   function homeViewModel() {
    var self = this;
    self.allProducts = ko.observableArray()
    self.allBrands = ko.observableArray()
    self.allCategories = ko.observableArray()
    self.testAr = ko.observableArray([1,2])

    getAllProducts()
    getAllBrands()
    getAllCategories()
    

    function getAllProducts() {
        $.getJSON("http://localhost:3000/api/getAllProducts", function(data) {
          self.allProducts(data.products)
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



