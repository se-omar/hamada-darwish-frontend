function viewAllCatsViewModel() {
    var self = this;
    self.allCategories = ko.observableArray();
    self.currentUser = ko.observable();
    self.host = ko.observable("http://localhost:3000/");

    getAllCats();

    if (localStorage.getItem("loginToken")) {
        refreshCurrentUser();
    }

    self.deleteCat = (category) => {
        console.log(category);
        Swal.fire({
            title: "Delete Confirmation!",
            text: "Are You sure You want to delete this Category?!",
            icon: "warning",
            confirmButtonText: "Delete Category",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                $.post("http://localhost:3000/api/deleteCat", { Id: category.Id }, function (data) {
                    console.log(data.message);
                    location.reload();
                });
            }
        });
    };

    function getAllCats() {
        $.getJSON("http://localhost:3000/api/getAllCategories", function (data) {
            self.allCategories(data.categories);
            console.log(self.allCategories());
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

ko.applyBindings(new viewAllCatsViewModel());
