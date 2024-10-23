<?php
    if(isset($_POST["request"])) {
        // Getting info
        $request = json_decode($_POST["request"], TRUE);
        // Writing info
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        $con = mysqli_connect("localhost", "phpmyadmin", "pi", "henlablaser");
        if (! mysqli_connect_errno()) {
            $request_ip      = $request["geobytesremoteip"];
            $request_country = $request["geobytesinternet"];
            $request_city    = $request["geobytescity"];
            $request_lat     = $request["geobyteslatitude"];
            $request_lon     = $request["geobyteslongitude"];
            $con->query("INSERT INTO `accesslog` (`timestamp`, `IP`, `country`, `city`, `lat`, `lon`) VALUES (CURRENT_TIMESTAMP, '{$request_ip}', '{$request_country}', '{$request_city}', '{$request_lat}', '{$request_lon}');");
            $con->close();
        } else {
            return;
        }
    } else {
        return;
    }
?>