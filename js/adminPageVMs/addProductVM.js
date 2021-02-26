
   function addProductViewModel() {
    var self = this;
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

    if(localStorage.getItem('loginToken')){
      refreshCurrentUser()
  }

  getAllCategories()
  getAllBrands()


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



  self.addProduct = () => {
    console.log(self.category())
    var form = new FormData();
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
        url: "http://localhost:3000/api/addProduct",
        data: form,
        type: "POST",
        contentType: false, 
        processData: false, 
        success: function(msg) {
          console.log(msg)
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

function getAllCategories() {
  $.getJSON("http://localhost:3000/api/getAllCategories", function(data) {
    self.allCategories(data.categories)
    console.log(self.allCategories())
  })
}

function getAllBrands() {
  $.getJSON("http://localhost:3000/api/getAllBrands", function(data) {
    self.allBrands(data.brands)
  })
}

   }

   ko.applyBindings(new addProductViewModel());



