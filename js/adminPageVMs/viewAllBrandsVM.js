function viewAllBrandsViewModel() {
    var self = this;
    self.allBrands = ko.observableArray();
    self.currentUser = ko.observable();
    self.host = ko.observable("http://localhost:3000/");

    getAllBrands();

    if (localStorage.getItem("loginToken")) {
        refreshCurrentUser();
    }

    self.deleteBrand = (brand) => {
        console.log(brand);
        Swal.fire({
            title: "Delete Confirmation!",
            text: "Are You sure You want to delete this brand?!",
            icon: "warning",
            confirmButtonText: "Delete brand",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                $.post("http://localhost:3000/api/deleteBrand", { Id: brand.Id }, function (data) {
                    console.log(data.message);
                    location.reload();
                });
            }
        });
    };

    function getAllBrands() {
        $.getJSON("http://localhost:3000/api/getAllBrands", function (data) {
            self.allBrands(data.brands);
            console.log(self.allBrands());
        });
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

ko.applyBindings(new viewAllBrandsViewModel());
