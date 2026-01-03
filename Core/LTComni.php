<?php
error_reporting(E_ERROR);
ini_set('display_errors', 1);
header('Content-Type: application/json');

switch ($_GET['method']) {
    case 'help':
        isset($_GET["cmd"]) ? Help($_GET["cmd"]) : Help();
        break;

    case 'getdex':
        isset($_GET["adr"]) ? Out(Node('omni_getactivedexsells', [$_GET["adr"]])) : Out(Node('omni_getactivedexsells', []));
        break;

    case 'getbalforadr':
        if (!isset($_GET["adr"])) Out(["error" => "&adr missing"]);
        Out(Node('omni_getallbalancesforaddress', [$_GET["adr"]]));
        break;

    case 'getproperty':
        if (!isset($_GET["id"])) Out(Node('omni_listproperties', []));
        Out(Node('omni_getproperty', [(int)$_GET["id"]]));
        break;

    case 'getdex':
        Out(Node('omni_getactivedexsells', [$_GET["adr"]]));
        break;

    case 'getnfts':
        Out(Node('omni_getnonfungibletokens', [$_GET["adr"]]));
        break;

    case 'getnftdata':
        Out(Node('omni_getnonfungibletokendata', [(int)$_GET["p"], (int)$_GET["t"], (int)$_GET["t"]]));
        break;

    case 'payload-simplesend':
        if (!isset($_GET["id"])) Out(["error" => "&id missing"]);
        if (!isset($_GET["amount"])) Out(["error" => "&amount missing"]);
        Out(Node('omni_createpayload_simplesend', [(int)$_GET["id"], $_GET["amount"]]));
        break;

    case 'combine':
        if (!isset($_GET["tx"])) Out(["error" => "&tx missing"]);
        if (!isset($_GET["payload"])) Out(["error" => "&payload missing"]);
        Out(Node('omni_createrawtx_opreturn', [$_GET["tx"], $_GET["payload"]]));
        break;

    
    default:
        echo json_encode(["error" => "LTComni Section, unknown method"], JSON_PRETTY_PRINT);
        break;
}

function Node($cmd = 'getblockchaininfo', $parmas = []) {
    $user = 'user';
    $pass = 'pass';
    $ip = '127.0.0.1';
    $port = '10003';
    $url = 'http://'.$user.':'.$pass.'@'.$ip.':'.$port;

    $r = json_decode(file_get_contents(
        $url,
        false,
        stream_context_create([
            'http' => [
                'method'  => 'POST',
                'header'  => 'Content-Type: application/json',
                'content' => json_encode([
                    'method' => $cmd,
                    'params' => $parmas
                ])
            ]
        ])
    ));

    if (!$r) Out([]);
    else return $r->result;
}

function Out($ex) {
    echo json_encode($ex, JSON_PRETTY_PRINT);
    die;
}

function Help($cmd = "") {
    header('Content-Type: text/plain');
    echo Node('help', [$cmd]);
}

function GetBalancesForAddress($address) {
    Out(Node('omni_getallbalancesforaddress', [$address]));
}

function GetProperty($propertyID) {
    Out(Node('omni_getproperty', [(int)$propertyID]));
}