Template.sidebar.rendered = function () {
  if (localStorage.username) {
    MainUser.add(localStorage.username, function (error) {
      if (!error) {
      }
    })
  }
  if(Content.find().fetch())
  {
    $('.ui.search').search({
      source : Content.find().fetch(),
      searchFields   : [
        'title'
      ],
      fields: {
        results : 'title',
        title   : 'name',
        url     : 'html_url'
      },
      fullTextSearch: false
    })
  }
  // $(document).on('input', '#sidebarsearch', function () {
  //   var search = document.getElementById('sidebarsearch').value
  //   console.log(search)
  //   console.log(search.length)
  //   if (search.length = 0 || search.length < 3) {
  //     Session.set('currentSearch', false)
  //   }
  //   else {
  //     Session.set('currentSearch', search)
  //   }
  // });
}

Template.sidebar.helpers({
  bindsearch:function(){
      $('.ui.search').search({
        source : Content.find().fetch(),
        searchFields   : [
          'title','body','category','json_metadata.tags'
        ],
        fields: {
          categories : 'results',   
          categoryName    : 'category',        // name of category (category view)
          categoryResults : 'results',     // array of results (category view)
          category    : 'category',        // name of category (category view)
          title           : 'title',       // result title
          results         : 'results', 
          actionText: 'text',        // "view more" text
          actionURL: 'surl',          // "view more" url
          url: 'surl'          // "view more" url 
        },
        // type: 'category',
        fullTextSearch: true,
        onSelect: function(result,response) {
          event.preventDefault() 
          console.log(result,response)
          FlowRouter.go('/home')
        }
      })
    }
})

Template.sidebar.events({
  'click #feed': function (event) {
    event.preventDefault()
    FlowRouter.go('/')
  },
  // 'click #login': function (event) {
  //   event.preventDefault()
  //   sessionStorage.setItem('currentroute', FlowRouter.current().path)
  //   window.location.href = sc2.getLoginURL()
  // },
  // 'click #logout': function (event) {
  //   event.preventDefault()
  //   MainUser.remove({})
  //   localStorage.removeItem('username')
  //   localStorage.removeItem('accesstoken')
  //   localStorage.removeItem('expireat')
  // },
})

