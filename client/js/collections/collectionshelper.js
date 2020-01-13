Template.registerHelper('grevonsContent', function () {
    if(Content.find().fetch())
    {
        if (Session.get('currentSearch')) {
            if (Session.get('unfiltered')) {
                return Content.find(
                    {
                        "json_metadata.tags": new RegExp('.*' + Session.get('currentSearch'), 'i'), language: Session.get('lang')
                    },
                    { sort: { upvoted: -1, created: -1 }, limit: Session.get('visiblecontent') }).fetch()
            }
            else {
                return Content.find(
                    { type: 'grevons', search: new RegExp('.*' + Session.get('currentSearch'), 'i'), language: Session.get('lang') },
                    { sort: { upvoted: -1, created: -1 }, limit: Session.get('visiblecontent') }).fetch()
            }
        }
        else {
            if (Session.get('unfiltered')) {
                return Content.find({ language: Session.get('lang') },
                    { sort: { upvoted: -1, created: -1 }, limit: Session.get('visiblecontent') }).fetch()
            }
            else {
                return Content.find({ type: 'grevons', language: Session.get('lang') },
                    { sort: { upvoted: -1, created: -1 }, limit: Session.get('visiblecontent') }).fetch()
            }
        }
    }

})

Template.registerHelper('whitelistedContent', function () {
    if (Content.find().fetch()) {
        var whitelist = Session.get('settings').whitelist
        var contents = [];
        for (i = 0; i < whitelist.length; i++) {
            if (Content.findOne({ type: 'grevons', author: whitelist[i] }, { sort: { created: -1 } })) {
                contents.push(Content.findOne({ author: whitelist[i] }))
            }

        }
        contents.sort(function(a,b){
            var da = new Date(a.created).getTime();
            var db = new Date(b.created).getTime();
            
            return da > db ? -1 : da < db ? 1 : 0
          });
        return contents
    }
})

Template.registerHelper('currentSuggestions', function () {
    if (Session.get('lang') && Content.find(
        {
            type: 'grevons', author: Session.get('user')
        },
        { sort: { upvoted: -1, created: -1 }, limit: Session.get('visiblecontent') }).fetch() >= 1
    ) {
        return Content.find(
            {
                type: 'grevons', author: Session.get('user')
            },
            { sort: { upvoted: -1, created: -1 }, limit: Session.get('visiblecontent') }).fetch()
    }

    else {
        return Content.find({ type: 'grevons', author: Session.get('user') },
            { sort: { upvoted: -1, created: -1 }, limit: 6 }
        ).fetch()
    }
})

Template.registerHelper('currentArticle', function () {
    if (Content.findOne({ 'permlink': Session.get('article') })) {
        return Content.findOne({ 'permlink': Session.get('article') })
    }
})

Template.registerHelper('currentAuthor', function () {
    if (User.findOne({ name: Session.get('user') })) {
        return User.findOne({ name: Session.get('user') })
    }
})

Template.registerHelper('currentArticleComments', function () {
    if (Comments.find({ 'parent_permlink': Session.get('article') }).fetch()) {
        return Comments.find({ 'parent_permlink': Session.get('article') }).fetch()
    }
})

Template.registerHelper('currentCommentsSubcomments', function (comment) {
    if (Comments.find({ 'parent_permlink': comment.permlink }).fetch()) {
        return Comments.find({ 'parent_permlink': comment.permlink }).fetch()
    }
})

Template.registerHelper('currentAuthorFollowers', function (comment) {
    if (Comments.find({ 'parent_permlink': comment.permlink }).fetch()) {
        return Comments.find({ 'parent_permlink': comment.permlink }).fetch()
    }
})

Template.registerHelper('currentAuthorHistory', function (limit) {
    if (PersonalHistory.find().fetch()) {
        if (limit)
            return PersonalHistory.find({}, { limit: limit }).fetch().reverse()
        else
            return PersonalHistory.find().fetch().reverse()
    }
})

Template.registerHelper('currentAuthorBlog', function (comment) {
    if (!Content.findOne({ type: 'blog', from: Session.get('user') })) {
        Blog.getContentByBlog(Session.get('user'), 20, 'blog', function (error) {
            if (error) {
                console.log(error)
            }
        })
    }
    else
        return Content.find({ type: 'blog', from: Session.get('user') }, { sort: { created: -1 } }).fetch()
})