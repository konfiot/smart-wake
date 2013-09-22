<?php
    /***************************************************************************
    * Pour chercher des webradios
    ***************************************************************************/
    
    if( !isset($_GET["format"]) ) $_GET["format"] = "html";
    if( !isset($_GET["format"]) ) $_GET["page"] = "0";
    
    $json = file_get_contents("http://opml.radiotime.com/Search.ashx?render=json&query=" . $_GET["q"]);
    $json = json_decode($json, true);
    $json = changeJson($json);
    
    if( $_GET["format"] == "json" )
        echo json_encode($json);
        
    else if( $_GET["format"] == "html" )
        echo toHtml($json);
    
    
    /* ********************************************************************** */
    
    
    function changeJson($before) {
        $after = array();
        foreach($before["body"] as $i ) {
            if($i["type"] == "audio") {
                $r["name"] = $i["text"];
                $r["adress"] = $i["URL"];
                $r["icon"] = $i["image"];
                
                $after[] = $r;
            }
        }
        return $after;
    }

    // Pour réduire l'adresse
    function shortUrl($fullUrl) {
        if( strpos($fullUrl, "//") != 0 )
            $fullUrl = substr($fullUrl, strpos($fullUrl, "//")+2);
        if( strpos($fullUrl, "/", 1) != 0 )
            $fullUrl = substr($fullUrl, 0 , strpos($fullUrl, "/", 1));
            
            return $fullUrl;
    }
    
    function toHtml($json) {
        $n = count($json);
        if($n == 0) return "Aucune radio trouvée";
        
        $json = array_slice($json, $_GET["page"]*10, 10);
        
        $r .= '<p>' .$n. ' radios trouvées </p>';
        $r .= '
        <!-- ---------------------- Resultat de recherche ----------------------!>
        <table class="table table-hover radio-search">
            <thead>
                <tr>
                    <th></th>
                    <th>Nom</th>
                    <th>Adresse</th>
                </tr>
            </thead>
            <tbody>';
            
        foreach( $json as $i ) {
            $r .= '
                <tr class="radio-desc" title="Ajouter" >
                    <td><img src="' .$i["icon"]. '" class="icon" /></td>
                    <td class="name" >' .$i["name"]. '</td>
                    <td class="adresse">
                        <a target="_blank" href="' .$i["adress"]. '" title="' .$i["adress"]. '" >' .shortUrl($i["adress"]). '</a>
                    </td>
                </tr>
            ';
        }
        
        $r .= "\n<!-- -----------------------------------------------------------------!></tbody></table>";
        return $r;
    }

?>

