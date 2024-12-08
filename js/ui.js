document.addEventListener( "DOMContentLoaded", function() {
    //Side navigation menu
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus , { edge: "right" });
    //Form to add a contact
    const forms = document.querySelector(".side-form");
    M.Sidenav.init(forms, { edge: "left" });

});