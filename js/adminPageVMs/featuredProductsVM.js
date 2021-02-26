function featuredProductsViewModel() {
    var self = this;
    self.currentUser = ko.observable()

    if(localStorage.getItem('loginToken')){
        refreshCurrentUser()
    }

    


    
    function refreshCurrentUser() {
        $.post("http://localhost:3000/api/refreshCurrentUser",{token: localStorage.getItem('loginToken')},
         function(data) {
            console.log(data)
            self.currentUser(data.user_id)
        })
      }
}

ko.applyBindings(new featuredProductsViewModel());