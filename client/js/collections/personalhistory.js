PersonalHistory = new Mongo.Collection(null)
var moment = require('moment')

PersonalHistory.getPersonalHistory = function (username, cb) {
    if (!Session.get('settings').blacklist.includes(username)) {
        steem.api.getAccountHistory(username, -1, 1000, function (error, result) {
            if (result) {
                for (i = 0; result.length > i; i++) {
                    PersonalHistory.filterhistory(result[i], username)
                }
                cb(null)
            }
            else {
                cb(true)
            }
        })
    }
}


PersonalHistory.filterhistory = function (transaction, username) {
    switch (transaction[1].op[0]) {
        case 'vote':
            var result = {};
            result.type = 'vote'
            result.date = transaction[1].timestamp
            result.name = transaction[1].op[1].voter
            result.author = transaction[1].op[1].author
            result.permlink = transaction[1].op[1].permlink
            result.weight = transaction[1].op[1].weight / 100
            PersonalHistory.upsert({ _id: result.id }, result)
            break;
        case 'comment':
            var result = {};
            if (transaction[1].op[1].author === username)
                result.type = 'comment'
            else
                result.type = 'replies'
            result.date = transaction[1].timestamp
            result.name = transaction[1].op[1].author
            result.parent_permlink = transaction[1].op[1].parent_permlink
            result.permlink = transaction[1].op[1].permlink
            PersonalHistory.upsert({ _id: result.id }, result)
            break;
        case 'transfer':
            var result = {};
            result.type = 'transfer'
            result.date = transaction[1].timestamp
            result.from = transaction[1].op[1].from
            result.to = transaction[1].op[1].to
            result.amount = transaction[1].op[1].amount
            result.memo = transaction[1].op[1].memo
            PersonalHistory.upsert({ _id: result.id }, result)
            break;
        default:
            break;
    }
}