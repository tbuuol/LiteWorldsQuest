<?php

if (isset($_GET["section"])) {
    header("Access-Control-Allow-Origin: *");
    
    if ($_GET["section"] == "ltcomni") include "Core/LTComni.php";
} else {
    header('Location: https://liteworlds.quest/Genesis.html');
}