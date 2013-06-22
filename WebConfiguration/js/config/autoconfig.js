/*******************************************************************************************************************************
**                                               Gestion de l'autoconfig                                                      **        
*******************************************************************************************************************************/
var autoConfig = {
    mail : function(){
        //Quand on enleve le focus de l'adresse mail ca change l'adresse du serveur par defaut
        $("#AdresseMail").on("changed", function(){        
            var c = $("#AdresseMail");
            var serv = c.val();
            var e = inputs.ServMail;
            config.config.mail.username = serv.substring(0, serv.indexOf("@")); //On enregistre le nom d'utillisateur mail dans le json
            
            serv = serv.substring(serv.indexOf("@")+1, serv.length);            //On isole le sufixe de l'adresse mail
    
            if( (serv !== "") )                                                 //Si quelque chose est entré dans le champ mail et rien dans le serveur, on cherche le serveur mail
                $.ajax({
                    type: "GET",
                    url: "functions/servmail.php?adresse=" + serv,
                    dataType: "text",
                    success: function(serveur){
                        if( (serveur === "") && ($("#ServMail").val() === "") ){
                            e.erreur("error", "Impossible de trouver le serveur");
                            e.manset("A indiquer manuellement");
                        }
                        else{
                            e.autoset(serveur);
                            e.erreur("success", "");
                        }
                    }
                });
            else if( $("#ServMail").val() === "" ){
                e.autoset("Facultatif");                      //Si rien n'est inscrit, on reset le champ mail
                e.erreur("", "");
            }
        });
    },
    port : function(){
        //Quand on enleve le focus de l'adresse mail ca change l'adresse du serveur par defaut
        $("#AdresseMail").on("changed", function(){        
            var c = $("#AdresseMail");
            var serv = c.val();
            var e = inputs.PortMail;
            
            serv = serv.substring(serv.indexOf("@")+1, serv.length);            //On isole le sufixe de l'adresse mail
    
            if( (serv !== "") )                                                 //Si quelque chose est entré dans le champ mail
                $.ajax({
                    type: "GET",
                    url: "functions/servmail.php?champ=port&adresse=" + serv,
                    dataType: "text",
                    success: function(serveur){
                        if( (serveur === "") && ($("#PortMail").val() === "") ){
                            e.erreur("error", "Impossible de trouver le serveur");
                            e.manset("A indiquer manuellement");
                        }
                        else{
                            e.autoset(serveur);
                            e.erreur("success", "");
                        }
                    }
                });
            else if( $("#PortMail").val() === "" ){
                e.autoset("Facultatif");                      //Si rien n'est inscrit, on reset le champ mail
                e.erreur("", "");
            }
        });
    }
};