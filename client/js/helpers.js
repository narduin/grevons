import { Session } from "meteor/session";
import xss from 'xss'
import moment from 'moment'

var Autolinker = require('autolinker');

const steemMarkdown = require('steem-markdown-only')

Template.registerHelper('imgFromArray', function (project) {
    if (!project) return
    if ($.isArray(project.json_metadata.image)) {
        if (project.json_metadata.image[0]) {
            return project.json_metadata.image[0]
        }
    }
})

Template.registerHelper('imgFromBody', function (project) {
    if (!project) return
    else {
        var __imgRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/gi;
        if (__imgRegex.test(project.body)) {

            return 'https://steemitimages.com/0x0/' + project.body.match(__imgRegex)[0];
        }
        else {
            return false
        }
    }
})

Template.registerHelper('isBlacklisted', function (name) {
    if(!Session.get('settings').blacklist.includes(result[i].author))
    return false
    else
    return true
});


Template.registerHelper('remarkableFormatter', function (text) {
    text = steemMarkdown(text)
    var autolinker = new Autolinker({
        urls: {
            schemeMatches: true,
            wwwMatches: true,
            tldMatches: true
        },
        email: true,
        phone: true,
        mention: 'steemit',
        hashtag: 'steemit',
        stripPrefix: false,
        stripTrailingSlash: false,
        newWindow: true,

        truncate: {
            length: 0,
            location: 'end'
        },

        className: ''
    });

    return autolinker.link(text);
})

Template.registerHelper('isFollowing', function (following) {
    var followers = Followers.findOne({ follower: MainUser.find().fetch()[0].name, following: following })
    if (followers) return true
    return false;
})

Template.registerHelper('shortDescription', function (string) {
    return string.slice(0, 150) + " ..."
})

Template.registerHelper('colorfromcategory', function (tags) {
    var colors = Session.get('customtags')
    for (i = 0; tags.length > i; i++) {
        if (colors.find(item => item.category === tags[i]) && tags[i] != "grevons") {
            var item = colors.find(item => item.category === tags[i])
            return item.color
        }
    }
})

Template.registerHelper('colorByCategory', function (tag) {
    var colors = Session.get('customtags')
    if (colors.find(item => item.category === tag) && tag != "grevons") {
        var item = colors.find(item => item.category === tag)
        return item.color
    }
})


