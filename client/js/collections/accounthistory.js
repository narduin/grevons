AccountHistory = new Mongo.Collection(null)

AccountHistory.getAccountHistory = function (username, start, end, cb) {
    steem.api.getAccountHistory(username, start, end, function (error, result) {
        if (result) {
            for (i = 0; result.length > i; i++) {
                if (result[i][1].op[1].voter = 'grevons' && result[i][1].op[0] === "vote" && !AccountHistory.findOne({ _id: result[i][1].op[1].permlink })) {
                    AccountHistory.insert({_id : result[i][1].op[1].permlink})
                    AccountHistory.filterhistory(result[i])
                }
            }
            cb(null)
            Content.chainLoad()
        }
        else {
            cb(true)
        }
    })
}



AccountHistory.filterhistory = function (transaction) {
    steem.api.getContent(transaction[1].op[1].author, transaction[1].op[1].permlink, function (error, result) {
        if (!result)
            return
        else {
            if (result.json_metadata) {
                try {
                    result.json_metadata = JSON.parse(result.json_metadata)
                } catch (error) {
                    //console.log(error)
                }
                result.search = result.json_metadata.tags.join(' ')
                result.surl = Content.CreateUrl(result.author, result.permlink)
                result.type = 'grevons'
                for (var t = 0; t < result.json_metadata.tags.length; t++) {
                    t = result.json_metadata.tags.length
                }
                if (!result.language)
                    result.language = 'fr'
                    result.upvoted = transaction[1].op[0].weight
                    result._id = result.id    
                    Content.upsert({ _id: result._id }, result)
            }
        }
    });
}