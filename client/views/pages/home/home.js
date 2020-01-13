Template.home.helpers({

})

Template.home.rendered = function () {
  $('.menu .item').tab()
  $('#francemap').css("width", window.innerWidth);
  $('#francemap').css("height", window.innerHeight-200);
  $('#francemap').vectorMap({
    map: 'france_fr',
  hoverOpacity: 0.5,
  hoverColor: "#EC0000",
  backgroundColor: "#ffffff",
  color: "#FACC2E",
  borderColor: "#000000",
  selectedColor: "#EC0000",
  enableZoom: false,
  showTooltip: true,
    onRegionClick: function(element, code, region)
    {
      FlowRouter.go('/zone/'+region.toLowerCase())
    }
});
}

Template.home.events({
  'click .menu .item': function (event) {
    event.preventDefault()
  },
})

