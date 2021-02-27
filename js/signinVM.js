function signinViewModel() {

self.email = ko.observable()
self.password = ko.observable()
self.currentUser = ko.observable()
 self.cartProducts = ko.observableArray()
 self.host = ko.observable('http://localhost:3000/')
 
    if(!localStorage.getItem('cartProducts')){
        localStorage.setItem('cartProducts', JSON.stringify([]))
      }
      else{
        self.cartProducts(JSON.parse(localStorage.getItem('cartProducts')))
      }

    if(localStorage.getItem('loginToken')){
        refreshCurrentUser()
    }

    self.totalPrice = ko.computed(function() {
      var total = 0
      for(let i =0; i<self.cartProducts().length; i++){
          
          total += self.cartProducts()[i].price * self.cartProducts()[i].quantity
      }
      return total
  }, self);

      self.signin = () => {
        $.post("http://localhost:3000/api/signin", {email: self.email(), password: self.password()}, function(data) {
        console.log(data)
        if(data.token){
            localStorage.setItem('loginToken', data.token)
            window.location.href = 'index.html'
        }
        else{
          Swal.fire({
            title: 'Error!',
            text: data.message,
            icon: 'error',
            confirmButtonText: 'close',
          
          })
        }
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
ko.applyBindings(new signinViewModel());