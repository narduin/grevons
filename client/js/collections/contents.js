Content = new Mongo.Collection(null)

Promoted = new Mongo.Collection(null)
//contentObserver = new PersistentMinimongo2(Content, 'content');

Content.getCreatedContent = function (tag, limit, type, cb) {
    var query = {
        tag: tag,
        limit: limit
    };
    steem.api.getDiscussionsByCreated(query, function (error, result) {
        if (!result)
            return cb(error)
        else {
            for (var i = 0; i < result.length; i++) {
                try {
                    result[i].json_metadata = JSON.parse(result[i].json_metadata)
                } catch (error) {
                    console.log(error)
                    cb(error)
                }
                if(!Session.get('settings').blacklist.includes(result[i].author))
                {
                    result[i].type = type
                    for (var t = 0; t < result[i].json_metadata.tags.length; t++) {
                        if (!result[i].language)
                            result[i].language = FilterLanguage(result[i].json_metadata.tags[t])
                        else {
                            t = result[i].json_metadata.tags.length
                        }
                    }
                    if (!result[i].language)
                        result[i].language = 'en'
                    result[i]._id = result[i].id
                    result[i].search = result[i].json_metadata.tags.join(' ')
                    result[i].surl = Content.CreateUrl(result[i].author, result[i].permlink)
                    Content.upsert({ _id: result[i]._id }, result[i])
                }
                else
                console.log(author + ' is blacklisted')
            }
        }
    })
}

Content.getContentByAuthor = function (author, lastPermlink, cb) {
    var now = new Date();
    console.log(dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss"));

    steem.api.getDiscussionsByAuthorBeforeDate(author, lastPermlink, dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss"), 5, function (err, result) {
        console.log(err, result);
    });
}





Content.getContent = function (author, permlink, cb) {
    if(!Session.get('settings').blacklist.includes(author))
    {
        steem.api.getContent(author, permlink, function (error, result) {
            if (!result)
                return cb(true)
            else {
                if (result.json_metadata) {
                    try {
                        result.json_metadata = JSON.parse(result.json_metadata)
                    } catch (error) {
                        console.log(error)
                        cb(error)
                    }
                    if(Content.findOne({permlink:result.permlink}))
                    result.type = Content.findOne({permlink:result.permlink})[0].type
                    else
                    result.type = "promoted"
                    result._id = result.id
                    result.surl = Content.CreateUrl(result.author, result.permlink)
                    Promoted.upsert({ _id: result._id }, result)
                }
            }
            cb(null)
        });
    }
    else
    console.log(author + ' is blacklisted')
}

Content.reloadContent = function (author, permlink, cb) {
    steem.api.getContent(author, permlink, function (error, result) {
        if (!result)
            return cb(true)
        else {
            if (result.json_metadata) {
                try {
                    result.json_metadata = JSON.parse(result.json_metadata)
                } catch (error) {
                    console.log(error)
                    cb(error)
                }
                if(Content.findOne({permlink:result.permlink}))
                {
                    var old = Content.findOne({permlink:result.permlink})
                    result.type = old.type
                }
                else
                {
                    result.type = "promoted"
                }
                for (var t = 0; t < result.json_metadata.tags.length; t++) {
                    if (!result.language)
                        result.language = FilterLanguage(result.json_metadata.tags[t])
                    else {
                        t = result.json_metadata.tags.length
                    }
                }
                if (!result.language)
                    result.language = 'en'
                result._id = result.id
                result.search = result.json_metadata.tags.join(' ')
                result.surl = Content.CreateUrl(result.author, result.permlink)
                Content.upsert({ _id: result._id }, result)
            }
        }
        cb(null)
    });
}

Content.chainLoad = function () {
    if (Session.get('customtags')) {
        var tags = Session.get('customtags')
        for (i = 0; i < tags.length; i++) {
            if (tags[i].category != "home") {
                Content.getCreatedContent(tags[i].category, 15, 'featured', function (error) {
                    if (error) {
                        console.log(error)
                    }
                })
                if (tags[i].subcategories) {
                    for (s = 0; s < tags[i].subcategories.length; s++) {
                        Content.getCreatedContent(tags[i].subcategories[s], 15, 'featured', function (error) {
                            if (error) {
                                console.log(error)
                            }
                        })
                    }
                }
            }
        }
    }
}


Content.CreateUrl = function (author, permlink) {
    var url = ""
    url = "#!/@" + author + "/" + permlink
    return url
}
