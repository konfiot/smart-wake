    $.ajaxSetup ({
        cache: false                                                                //Pour ne pas utiliser le cache en dev
    });

    $(function() {  //Executé après le chargement

        $(document).ajaxStart(function() { NProgress.start(); });
        $(document).ajaxStop(function() { NProgress.done(); });

    /*******************************************************************************************************************************
    **                                                  Gestion du menu                                                           **        
    *******************************************************************************************************************************/

        $(".leftnav").mousedown(function(e){    //Quand on clic sur un élément du menu
            $(".leftnav").removeClass("active");                                    //On desactive tout
            $(e.delegateTarget).addClass("active");                                 //On active le bon
            
            $(e.delegateTarget).find("i").addClass("fa-spin");
            
            //----------------------------
            
            config.loadForm(window.location.hash.slice(1));

        });
        
        /**************************************************************************/
        $.getJSON("functions/config.php", function(donnees){                    // On recupère la configuration sur le serveur
            config.config = donnees;
            
            /**********************************************************************/
            //Pour afficher le bon formulaire si il y a une ancre
            if( window.location.hash !== "" )   config.loadForm(window.location.hash.slice(1));
            else                                config.loadForm("");
        }).always(function() {                                                  // On vérifie qu'on recoit la configuration
            if ( jQuery.isEmptyObject(config.config) ) {
                console.log(config.config);
                alert("Impossible de charger la configuration, vérifiez le répertoire d'inclusion");
            }
        });
        
        
        
    /****/
    });             //Executé après le chargement {fin}

    //Quand l'ancre change
    $(window).bind('hashchange', function(){
       config.loadForm(window.location.hash.slice(1));
    });

    /*******************************************************************************************************************************
    **                                                 Gestion des formulaires                                                    **        
    *******************************************************************************************************************************/


    var config = {
        initialValue : "",                                                          //Une variable qui contient la valeur initiale du champ édité
        onglet : "defaut",                                                          //Contient l'onglet actuel
        config : {},                                                                //Et celle - ci la configuration json
        
        //Pour changer le formulaire affiché
        loadForm : function(formulaire){
            if(formulaire === "")
                formulaire = "defaut";
                
            $("#main").load("forms/" + formulaire + ".php", function(){    //On envoit la requette
                $(".leftnav").find("i").removeClass("fa-spin");                   //On supprime l'effet de chargement
            
                config.connectAll();                                                //On connecte les inputs
                radios.connectAll();
                horaires.connectAll();
                news.connectAll();
                
                $("[title]").tooltip({"container": "body"});                        //On active les tooltips
                $('.switch').bootstrapSwitch();                                     //On active les switchs
                
                // On active les colorpickers
                $('.color-input').colpick({
                    layout:'hex',
                    submit:0,
                    colorScheme:'dark',
                    onChange:function(hsb,hex,rgb,el,bySetColor) {
                        $(el).css('border-color','#'+hex).parent().find('.input-group-addon').css('border-color','#'+hex);
                        // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
                        if(!bySetColor) $(el).val('#'+hex);
                    }
                }).change(function(){
                    $(this).colpickSetColor(this.value);
                }).keyup(function(){
                    $(this).colpickSetColor(this.value);
                });
            
                config.resetForm();                                                 //On met les valeurs existantes
                config.checkForm();
                
                $('.color-input').each(function(i,e){                           // Initialise les colorpickers
                    $(e).colpickSetColor(e.value);
                });
            });
            
            $(".leftnav>a").each(function(e) {
                $(".leftnav>a")[e].parentNode.className = "leftnav";
                if("#" + $(".leftnav>a")[e].href.split('#')[1] == window.location.hash){
                    $(".leftnav>a")[e].parentNode.className = "leftnav active";
                }
            });
        },

        //Une fonction qui sert à éditer l'erreur ; sel est l'id du champ
        erreur: function(sel, type, message) {
            var el = $(sel);
            el.parent().parent().removeClass("has-success has-error has-warning").addClass("has-" + type);
            el.show();
            
            if( message !== "" )
                el.parent().parent().children(".help-block").show().html(message);
            else
                el.parent().parent().children(".help-block").hide();
        },
        
        //Pour afficher une erreur en bas de la page
        generalErreur: function(type, message) {
            var date = new Date();                                                  //On récupère l'heure actuelle
            var prefixe = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            prefixe = "<strong>" + prefixe + "</strong> - ";
            
            if(message === "")
                $("#generalErreur").addClass("hide");
            else{
                $("#generalErreur").removeClass("hide alert-success alert-danger alert-info alert-warning");
                $("#generalErreur").addClass("alert-" + type).html(prefixe + message);
            }
        },
        
        //Réinscrit les valeurs du json dans les champs
        resetForm : function(){
            $(".form-element").each(function(e){
                var champ = inputs[this.id].champ,
                    categorie = inputs[this.id].categorie;
                    
                if( typeof config.config[categorie] !== "undefined" )
                if( typeof config.config[categorie][champ] !== "undefined" )        // C'est doublé pour ne pas avoir de message d'erreur dans la console
                    inputs[this.id].valeur( decodeURIComponent( config.config[categorie][champ] ) );
                    
            });
        },
        
        //Verifie tous les champs et remet en forme
        checkForm : function(sel){
            //sel contient un selecteur sur une zone pour ne checker que ca
            
            var test = true;
            $(sel + " .form-element").each(function(e){
                test = inputs[this.id].isValid() ? test : false;
            });
            return test;
        },
        
        sendForm : function(){
            if( !config.checkForm() ){
                config.generalErreur("danger", "Echec de l'envoit : formulaire invalide");
                return;
            }

            $("#btn_envoyer").button("loading");                                    //Petit effet sur le bouton envoyer

            $(".form-element").each(function(e){
                var champ = inputs[this.id].champ,
                    categorie = inputs[this.id].categorie;
                config.config[categorie][champ] = inputs[this.id].valeur();
            });
            
            categorie = window.location.hash.slice(1);
            $.ajax({
                type: "GET",
                url: "functions/config.php?categorie=" + categorie + "&value=" + encodeURIComponent(JSON.stringify(config.config[categorie])),
                dataType: "text",
                success: function(){
                    config.generalErreur("success", "Le formulaire à été envoyé avec succès");
                    $("#btn_envoyer").button("reset");
                },
                error: function(){
                    config.generalErreur("danger", "Un problème est arrivé pendant l'envoit du formulaire");
                    $("#btn_envoyer").button("reset");
                }
            });
        },

        //Connecte tous les inputs
        connectAll : function(){
            for (var i in inputs) {
                inputs[i].reconnect();
            }
            
            //Pour reset le formulaire
            $("#btn_annuler").click(function(){
                dialogs.confirm("#confirmModal",
                    function(){     //onOk
                        config.resetForm();
                        config.checkForm();
                    },
                    function(){     //onNo
                        
                    });
            });
            
            $("#btn_envoyer").click(config.sendForm);        
        }
    };

    /*******************************************************************************************************************************
    **                                              Configuration des éléments                                                    **        
    *******************************************************************************************************************************/

    var inputs = {
        //Paramètres des mails    --------------------------------------------------
        "AdresseMail": new elementInput("#AdresseMail",
            "mail",
            "full_adress",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                },
                {
                    "format": /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/,
                    "msg": {
                    "type": "error",
                    "text": "Adresse mail invalide"
                    }
                }
            ],
            function(){}
        ),
        "MailPassword": new elementInput("#MailPassword",
            "mail",
            "passwd",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                }
            ],
            function(){}
        ),
        "ServMail": new elementInputAuto("#ServMail",
            "mail",
            "server",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "warning",
                        "text": "A remplir manuellement"
                    }
                }
            ],
            autoConfig.mail
        ),
        "PortMail": new elementInputAuto("#PortMail",
            "mail",
            "port",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "warning",
                        "text": "A remplir manuellement"
                    }
                },
                {
                    "format": /^[0-9]{1,5}$/,
                    "msg": {
                        "type": "error",
                        "text": "Le port doit etre un nombre compris entre 1 et 65535"
                    }
                }
            
            ],
            autoConfig.port
        ),
        "MailSsl": new elementSwitch("#MailSsl",
            "mail",
            "ssl",
            [ ],
            autoConfig.ssl
        ),
        //Paramètresdu calendrier    -----------------------------------------------
        "CalendarUrl": new elementInput("#CalendarUrl",
            "calendar",
            "url",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                }
            ],
            function(){}
        ),
        //Paramètres de la météo    ------------------------------------------------
        "MeteoPos": new elementInput("#MeteoPos",
            "weather",
            "location",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                },
                {
                    "format": autoConfig.checkCity,
                    "msg": {
                        "type": "warning",
                        "text": "Cette ville n'est pas référencé"
                    }
                }
            ],
            autoConfig.ville
        ),
        //Paramètres des news    ---------------------------------------------------
        "NewsProvider": new elementList("#NewsProvider",
            "news",
            "provider",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                }
            ],
            function(){}
        ),
        "NewsUser": new elementInput("#NewsUser",
            "news",
            "user",
            [ ],
            function(){}
        ),
        "NewsPassword": new elementInput("#NewsPassword",
            "news",
            "passwd",
            [ ],
            function(){}
        ),
        "NewsRoot": new elementInput("#NewsRoot",
            "news",
            "root",
            [ ],
            function(){}
        ),
        //Paramètres des webradios    ---------------------------------------------------
        "RadioName": new elementInput("#RadioName",
            "radios",
            "name",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                }
            ],
            function(){}
        ),
        "RadioUrl": new elementInput("#RadioUrl",
            "radios",
            "url",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                }
            ],
            function(){}
        ),
        "RadioIcone": new elementInput("#RadioIcone",
            "radios",
            "icon",
            [ ],
            function(){}
        ),
        "C-RadioName": new elementInput("#C-RadioName",
            "radios",
            "c-name",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                }
            ],
            function(){}
        ),
        "C-RadioUrl": new elementInput("#C-RadioUrl",
            "radios",
            "c-url",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                }
            ],
            function(){}
        ),
        "C-RadioIcone": new elementInput("#C-RadioIcone",
            "radios",
            "c-icon",
            [ ],
            function(){}
        ),
        //Paramètres du proxy    ---------------------------------------------------
        "ProxyOn": new elementSwitch("#ProxyOn",
            "proxy",
            "enable",
            [ ],
            function(){}
        ),
        "ProxyHttp": new elementInput("#ProxyHttp",
            "proxy",
            "http",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                }
            ],
            function(){}
        ),
        "ProxyHttpsOn": new elementSwitch("#ProxyHttpsOn",
            "proxy",
            "https_enable",
            [ ],
            function(){}
        ),
        "ProxyHttps": new elementInput("#ProxyHttps",
            "proxy",
            "https",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                }
            ],
            function(){}
        ),
        //Paramètres de l'apparence
        "BackColor": new elementInput("#BackColor", 
            "general",
            "back_color",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                }
            ],
            function(){}
        ),
        //Paramètres de l'apparence
        "FrontColor": new elementInput("#FrontColor", 
            "general",
            "front_color",
            [
                {
                    "format": /\S+/,
                    "msg": {
                        "type": "error",
                        "text": "Champ obligatoire"
                    }
                }
            ],
            function(){}
        )
    };
