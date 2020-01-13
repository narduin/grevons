import { Template } from "meteor/templating";
import { Session } from "meteor/session";
import service from "./js/authservice";

FlowRouter.route('/', {
    name: 'home',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "home", topmenu: "topmenu" });
        $('.actived').removeClass('actived')
        $('.grevons.home').addClass('actived')
        Session.set('currentFilter', false)
        Session.set('currentSearch', false)
        Session.set('currentTag', false)
        Session.set('isonreply', false)
        Session.set('visiblecontent',18)
    }
});

FlowRouter.route('/admin', {
    name: 'admin',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "admin", topmenu: "topmenu" });
    }
});

FlowRouter.route('/faq', {
    name: 'faq',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "faq", topmenu: "topmenu" });
    }
});

FlowRouter.route('/apropos', {
    name: 'apropos',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "apropos", topmenu: "topmenu" });
    }
});

FlowRouter.route('/create', {
    name: 'create',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "create", topmenu: "topmenu" });
    }
});


FlowRouter.route('/login', {
    name: 'login',
    action: function (params, queryParams) {
        service.handleAuthentication()
        FlowRouter.setQueryParams({ params: null, queryParams: null });
        FlowRouter.go('/')
    }
});


FlowRouter.route('/@:user', {
    name: 'profile',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "profile", topmenu: "topmenu" });
        Session.set('user', params.user)
        Session.set('currentprofiletab','blog')
        User.add(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        if(!PersonalHistory.findOne({author:params.user}))
        PersonalHistory.getPersonalHistory(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        Followers.loadFollowers(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        $('.menu.profile .item').tab('change tab', 'first')
    }
});

FlowRouter.route('/@:user/comments', {
    name: 'profile',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "profile", topmenu: "topmenu" });
        Session.set('user', params.user)
        Session.set('currentprofiletab','comments')
        User.add(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        if(!PersonalHistory.findOne({author:params.user}))
        PersonalHistory.getPersonalHistory(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        Followers.loadFollowers(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        $('.menu.profile .item').tab('change tab', 'second')
    }
});

FlowRouter.route('/@:user/replies', {
    name: 'profile',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "profile", topmenu: "topmenu" });
        Session.set('user', params.user)
        Session.set('currentprofiletab','replies')
        User.add(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        if(!PersonalHistory.findOne({author:params.user}))
        PersonalHistory.getPersonalHistory(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        Followers.loadFollowers(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        $('.menu.profile .item').tab('change tab', 'third')
    }
});

FlowRouter.route('/actualite', {
    name: 'actualite',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "actualite", topmenu: "topmenu" });
        Session.set('currentSearch',params.tag)
        Session.set('visiblecontent',18)
    }
});

FlowRouter.route('/partage', {
    name: 'partage',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "partage", topmenu: "topmenu" });
        Session.set('currentSearch',params.tag)
        Session.set('visiblecontent',18)
    }
});

FlowRouter.route('/soutien', {
    name: 'soutien',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "soutien", topmenu: "topmenu" });
        Session.set('currentSearch',params.tag)
        Session.set('visiblecontent',18)
    }
});

FlowRouter.route('/benevolat', {
    name: 'benevolat',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "benevolat", topmenu: "topmenu" });
        Session.set('currentSearch',params.tag)
        Session.set('visiblecontent',18)
    }
});

FlowRouter.route('/greviste', {
    name: 'greviste',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "greviste", topmenu: "topmenu" });
        Session.set('currentSearch',params.tag)
        Session.set('visiblecontent',18)
    }
});

FlowRouter.route('/:zone/@:user/:permalien', {
    name: 'project',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "article", topmenu: "topmenu" });
        FlowRouter.setQueryParams({ params: null, queryParams: null });
        FlowRouter.go('/@' + params.user + '/' + params.permalien)
        Session.set('user', params.user)
        Session.set('article', params.permlink)
    }
});

FlowRouter.route('/zone/:region', {
    name: 'project',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "region", topmenu: "topmenu" });
        FlowRouter.setQueryParams({ params: null, queryParams: null });
        Session.set('region', params.region)
    }
});





