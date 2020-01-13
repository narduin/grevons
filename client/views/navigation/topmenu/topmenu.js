

Template.topmenu.rendered = function () {
  $('.main.menu').visibility({
    type: 'fixed'
  });
  $('.overlay').visibility({
    type: 'fixed',
    offset: 200
  });

  $('.menu .item').tab()
  $('.ui.dropdown.grevons').dropdown({});
  $('.ui.sidebar').sidebar('setting', 'transition', 'overlay')
}

Template.topmenu.events({
  'click #tag': function (event) {
    event.preventDefault()
    $('.actived').removeClass('actived')
    $('.grevons.' + this.category).addClass('actived')
    if (!this.category) {
      $('.grevons.home').addClass('actived')
      FlowRouter.go('/')
      Session.set('currentSearch', false)
    }
    else {
      FlowRouter.go('/' + this.category)
      Session.set('currentSearch', this.category)
    }
  },
  'click #display-menu': function (event) {
    $('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle')
  },
  'click #login': function (event) {
      service.login();
  },
  // 'click #logout': function (event) {
  //   event.preventDefault()
  //   MainUser.remove({})
  //   localStorage.removeItem('username')
  //   localStorage.removeItem('accesstoken')
  //   localStorage.removeItem('expireat')
  // },
})


