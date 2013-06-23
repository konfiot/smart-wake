/*******************************************************************************************************************************
**                                                Classe élément mère                                                         **        
*******************************************************************************************************************************/

function element(_sel, _categorie, _champ){
    this.element = _sel;                                                        //Selecteur JQuery
    this.categorie = _categorie;                                                //Categorie pour l'enregistrement
    this.champ = _champ;                                                        //Champ pour l'enregistrement
    
    this.initialValue = "";                                                     //Sert à retenir la valeur à la prise de focus
    
    this.valeur = function(v){
        if( (typeof v) !== "undefined" ){
            $(this.element).val(v);
            $(this.element).trigger("changed");
        }
        else
            return $(this.element).val();
    };
    
    //Une fonction qui sert à éditer l'erreur
    this.erreur = function(type, message) {
        $(this.element).parent().parent().parent().removeClass("success error info warning").addClass(type);
        $(this.element).parent().parent().children(".help-inline").html(message);
    },
    
    this.isValid = function(){
        this.erreur("success", "");
        return true;
    };
    
    this.reconnect = function(){
        $(this.element).focusin(function(){
            $("#"+this.id).data( "initialValue", this.value );
        });
        
        $(this.element).focusout(function(){
            if( $("#"+this.id).data( "initialValue" ) != this.value ){
                $("#"+this.id).trigger("changed");
            }
        });
    };
}

/*******************************************************************************************************************************
**                                                Classe élément input                                                        **        
*******************************************************************************************************************************/

function elementInput(_element, _categorie, _champ, _validation){
    element.call(this, _element, _categorie, _champ);                           //Hérite de la classe élément
    this.validation = _validation;                                              //Liste des validateurs
    
    this.valeur = function(v){
        if( (typeof v) !== "undefined" ){
            $(this.element).val(v);
            this.isValid();
            
            $(this.element).trigger("changed");
        }
        else{
            if( $(this.element).val() !== "" )
                return $(this.element).val();
            else
                return "";
        }
    };
    
    this.isValid = function(){
        for (var i = 0 ; i < this.validation.length ; i++) {
            if( !this.validation[i].format.test( $(this.element).val() ) ){
                this.erreur(this.validation[i].msg.type, this.validation[i].msg.text);
                return false;
            }
        }
        this.erreur("success", "");
        return true;
    };
    
    this.reconnect = function(){
        var temp = new element();
        temp.reconnect.call(this);
        
        $(this.element).on("changed", function(){
            inputs[this.id].isValid();
        });
    };
}

/*******************************************************************************************************************************
**                                            Classe élément auto-définis                                                     **        
*******************************************************************************************************************************/

function elementInputAuto(_element, _categorie, _champ, _validation, _proccess){
    elementInput.call(this, _element, _categorie, _champ, _validation);
    this.proccess = _proccess;
    this.auto = false;
    
    this.valeur = function(v){
        if( typeof v === "undefined" && $(this.element).val() === "" && this.auto)
            return $(this.element).attr("placeholder");
            
        var temp = new elementInput();
        temp.valeur.call(this, v);                                             //seter actif
            
        this.refreshAuto();
        this.isValid();
        
        return temp.valeur.call(this);                                         //seter actif
            
    };
    
    this.manset = function(v){
        this.auto = false;
        $(this.element).attr("placeholder", v);
        
        this.refreshAuto();
        this.isValid();
    };
    
    this.autoset = function(v){
        this.auto = true;
        $(this.element).attr("placeholder", v);
        
        this.refreshAuto();
        this.isValid();
    };
    
    this.isValid = function(){
        if( this.auto && $(this.element).val() === "" ){                        //Si c'est auto ... On s'en tappe !!!
            this.erreur("success", "");
            return true;
        }
        
        var temp = new elementInput();
        return temp.isValid.call(this);
    };
    
    this.reconnect = function(){
        var temp = new element();
        temp.reconnect.call(this);
        
        this.proccess();
        
        $(this.element).on("changed", function(){
            inputs[this.id].refreshAuto();
            inputs[this.id].isValid();
        });
    };
    
    this.refreshAuto = function(){
        if( $(this.element).val() === $(this.element).attr("placeholder") )
            $(this.element).val("");
    };
}

/*******************************************************************************************************************************
**                                                Classe élément input                                                        **        
*******************************************************************************************************************************/

function elementSwitch(_element, _categorie, _champ, _proprietes){
    element.call(this, _element, _categorie, _champ);                           //Hérite de la classe élément
    this.proprietes = _proprietes;
    
    this.valeur = function(v){
        if( (typeof v) == "undefined" )
            return $(this.element).bootstrapSwitch("status");
        else
            $(this.element).bootstrapSwitch("setState", v);
    };
}

function elementSwitchAuto(_element, _categorie, _champ, _proccess){
    elementSwitch.call(this, _element, _categorie, _champ);                     //Hérite de la classe élémentSwitch
    this.proccess = _proccess;
    
    this.reconnect = function(){
        var temp = new elementSwitch();
        temp.reconnect.call(this);
        
        this.proccess();
    };   
}