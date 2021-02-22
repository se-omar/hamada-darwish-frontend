function productDetailsViewModel() {
    var self = this
    self.productId = ko.observable(getUrlParam('id'))
    self.productDetails = ko.observable()

    getProductDetails()

    
    function getProductDetails() {
       $.post("http://localhost:3000/api/getProductDetails", {Id: self.productId}, function(data) {
           self.productDetails(data.productDetails)
           console.log(self.productDetails())
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
ko.applyBindings(new productDetailsViewModel());