Template.registerHelper('inequals', function (a, b) {
    return a !== b;
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('settingsLoaded', function () {
    return Session.get('settings')
});

Template.registerHelper('displayDate', function (date) {
    return moment(date).format('MMMM Do YYYY');
})

Template.registerHelper('displayDateFull', function (date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
})

Template.registerHelper('DisplayTimeFrom', function (date) {
    if (!date) return
    return moment(date + 'Z').fromNow()
})

Template.registerHelper('DisplayTimeCreated', function (date) {
    if (!date) return
    return moment(date).format("ll")
})

Template.registerHelper('displayUpvote', function (share, rewards) {
    return (share * rewards).toFixed(3);
})


Template.registerHelper('displayReputation', function (string) {
    return steem.formatter.reputation(string);
})

Template.registerHelper('isSubscribed', function (following) {
    var sub = Subs.findOne({ follower: MainUser.find().fetch()[0].name, following: following })
    if (sub) return true
    return false;
})



Template.registerHelper('DisplayVotingPower', function (votingPower, lastVoteTime, precision) {
    if (isNaN(votingPower)) return
    var secondsPassedSinceLastVote = (new Date - new Date(lastVoteTime + "Z")) / 1000;
    votingPower += (10000 * secondsPassedSinceLastVote / 432000);
    return Math.min(votingPower / 100, 100).toFixed(precision)
})


Template.registerHelper('DisplaySteemPower', function (vesting_shares, delegated, received_vesting_shares) {
    if (vesting_shares || delegated || received_vesting_shares) {
        var SP = 0;
        SP = SP + Number(vestToSteemPower(vesting_shares.split(' ')[0]))
        SP = SP - Number(vestToSteemPower(delegated.split(' ')[0]))
        if (received_vesting_shares)
            SP = SP + Number(vestToSteemPower(received_vesting_shares.split(' ')[0]))
        return parseFloat(SP).toFixed(3) + ' STEEM'
    }
})


Template.registerHelper('vestToSteemPower', function (userVests) {
    var globals = JSON.parse(localStorage.steemProps)
    var totalSteem = parseFloat(globals.total_vesting_fund_steem.split(' ')[0])
    var totalVests = parseFloat(globals.total_vesting_shares.split(' ')[0])
    userVests = userVests.split(' ')[0]
    var SP = totalSteem * (userVests / totalVests)
    return parseFloat(SP).toFixed(3) + ' SP'
})

Template.registerHelper('displayRewards', function (text) {
    if (!text) return text;
    text = text.replace(/(?:\r\n|\r|\n)/g, ' ');
    var array = [];
    var str = text,
        rg = /\[REWARD(.+?)\]/g, match;
    while (match = rg.exec(str)) {
        array.push(match[1].split(':'))
    }
    return array;
})

function vestToSteemPower(userVests) {
    if (JSON.parse(localStorage.steemProps) && userVests) {
        var globals = JSON.parse(localStorage.steemProps)
        var totalSteem = parseFloat(globals.total_vesting_fund_steem.split(' ')[0])
        var totalVests = parseFloat(globals.total_vesting_shares.split(' ')[0])
        var SP = totalSteem * (userVests / totalVests)
        return SP
    }
}

Template.registerHelper('isMobile', function () {
    if (/Mobi/.test(navigator.userAgent)) {
        return true;
    }
    return false;
});

Template.registerHelper('guestuser', function () {
    if (!Session.get('guestuser')) return
    else {
        var guestuser = Session.get('guestuser')
        return guestuser
    }
})

Template.registerHelper('mainuser', function () {
    if (!MainUser.find().fetch()) return
    else {
        var user = MainUser.find().fetch()
        return user[0]
    }
})

Template.registerHelper('userdata', function () {
    return Session.get('userdata')
})

Template.registerHelper('drafts', function () {
    return Session.get('userdata').drafts
})

Template.registerHelper('unfiltered', function () {
        return Session.get('unfiltered')
})

Template.registerHelper('currentSearch', function () {
    if (Session.get('currentSearch'))
        return Session.get('currentSearch')
    else
        return 'grevons'
})

Template.registerHelper('whitelist', function () {
    if (Session.get('settings'))
        return Session.get('settings').whitelist
})

Template.registerHelper('isWhitelisted', function (user_permlink) {
    if (Session.get('settings'))
        var whitelist = Session.get('settings').whitelist
    if (whitelist.includes(user_permlink))
        return true
})

Template.registerHelper('isBlacklisted', function (user_permlink) {
    if (Session.get('settings'))
        var blacklist = Session.get('settings').blacklist
    if (blacklist.includes(user_permlink))
        return true
})

Template.registerHelper('isArray', function (array) {
    if (!array) return
    if ($.isArray(array))
        return true
    else return false
});


Template.registerHelper('customTags', function (array) {
    if (Session.get('customtags'))
        return Session.get('customtags')
});

Template.registerHelper('currentRegion', function (array) {
    if (Session.get('region'))
        return Session.get('region')
});

Template.registerHelper('toUpperCase', function (element) {
        return element.toUpperCase()
});

Template.registerHelper('profile', function (element) {
    let profile= null;
    if(sessionStorage.getItem('profile'))
    try {
        profile = JSON.parse(sessionStorage.getItem('profile'))
    } catch (error) {
        console.log(error)
    }
    else if(Session.get('profile') && Session.get('profile') != null)
    try {
        profile = JSON.parse(Session.get('profile'))
    } catch (error) {
        console.log(error)
    }
    return profile
});