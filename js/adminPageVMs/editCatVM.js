
   function editCatViewModel() {
    var self = this;
    self.catId = ko.observable(getUrlParam('id'))
    self.currentUser = ko.observable()
    self.catImage = ko.observable()
    self.catName = ko.observable()
    self.catDescription = ko.observable()
    self.host = ko.observable('http://localhost:3000/')
    
    if(localStorage.getItem('loginToken')){
      refreshCurrentUser()
  }

  getCatDetails()

  self.getImageFromInput = (data, e) =>{
      console.log(e.target.files[0])
      self.catImage(e.target.files[0])
  }

  self.editCat = () => {
    var form = new FormData();
    form.append('Id', self.catId())
    form.append('name', self.catName())
    form.append('description', self.catDescription())
    form.append('catImage', self.catImage())
    console.log(self.catImage())
    $.ajax({
        url: "http://localhost:3000/api/editCat",
        data: form,
        type: "POST",
        contentType: false, 
        processData: false, 
        success: function(msg) {
          Swal.fire({
            title: 'Category Updated!',
            text: 'category Updated successfully',
            icon: 'success',
            confirmButtonText: 'close',
          
          }).then(result => {
            window.location.href = 'admin-view-all-categories.html'
          })
        }
      });
  
  }

  self.signout = () => {
    localStorage.removeItem('loginToken')
    window.location.href = 'index.html'
  }

  function getCatDetails() {
    $.post("http://localhost:3000/api/getCatDetails",{Id: self.catId()},
     function(data) {
        console.log(data)
        self.catName(data.cat.name)
        self.catDescription(data.cat.description)
    })
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

   ko.applyBindings(new editCatViewModel());



