function addBrandViewModel() {
    var self = this;
    self.currentUser = ko.observable();
    self.brandImage = ko.observable();
    self.brandName = ko.observable();
    self.brandDescription = ko.observable();
    self.host = ko.observable("http://localhost:3000/");

    if (localStorage.getItem("loginToken")) {
        refreshCurrentUser();
    }

    self.getImageFromInput = (data, e) => {
        console.log(e.target.files[0]);
        self.brandImage(e.target.files[0]);
    };

    self.addBrand = () => {
        var form = new FormData();
        form.append("name", self.brandName());
        form.append("description", self.brandDescription());
        form.append("brandImage", self.brandImage());
        console.log(self.brandImage());
        $.ajax({
            url: "http://localhost:3000/api/addBrand",
            data: form,
            type: "POST",
            contentType: false,
            processData: false,
            success: function (msg) {
                Swal.fire({
                    title: "Brand Added!",
                    text: "Brand added successfully",
                    icon: "success",
                    confirmButtonText: "close",
                }).then((result) => {
                    window.location.href = "admin-view-all-brands.html";
                });
            },
        });
    };

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

ko.applyBindings(new addBrandViewModel());
