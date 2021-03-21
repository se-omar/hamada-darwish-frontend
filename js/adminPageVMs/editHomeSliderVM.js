function editHomeSliderViewModel() {
    var self = this;
    self.currentUser = ko.observable();
    self.sliderData = ko.observable();
    self.text_a1 = ko.observable();
    self.text_a2 = ko.observable();
    self.text_a3 = ko.observable();
    self.text_b1 = ko.observable();
    self.text_b2 = ko.observable();
    self.text_b3 = ko.observable();
    self.text_c1 = ko.observable();
    self.text_c2 = ko.observable();
    self.text_c3 = ko.observable();
    self.image1 = ko.observable();
    self.image2 = ko.observable();
    self.image3 = ko.observable();
    self.host = ko.observable("http://localhost:3000");

    if (localStorage.getItem("loginToken")) {
        refreshCurrentUser();
    }

    getSliderData();

    self.signout = () => {
        localStorage.removeItem("loginToken");
        window.location.href = "index.html";
    };

    self.editHomeSlider = () => {
        if (
            !self.text_a1() ||
            !self.text_a2() ||
            !self.text_a3() ||
            !self.text_b1() ||
            !self.text_b2() ||
            !self.text_b3() ||
            !self.text_c1() ||
            !self.text_c2() ||
            !self.text_c3()
        ) {
            Swal.fire({
                title: "Error!",
                text: "Please fill all fields",
                icon: "error",
                confirmButtonText: "Continue Shopping",
            });
            return;
        }

        var form = new FormData();
        form.append("text_a1", self.text_a1());
        form.append("text_a2", self.text_a2());
        form.append("text_a3", self.text_a3());
        form.append("text_b1", self.text_b1());
        form.append("text_b2", self.text_b2());
        form.append("text_b3", self.text_b3());
        form.append("text_c1", self.text_c1());
        form.append("text_c2", self.text_c2());
        form.append("text_c3", self.text_c3());
        form.append("images", self.image1());
        form.append("images", self.image2());
        form.append("images", self.image3());
        $.ajax({
            url: "http://localhost:3000/api/editHomeSlider",
            data: form,
            type: "POST",
            contentType: false,
            processData: false,
            success: function (msg) {
                Swal.fire({
                    title: "Home Slider Updated!",
                    text: "Home slider was updated successfully",
                    icon: "success",
                    confirmButtonText: "go to home",
                }).then((result) => {
                    window.location.href = "index.html";
                });
            },
        });
    };

    self.getImage1FromInput = (data, e) => {
        console.log(e.target.files[0]);
        self.image1(e.target.files[0]);
    };
    self.getImage2FromInput = (data, e) => {
        console.log(e.target.files[0]);
        self.image2(e.target.files[0]);
    };
    self.getImage3FromInput = (data, e) => {
        console.log(e.target.files[0]);
        self.image3(e.target.files[0]);
    };

    function getSliderData() {
        $.getJSON("http://localhost:3000/api/getSliderData", function (data) {
            self.sliderData(data.sliderData);
            self.text_a1(data.sliderData.text_a1);
            self.text_a2(data.sliderData.text_a2);
            self.text_a3(data.sliderData.text_a3);
            self.text_b1(data.sliderData.text_b1);
            self.text_b2(data.sliderData.text_b2);
            self.text_b3(data.sliderData.text_b3);
            self.text_c1(data.sliderData.text_c1);
            self.text_c2(data.sliderData.text_c2);
            self.text_c3(data.sliderData.text_c3);
        });
    }

    function refreshCurrentUser() {
        $.post(
            self.host() + "/api/refreshCurrentUser",
            { token: localStorage.getItem("loginToken") },
            function (data) {
                console.log(data);
                self.currentUser(data.user_id);
            }
        );
    }
}

ko.applyBindings(new editHomeSliderViewModel());
