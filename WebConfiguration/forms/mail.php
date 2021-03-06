<div class="page-header">
    <h1>Paramètres<small> - compte email</small></h1>
    <p>
        Rentrez vos identifiants mail et soyez avertis dès la première heure de vos derniers emails
    </p>
</div>
<p>
    <form class="col-md-offset-1 col-md-10" >
    
        <fieldset>
            <legend>Connection à votre compte</legend>
        
            <div class="form-group">
                <label for="AdresseMail">Adresse email</label>
                <div class="input-group">
                    <span class="input-group-addon"><i class="fa fa-envelope"></i></span>
                    <input type="email" id="AdresseMail" class="first_focus form-control form-element" placeholder="Exemple : name@exemple.com">
                </div>
                <span class="help-block" style="display: none;" ></span> <!-- Message d'erreur -->
            </div>
            
            <div class="form-group">
                <label for="MailPassword">Mot de passe</label>
                <div class="input-group">
                    <span class="input-group-addon"><i class="fa fa-key"></i></span>
                    <input type="password" id="MailPassword" class="form-control form-element" placeholder="" >
                </div>
                <span class="help-block" style="display: none;" ></span> <!-- Message d'erreur -->
            </div>
        </fieldset>
            
        <fieldset>
            <legend>Paramètres avancés</legend>
            
            <div class="form-group">
                <label for="ServMail">Serveur mail</label>
                <div class="input-group">
                    <span class="input-group-addon"><i class="fa fa-terminal"></i></span>
                    <input type="text" id="ServMail" class="form-control form-element" placeholder="Facultatif" >
                </div>
                <span class="help-block" style="display: none;" ></span> <!-- Message d'erreur -->
            </div>
            
            <div class="form-group">
                <label for="PortMail">Port</label>
                <div class="input-group">
                    <span class="input-group-addon"><i class="fa fa-dot-circle-o"></i></span>
                    <input type="text" id="PortMail" class="form-control form-element" min="0" max="65535" placeholder="Facultatif" >
                </div>
                <span class="help-block" style="display: none;" ></span> <!-- Message d'erreur -->
            </div>
            
            <div class="form-group">
                <label class="control-label" for="MailSsl">SSL</label>
                <span><span>
                    <input class="switch form-element" type="checkbox" data-on-label="Oui" data-off-label="Non" id="MailSsl">
                </div></span> <!-- Pour avoir le bon nombre de parents -->
                <span class="help-block" style="display: none;" ></span> <!-- Message d'erreur -->
            </div>
        </fieldset>
        
        <div class="input-prepend input-append" style="padding-left:75px"><br>
            <button class="btn btn-danger"  type="button" id="btn_annuler"> <i class="fa fa-times"></i> Annuler</button>
            <button class="btn btn-success" type="button" id="btn_envoyer" data-loading-text=" <i class='fa fa-spinner fa-spin'></i> Valider"> <i class="fa fa-check"></i> Valider</button> 
        </div>
    </form>

    <div class="alert hide col-sm-11 col-md-11 alert-warning" id="generalErreur">
        Ici, les erreurs
    </div>
    
</p>