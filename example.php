<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ob_implicit_flush(true);
ob_end_flush();

$v_id = '';
$matches = '';

if(isset($_POST['v_id']) && isset($_POST['matches'])){
    echo 'test';
    $v_id = htmlspecialchars($_POST['v_id']);
    $matches =  $_POST['matches'];
}

$action = '';

if(isset($_GET['action'])){
    $action = htmlspecialchars($_GET['action']);
    if($action != 'get' && $action != 'post'){
        die('wrong action');
    }
}

if($action=='post') {
    $json = json_decode(file_get_contents('php://input'),true);
    $v_id = $json['v_id']; // change the post type as you wish
    $matches = $json['matches'];
}

$sleep_time = 1;
$prompt_list = array();
$request_count = 0;

if($action == 'get'){
    for($i = 0; $i < 10; $i++){
        $prompt_list[] = "this is a test prompt";
    }
    // in here you can get your prompts
}

$results = json_decode($matches, true);
if(!is_array($results)) $results = json_decode($results, true);

if(is_array($results) && count($results) > 0){
    // you can do whatever you want with the results here
    ksort($results);
    print_r($results);
}

if($action == "get"){
    header("Content-Type: application/json");
    echo json_encode($prompt_list);
}