function homeViewModel() {
    var self = this;
    self.filteredProducts = ko.observableArray();
    self.allBrands = ko.observableArray([]);
    self.allCategories = ko.observableArray();
    self.currentCategory = ko.observable("FEATURED PRODUCTS");
    self.cartProducts = ko.observableArray();
    self.currentUser = ko.observable();
    self.sliderData = ko.observable();
    self.host = ko.observable("http://localhost:3000/");
    if (!localStorage.getItem("cartProducts")) {
        localStorage.setItem("cartProducts", JSON.stringify([]));
    } else {
        self.cartProducts(JSON.parse(localStorage.getItem("cartProducts")));
    }

    getSliderData();
    getAllFeaturedProducts();
    getAllBrands();
    getAllCategories();

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

    self.filterProductsByCat = async (category) => {
        self.currentCategory(category.name);
        await $.post(
            "http://localhost:3000/api/getCategoryProducts",
            { Id: category.Id },
            function (data) {
                self.filteredProducts(data.categoryProducts);
                console.log(self.filteredProducts());
            }
        );
    };

    self.filterProductsByBrand = async (brand) => {
        self.currentCategory(brand.name);
        await $.post(
            "http://localhost:3000/api/getBrandProducts",
            { Id: brand.Id },
            function (data) {
                self.filteredProducts(data.brandProducts);
                console.log(self.filteredProducts());
            }
        );
    };

    self.getFeaturedProducts = () => {
        getAllFeaturedProducts();
    };

    // self.addToCart = (product) => {
    //   var cartProducts = JSON.parse(localStorage.getItem('cartProducts'))
    //   if(cartProducts && containsObject(product, cartProducts)){
    //     Swal.fire({
    //       title: 'Error!',
    //       text: 'This Product already exists in Cart',
    //       icon: 'error',
    //       confirmButtonText: 'Continue Shopping',

    //     })
    //   }
    //   else{
    //     cartProducts.push(product)
    //     localStorage.setItem('cartProducts', JSON.stringify(cartProducts))
    //     self.cartProducts(JSON.parse(localStorage.getItem('cartProducts')))
    //     Swal.fire({
    //       title: 'Success!',
    //       text: 'Product added to Cart Successfully' ,
    //       icon: 'success',
    //       confirmButtonText: 'Continue Shopping',
    //     })
    //     console.log(self.cartProducts())
    //   }

    // }

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

    function getSliderData() {
        $.getJSON("http://localhost:3000/api/getSliderData", function (data) {
            self.sliderData(data.sliderData);
        });
    }

    function getAllFeaturedProducts() {
        $.getJSON("http://localhost:3000/api/getAllFeaturedProducts", function (data) {
            self.filteredProducts(data.featuredProducts);
        });
    }

    function getAllBrands() {
        $.getJSON("http://localhost:3000/api/getAllBrands", function (data) {
            self.allBrands(data.brands);
            var slider = tns({
                container: ".my-slider",
                items: self.allBrands().length - 1,
                slideBy: 1,
                mouseDrag: true,
                nav: false,
                loop: true,
                touch: true,
                autoplay: false,
                swipeAngle: 60,
                controls: false,
            });
            console.log(self.allBrands());
        });
    }

    function getAllCategories() {
        $.getJSON("http://localhost:3000/api/getAllCategories", function (data) {
            self.allCategories(data.categories);
            console.log(self.allCategories());
        });
    }

    function containsObject(obj, list) {
        if (list.some((listItem) => listItem.Id === obj.Id)) {
            return true;
        } else {
            return false;
        }
    }

    self.signout = () => {
        localStorage.removeItem("loginToken");
        window.location.href = "index.html";
    };

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

ko.applyBindings(new homeViewModel());
