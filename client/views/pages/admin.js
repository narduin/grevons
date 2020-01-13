Template.admin.rendered = function () {
    var JSONEditor = require('jsoneditor')
    var container = document.getElementById('jsoneditor');
    var options = {};
    var editor = new JSONEditor(container, options);
    var json = Session.get('settings')
    editor.set(json);

    document.getElementById('setJSON').onclick = function () {
        $('#errormessage').addClass('hidden');
        $('#errormessage').removeClass('red');
        $('#errormessage').removeClass('green');
        var json = Session.get('settings')
        editor.set(json);
      };

    document.getElementById('getJSON').onclick = function () {
        $('#errormessage').addClass('hidden');
        $('#errormessage').removeClass('red');
        $('#errormessage').removeClass('green');
        var active = document.getElementById('jsonactive'); 
        var memo = document.getElementById('jsonmemo'); 
        var json = editor.get();
        var jsonMetadata = {
            "jsg_settings": {
            },
            "profile": {
              "name": "jsg.setup",
              "email": "info@grevons.com",
              "about": "JSG Setup Account",
              "location": "France",
              "timezone": "+1",
              "locale": "fr_FR",
              "languages": [
                "fr"
              ],
              "website": "https://grevons.com/",
              "cover_image": "https://grevons.com/images/banner.png",
              "profile_image": "https://grevons.com/images/logo.png"
            }
          }

        jsonMetadata.jsg_settings = json
        steem.broadcast.accountUpdate(
            active.value,
            'jsg.setup',
            undefined, // Set to undefined so account authority dont change
            undefined,
            undefined,
            memo.value,
            jsonMetadata,
            function (err, result) {
                if (err)
                {
                    $('#errormessage').removeClass('hidden');
                    $('#errormessage').addClass('red');
                    $('#getJSON').addClass('red');
                    $('#errormessage').text(err.message.slice(0, 250))
                    var temp = setInterval(function () {
                        $('#getJSON').removeClass('red');
                        clearInterval(temp);
                    }, 600);
                }
                else
                {
                    $('#errormessage').removeClass('hidden');
                    $('#errormessage').text('Successfully saved on the blockchain!')
                    $('#getJSON').addClass('green');
                    $('#errormessage').addClass('green');
                    var temp = setInterval(function () {
                        $('#getJSON').removeClass('red');
                        clearInterval(temp);
                    }, 600);
                }
            }
        )
    }
}