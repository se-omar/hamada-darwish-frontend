
   function addCatViewModel() {
    var self = this;
    self.currentUser = ko.observable()
    self.catName = ko.observable()
    self.catDescription = ko.observable()
    self.host = ko.observable('http://localhost:3000/')

    if(localStorage.getItem('loginToken')){
      refreshCurrentUser()
  }


  self.addCat = () => {
      $.post("http://localhost:3000/api/addCat",{name: self.catName(), description: self.catDescription()},
      function(data) {
         Swal.fire({
            title: 'Category Added!',
            text: 'Category added successfully',
            icon: 'success',
            confirmButtonText: 'close',
          
          }).then(result => {
            window.location.href = 'admin-view-all-categories.html'
          })
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

   }

   ko.applyBindings(new addCatViewModel());



