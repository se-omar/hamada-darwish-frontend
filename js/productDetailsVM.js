function productDetailsViewModel() {
    var self = this;
    self.productId = ko.observable(getUrlParam("id"));
    self.productDetails = ko.observable();
    self.cartProducts = ko.observableArray();
    self.productSizes = ko.observableArray();
    self.selectedSize = ko.observable();
    self.currentUser = ko.observable();
    self.quantity = ko.observable(1);
    self.host = ko.observable("http://localhost:3000/");

    if (!localStorage.getItem("cartProducts")) {
        localStorage.setItem("cartProducts", JSON.stringify([]));
    } else {
        self.cartProducts(JSON.parse(localStorage.getItem("cartProducts")));
    }

    getProductDetails();

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

    self.removeProductFromCart = (product) => {
        console.log(product);
        var cartProducts = JSON.parse(localStorage.getItem("cartProducts"));
        cartProducts.splice(
            cartProducts.findIndex((v) => v.Id === product.Id),
            1
        );
        localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
        self.cartProducts(cartProducts);
    };

    self.addToCart = () => {
        var cartProducts = JSON.parse(localStorage.getItem("cartProducts"));
        self.productDetails().quantity = Number(self.quantity());
        self.productDetails().size = self.selectedSize();
        console.log(self.productDetails());
        if (!self.selectedSize()) {
            Swal.fire({
                title: "Error!",
                text: "Please choose a Size",
                icon: "error",
                confirmButtonText: "Close",
            });
            return;
        }

        if (cartProducts && containsObject(self.productDetails(), cartProducts)) {
            Swal.fire({
                title: "Error!",
                text: "This Product already exists in Cart",
                icon: "error",
                confirmButtonText: "Continue Shopping",
            });
        } else {
            cartProducts.push(self.productDetails());
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
            self.cartProducts(JSON.parse(localStorage.getItem("cartProducts")));
            Swal.fire({
                title: "Success!",
                text: "Product added to Cart Successfully",
                icon: "success",
                confirmButtonText: "Continue Shopping",
            });
            console.log(self.cartProducts());
        }
    };

    self.selectSize = (size, event) => {
        self.selectedSize(size);
        $(".sizeBox").removeClass("pd-detail__stock");
        $(".sizeBox").addClass("pd-detail__left");
        $(event.target).removeClass("pd-detail__left");
        $(event.target).addClass("pd-detail__stock");
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

    function getProductDetails() {
        $.post(
            "http://localhost:3000/api/getProductDetails",
            { Id: self.productId },
            function (data) {
                self.productDetails(data.productDetails);
                self.productSizes(data.productSizes);
                console.log(self.productDetails());
            }
        );
    }

    function containsObject(obj, list) {
        if (list.some((listItem) => listItem.Id === obj.Id && listItem.size === obj.size)) {
            return true;
        } else {
            return false;
        }
    }

    function getUrlParam(param) {
        param = param.replace(/([\[\](){}*?+^$.\\|])/g, "\\$1");
        var regex = new RegExp("[?&]" + param + "=([^&#]*)");
        var url = decodeURIComponent(window.location.href);
        var match = regex.exec(url);
        return match ? match[1] : "";
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
ko.applyBindings(new productDetailsViewModel());
