
   function editProductViewModel() {
    var self = this;
    self.productId = ko.observable(getUrlParam('id'))
    self.productDetails = ko.observable()
    self.currentUser = ko.observable()
    self.productImage1 = ko.observable()
    self.productImage2 = ko.observable()
    self.productImage3 = ko.observable()
    self.productImage4 = ko.observable()
    self.productImage5 = ko.observable()
    self.productPrice = ko.observable()
    self.productMaterial = ko.observable()
    self.allBrands = ko.observable()
    self.allCategories = ko.observable()
    self.category = ko.observable()
    self.brand = ko.observable()
    self.isFeatured = ko.observable()
    self.productName = ko.observable()
    self.productDescription = ko.observable()
    self.productSizes = ko.observable()
    self.host = ko.observable('http://localhost:3000/')

    if(localStorage.getItem('loginToken')){
      refreshCurrentUser()
  }

  getProductDetails(getAllCategories, getAllBrands)
 

  self.getImage1FromInput = (data, e) =>{
    console.log(e.target.files[0])
    self.productImage1(e.target.files[0])
  }
  self.getImage2FromInput = (data, e) =>{
    console.log(e.target.files[0])
    self.productImage2(e.target.files[0])
}
self.getImage3FromInput = (data, e) =>{
  console.log(e.target.files[0])
  self.productImage3(e.target.files[0])
}
self.getImage4FromInput = (data, e) =>{
  console.log(e.target.files[0])
  self.productImage4(e.target.files[0])
}
self.getImage5FromInput = (data, e) =>{
  console.log(e.target.files[0])
  self.productImage5(e.target.files[0])
}



  self.editProduct = () => {
    console.log(self.category())
    var form = new FormData();
    form.append('Id', self.productId())
    form.append('name', self.productName())
    form.append('description', self.productDescription())
    form.append('price', self.productPrice())
    form.append('material', self.productMaterial())
    form.append('isFeatured', self.isFeatured() == true? 1 : 0)
    form.append('category_id', self.category().Id)
    form.append('brand_id', self.brand().Id)
    form.append('images', self.productImage1())
    form.append('images', self.productImage2())
    form.append('images', self.productImage3())
    form.append('images', self.productImage4())
    form.append('images', self.productImage5())
    $.ajax({
        url: "http://localhost:3000/api/editProduct",
        data: form,
        type: "POST",
        contentType: false, 
        processData: false, 
        success: function(msg) {
          Swal.fire({
            title: 'Product Updated!',
            text: 'Product Updated successfully',
            icon: 'success',
            confirmButtonText: 'close',
          
          }).then(result => {
            window.location.href = 'admin-view-all-products.html'
          })
        }
      });
  
  }


function refreshCurrentUser() {
  $.post("http://localhost:3000/api/refreshCurrentUser",{token: localStorage.getItem('loginToken')},
   function(data) {
      console.log(data)
      self.currentUser(data.user_id)
  })
}

function getUrlParam(param) {
    param = param.replace(/([\[\](){}*?+^$.\\|])/g, "\\$1");
    var regex = new RegExp("[?&]" + param + "=([^&#]*)");
    var url   = decodeURIComponent(window.location.href);
    var match = regex.exec(url);
    return match ? match[1] : "";
  }

  function getProductDetails(getAllCategories, getAllBrands) {
    $.post("http://localhost:3000/api/getProductDetails", {Id: self.productId}, function(data) {
        self.productDetails(data.productDetails)
        self.productName(data.productDetails.name)
        self.productMaterial(data.productDetails.material)
        self.productPrice(data.productDetails.price)
        self.productDescription(data.productDetails.description)
        self.isFeatured(data.productDetails.is_featured)
        self.productSizes(data.productSizes)
        console.log(self.productDetails())

        getAllCategories()
        getAllBrands()
    })
 }

 self.signout = () => {
  localStorage.removeItem('loginToken')
  window.location.href = 'index.html'
}

 function getAllCategories() {
    $.getJSON("http://localhost:3000/api/getAllCategories", function(data) {
      self.allCategories(data.categories)
      console.log(self.productDetails())
      index = self.allCategories().findIndex(item => item.Id === self.productDetails().category_id);
      self.category(self.allCategories()[index]) 
    })
  }
  
  function getAllBrands() {
    $.getJSON("http://localhost:3000/api/getAllBrands", function(data) {
      self.allBrands(data.brands)
    //   self.brand(self.allBrands()[3])
    index = self.allBrands().findIndex(item => item.Id === self.productDetails().brand_id);
    self.brand(self.allBrands()[index]) 
    })
  }

   }

   ko.applyBindings(new editProductViewModel());



