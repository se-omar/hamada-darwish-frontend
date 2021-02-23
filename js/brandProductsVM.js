function brandProductsViewModel() {
    var self = this
    self.brandId = ko.observable(getUrlParam('id'))
    self.brandDetails = ko.observable()
    self.brandProducts = ko.observableArray()
    self.allCategories = ko.observableArray()
    self.currentCategory = ko.observable()

    getBrandDetailsAndProducts()
    getAllCategories()

    
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

    function getUrlParam(param) {
      param = param.replace(/([\[\](){}*?+^$.\\|])/g, "\\$1");
      var regex = new RegExp("[?&]" + param + "=([^&#]*)");
      var url   = decodeURIComponent(window.location.href);
      var match = regex.exec(url);
      return match ? match[1] : "";
    }
}
ko.applyBindings(new brandProductsViewModel());