<?php

namespace App;

function write_log($log_msg)
{
    $log_filename = "/home/yihsiu/logs";
    if (!file_exists($log_filename)) {
        mkdir($log_filename, 0777, true);
    }
    $log_file_data = $log_filename . '/debug.log';
    file_put_contents($log_file_data, $log_msg . "\n", FILE_APPEND);
}
