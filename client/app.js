import './buffer';
import './main.html';
import { Session } from 'meteor/session';
import steem from 'steem';
import service from './js/authservice.js'
steem.api.setOptions({ url: 'https://api.steemit.com' });
FlowRouter.wait();

BlazeLayout.setRoot('body');

window.steem = steem;
window.service = service;
Meteor.startup(function () {
    Session.set('settings', false)

    if (Session.get('settings')) {
        sessionStorage.setItem('settings', JSON.stringify(Session.get('settings')))
        sessionStorage.setItem('customtags', JSON.stringify(Session.get('customtags')))
    }

    if (!Session.get('settings') && sessionStorage.getItem('settings')) {
        Session.set('settings', JSON.parse(sessionStorage.getItem('settings')))
        Session.set('customtags', JSON.parse(sessionStorage.getItem('customtags')))
    }
    //LOAD GLOBAL PROPERTIES
    var sendDate = (new Date()).getTime();
    steem.api.getDynamicGlobalProperties(function (err, result) {
        if (result) {
            var receiveDate = (new Date()).getTime();
            var responseTimeMs = receiveDate - sendDate;
            console.log('Global Properties loaded from steemit.api in : ' + responseTimeMs + "ms")
            localStorage.setItem('steemProps', JSON.stringify(result))
        }
    })

    //LOAD SETTINGS FROM JSG.SETUP ACCOUNT
    steem.api.getAccounts(['jsg.setup'], function (error, result) {
        if (!result) {
            return
        }
        for (var i = 0; i < result.length; i++) {
            try {
                result[i].json_metadata = JSON.parse(result[i].json_metadata)
            } catch (error) {
                console.log(error)
            }
            Session.set('settings', result[i].json_metadata.jsg_settings)
            Session.set('customtags', result[i].json_metadata.jsg_settings.tags)
        }
    });

    Session.set('visiblecontent', 12)

    console.log(
        `%c WARNING !!!`,
        "background: #db2828; color: white; font-size: 18px; padding: 3px 3px;"
    );
    console.log(
        `%c THIS FEATURE IS DESIGNED FOR DEVELOPERS. ANYTHING YOU PASTE OR TYPE HERE CAN COMPROMISE YOUR ACCOUNT AND YOUR KEYS.`,
        "background: white; color: black; font-size: 16px; padding: 3px 3px;"
    );
    console.log(
        `%c Grevons OpenSource v0.1`,
        "background: #db2828; color: white; font-size: 12px; padding: 3px 3px;"
    );

    FlowRouter.initialize({ hashbang: false }, function () {
    });
})


