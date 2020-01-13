Template.dropdownprofile.rendered = function () {
    $('.ui.dropdown.profile').dropdown()
  }

  Template.dropdownprofile.events({
    'click #logout': function (event) {
      event.preventDefault()
      service.logOut();
    }
  })
  