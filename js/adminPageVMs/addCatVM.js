
   function addCatViewModel() {
    var self = this;
    self.currentUser = ko.observable()
    self.catName = ko.observable()
    self.catDescription = ko.observable()

    if(localStorage.getItem('loginToken')){
      refreshCurrentUser()
  }


  self.addCat = () => {
      $.post("http://localhost:3000/api/addCat",{name: self.catName(), description: self.catDescription()},
      function(data) {
         console.log(data)
     })
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



