function cartViewModel() {
    var self = this;
    self.cartProducts = ko.observableArray();
    self.cartQuantities = ko.observableArray();
    self.currentUser = ko.observable();
    self.host = ko.observable("http://localhost:3000/");

    if (!localStorage.getItem("cartProducts")) {
        localStorage.setItem("cartProducts", JSON.stringify([]));
    } else {
        self.cartProducts(JSON.parse(localStorage.getItem("cartProducts")));
    }

    if (localStorage.getItem("loginToken")) {
        refreshCurrentUser();
    }

    self.totalPrice = ko.computed(function () {
        var total = 0;
        for (let i = 0; i < self.cartProducts().length; i++) {
            total += self.cartProducts()[i].price * self.cartProducts()[i].quantity;
        }
        return total;
    }, self);

    for (let i = 0; i < self.cartProducts().length; i++) {
        self.cartQuantities().push(self.cartProducts()[i].quantity);
        console.log(self.cartQuantities());
    }
    self.removeProductFromCart = (index, product) => {
        console.log(product);
        var cartProducts = JSON.parse(localStorage.getItem("cartProducts"));
        cartProducts.splice(
            cartProducts.findIndex((v) => v.Id === product.Id),
            1
        );
        localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
        self.cartQuantities.splice(index, 1);
        self.cartProducts(cartProducts);
    };

    self.clearCart = () => {
        console.log("cart cleared");
        self.cartProducts([]);
        localStorage.setItem("cartProducts", "[]");
        console.log(localStorage.getItem("cartProducts"));
    };

    self.incrementQuantity = (index, product) => {
        console.log(index);
        var oldQuantity = self.cartQuantities()[index];
        self.cartQuantities.splice(index, 1, oldQuantity + 1);
        product.quantity = oldQuantity + 1;
        var cartProducts = JSON.parse(localStorage.getItem("cartProducts"));
        cartProducts[index].quantity += 1;
        localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
        self.cartProducts(cartProducts);

        console.log(product);
    };

    self.decrementQuantity = (index, product) => {
        console.log(index);
        var oldQuantity = self.cartQuantities()[index];
        if (product.quantity > 1) {
            self.cartQuantities.splice(index, 1, oldQuantity - 1);
            product.quantity = oldQuantity - 1;
            console.log(product);

            var cartProducts = JSON.parse(localStorage.getItem("cartProducts"));
            cartProducts[index].quantity -= 1;
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
            self.cartProducts(cartProducts);
        }
    };

    self.signout = () => {
        localStorage.removeItem("loginToken");
        window.location.href = "index.html";
    };

    self.goToCheckout = () => {
        if (self.cartProducts().length < 1) {
            Swal.fire({
                title: "Error!",
                text: "your cart is empty, please add products",
                icon: "error",
                confirmButtonText: "Close",
            });
        } else {
            window.location.href = "checkout.html";
        }
    };

    self.goToCart = () => {
        if (self.cartProducts().length < 1) {
            Swal.fire({
                title: "Error!",
                text: "your cart is empty, please add products",
                icon: "error",
                confirmButtonText: "Close",
            });
        } else {
            window.location.href = "cart.html";
        }
    };

    console.log(self.totalPrice());

    function containsObject(obj, list) {
        if (list.some((listItem) => listItem.Id === obj.Id)) {
            return true;
        } else {
            return false;
        }
    }

    function refreshCurrentUser() {
        $.post(
            "http://localhost:3000/api/refreshCurrentUser",
            { token: localStorage.getItem("loginToken") },
            function (data) {
                console.log(data);
                self.currentUser(data.user_id);
            }
        );
    }
}

ko.applyBindings(new cartViewModel());
