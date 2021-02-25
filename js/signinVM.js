function signinViewModel() {

self.email = ko.observable()
self.password = ko.observable()
self.currentUser = ko.observable()
 self.cartProducts = ko.observableArray()
 
    if(!localStorage.getItem('cartProducts')){
        localStorage.setItem('cartProducts', JSON.stringify([]))
      }
      else{
        self.cartProducts(JSON.parse(localStorage.getItem('cartProducts')))
      }

    if(localStorage.getItem('loginToken')){
        refreshCurrentUser()
    }

      self.signin = () => {
        $.post("http://localhost:3000/api/signin", {email: self.email(), password: self.password()}, function(data) {
        console.log(data)
        if(data.token){
            localStorage.setItem('loginToken', data.token)
        }
        else{
            alert(data.message)
        }
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
ko.applyBindings(new signinViewModel());