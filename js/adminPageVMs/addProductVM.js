
   function addProductViewModel() {
    var self = this;
    self.currentUser = ko.observable()
    self.productImage = ko.observable()
    self.productName = ko.observable()
    self.productDescription = ko.observable()

    if(localStorage.getItem('loginToken')){
      refreshCurrentUser()
  }

  self.getImageFromInput = (data, e) =>{
      console.log(e.target.files[0])
      self.productImage(e.target.files[0])
  }

  self.addProduct = () => {
    var form = new FormData();
    form.append('name', self.productName())
    form.append('description', self.productDescription())
    form.append('productImage', self.productImage())
    console.log(self.productImage())
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

   }

   ko.applyBindings(new addProductViewModel());



