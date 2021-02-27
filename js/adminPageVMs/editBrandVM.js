
   function editBrandViewModel() {
    var self = this;
    self.brandId = ko.observable(getUrlParam('id'))
    self.currentUser = ko.observable()
    self.brandImage = ko.observable()
    self.brandName = ko.observable()
    self.brandDescription = ko.observable()
    self.host = ko.observable('http://localhost:3000/')

    if(localStorage.getItem('loginToken')){
      refreshCurrentUser()
  }

  getBrandDetails()

  self.getImageFromInput = (data, e) =>{
      console.log(e.target.files[0])
      self.brandImage(e.target.files[0])
  }

  self.editBrand = () => {
    var form = new FormData();
    form.append('Id', self.brandId())
    form.append('name', self.brandName())
    form.append('description', self.brandDescription())
    form.append('brandImage', self.brandImage())
    console.log(self.brandImage())
    $.ajax({
        url: "http://localhost:3000/api/editBrand",
        data: form,
        type: "POST",
        contentType: false, 
        processData: false, 
        success: function(msg) {
          Swal.fire({
            title: 'Brand Updated!',
            text: 'Brand Updated successfully',
            icon: 'success',
            confirmButtonText: 'close',
          
          }).then(result => {
            window.location.href = 'admin-view-all-brands.html'
          })
        }
      });
  
  }

  function getBrandDetails() {
    $.post("http://localhost:3000/api/getBrandDetails",{Id: self.brandId()},
     function(data) {
        console.log(data)
        self.brandName(data.brand.name)
        self.brandDescription(data.brand.description)
    })
  }

  self.signout = () => {
    localStorage.removeItem('loginToken')
    window.location.href = 'index.html'
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

   }

   ko.applyBindings(new editBrandViewModel());



