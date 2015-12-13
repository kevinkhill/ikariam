// ==UserScript==
// @name            Ikariam Alliance Message
// @namespace       kkhweb.com
// @author          empty_soul
// @homepage        http://userscripts.org/scripts/show/82593
// @version         1.2
// @history         1.2 Added server code to link, multiserver support
// @history         1.1.1 Added more Spanish Translation locale codes
// @history         1.1 Added Spanish Translation
// @history         1.0b2 Added Script Title and Version Number to message page.
// @history         1.0b1 Initial Release
// @description     Adds a Link to the top of the page, to send Alliance Messages easily from any view.
// @homepage        http://kkhweb.com/
// @include         http://*.ikariam.*/*
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js
// @require http://files.kkhweb.com/greasemonkey/57377.safe.js
// @require http://files.kkhweb.com/greasemonkey/57756.safe.js
// @require http://files.kkhweb.com/greasemonkey/62718.safe.js
// @require http://files.kkhweb.com/greasemonkey/gmTools.js
// ==/UserScript==

if(!aMessage){var aMessage;}

aMessage = {
    curVer : '1.2',
    usoNum : 82593,
    aml : '',
    allyPage : '/index.php?view=diplomacyAdvisorAlly',
    language : '',
    autoLang : '',
    world : '',
    domain : IkaTools.getDomain(),
    checkUpdate : function(){
        ScriptUpdater.check(this.usoNum, this.curVer)
    },
    forceUpdate : function(){
        ScriptUpdater.forceNotice(this.usoNum, this.curVer);
    },
    run : function(debug) {
        if(debug === true) {
            unsafeWindow.aMessage = this;
            unsafeWindow.aMessage.init();
        } else {
            this.init();
        }
    },
    init : function(){
        this.autoLang = this.domain.split('.')[1];
        this.world = this.domain.split('.')[0];
        this.language = this.loadLang(this.autoLang);
        this.addCSS();
        this.addLink();
        this.aml = GM.value.get(this.world+'|link', false);
        
        if(this.aml === false || this.aml == 'false' || this.aml == '') {
            this.aml = this.getMsgLink();
            
            if(this.aml === false) {
                $('#AM span').html('<span id="ex">!!</span> ' + this.language.link);
                this.setLink(this.allyPage);
            } else {
                alert(this.language.title + ":\n\t" + this.language.confirm);
                this.saveLink();
            }
        } else {
            $('#AM span').text(this.language.link);
            this.setLink(this.aml);
        }

        if(IkaTools.getView() == 'sendIKMessage') {
            this.attachUpdater();
        }

        this.checkUpdate();
    },
    attachUpdater : function(){
        var updateLine = '<div id="update_l">Ikariam ' + this.language.title + '</div>';
            updateLine += '<div id="update_r">v' + this.curVer + '</div>';
        //var updateCheckButton = $('<a id="updateCheck">'+updateLine+'</a>');
        var updateCheckButton = $('<span id="updateCheck">'+updateLine+'</span>');

        $('#notice').after(updateCheckButton);

//        $('#updateCheck').bind('click', function(){
//            aMessage.forceUpdate();
//        });
    },
    getMsgLink : function() {
        var check = $('#allyinfo a[href*="msgType=51"]').length;
        if(check === 0) {
            return false;
        } else {
            var link = '/index.php' + $('#allyinfo a[href*="msgType=51"]').attr('href');
            return link;
        }
    },
    setLink : function(link){
        $('#AM').attr('href', link);
        $('#AM').attr('title', this.language.title + ', v' + this.curVer + ' ' + this.world);
    },
    saveLink : function(){
        GM.value.set(this.world +'|link', this.aml);
    },
    addLink : function() {
        var link = '<li><a id="AM" title="' + this.language.link + '" href="">' +
            '<span class="textLabel">Alliance Message</span></li>';
        var jLink = $(link);
        
        $('#GF_toolbar ul').prepend(jLink);
    },
    addCSS : function() {
        GM.css(
            '#AM {color:white;font:bold 11px Arial,Helvetica,sans-serif;}' +
            '#AM:hover {text-decoration:underline;cursor:pointer;}' +
            '#ex {font-size:12px;font-weight:bold;color:yellow;}' +
            //'#updateCheck {color:blue;cursor:pointer}' +
            '#notice {margin-bottom:0px}' +
            '#update_l {float:left;height:12px;margin-left:10px;}' +
            '#update_r {float:right;height:12px;margin-right:10px;}'
        );
    },
    loadLang : function(loc) {
        var lang = {
            name : '',
            link : '',
            title : '',
            confirm : ''
        };

        switch(loc) {
            case 'en':
                lang.name = 'English';
                lang.link = 'Alliance Message',
                lang.title = 'Alliance Message Script',
                lang.confirm = 'Circular Message Link was saved!';
            break;

            case 'pe':
            case 'ar':
            case 'es':
            case 'cl':
            case 'co':
            case 've':
            case 'mx':
                lang.name = 'Espa&ntilde;ol';
                lang.link = 'Mensaje circular',
                lang.title = 'Script de Mensaje circular',
                lang.confirm = '¡Se ha almacenado el enlace del mensaje circular!'
            break;
        }

    return lang;
    }
};

(function(){
    aMessage.run();
})();