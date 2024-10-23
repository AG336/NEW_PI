<?php

    ///////////////////////////////////////////////////////////////////////////////
    // Useful functions ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    function compare_timestamps($a, $b)
    {
        return $a[0] - $b[0];
    }

    function queue_query($entry) {
        return("INSERT INTO `queue` (`id`, `timestamp`, `device`, `action`, `parameter`, `completed`) VALUES (NULL, '{$entry[0]}', '{$entry[1]}', '{$entry[2]}', '{$entry[3]}', '0');");
    }

    ///////////////////////////////////////////////////////////////////////////////
    // Request handling ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    $to_return          = array();
    $to_return["error"] = FALSE;
    $to_return["log"]   = array();
    $to_return["table"] = "";
    // Inserting file into database ///////////////////////////////////////////////
    if(isset($_FILES["script"])){
        while (TRUE) {
            // Checking for uploading errors
            if ($_FILES["script"]["error"] != 0) {
                array_push($to_return["log"], "ERROR: New script file received with error: ".$_FILES["script"]["error"]);
                $to_return["error"] = TRUE;
                break;
            }
            // Reading file to csv
            $new_script = array();
            $fh = fopen($_FILES["script"]["tmp_name"], 'r');
            while ($line = fgets($fh)) {
                if (substr($line, 0, 1) != "#") {
                  array_push($new_script, str_getcsv($line));
                }
            }
            fclose($fh);
            // Deleting temporal file
            unlink($_FILES["script"]["tmp_name"]);
            // Calculating timestamps
            // If starting point in the pass, set to zero
            if ($new_script[0][0] < time() && $new_script[0][0] != 0) {
                $new_script[0][0] = 0; // Fix, should be 0 to start without date
                array_push($to_return["log"], "WARNING: First script line in the past, queue will be disabled and the script will start when enabling queue");
            } else {
                $new_script[0][0] = $new_script[0][0];
            }
            // Inserting following lines
            for ($i=1; $i<sizeof($new_script); $i++) {
                if($new_script[$i-1][1] < $new_script[$i][1]) {
                    array_push($to_return["log"], "ERROR: There is a middle instruction dated before the previous instruction. This is nor supported");
                    $to_return["error"] = TRUE;
                    break;
                    $new_script[$i][0] = $new_script[$i][0];
                } else if ($new_script[$i][0] < time()) {
                    array_push($to_return["log"], "ERROR: There is a middle instruction dated on the past. This is nor supported");
                    $to_return["error"] = TRUE;
                    break;
                }
            }
            // Sorting the array by calculared timestamps
            usort($new_script, 'compare_timestamps');
            // Sending to database
            // Connecting to database
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            $con = mysqli_connect("localhost", "phpmyadmin", "pi", "henlablaser");
            $con->query("SET time_zone = 'America/New_York';");
            if (! mysqli_connect_errno()) {
                $con->query("TRUNCATE TABLE `queue`");
                $con->query("ALTER TABLE `queue` AUTO_INCREMENT = 1;");
                for($i = 0; $i < sizeof($new_script); $i++) {
                    $con->query(queue_query($new_script[$i]));
                }
                $con->close();
            } else {
                array_push($to_return["log"], "ERROR: Not possible to connect to DB");
                $to_return["error"] = TRUE;
                break;
            }
            $to_return["loaded_script"] = $new_script;
            break;
        }
    }
    // Executing dta actions //////////////////////////////////////////////////////
    // Reading request if exists
    if(isset($_POST["request"])){
        $data = json_decode($_POST["request"], true);
        // Connecting to database
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        $con = mysqli_connect("localhost", "phpmyadmin", "pi", "henlablaser");
        $con->query("SET time_zone = 'America/New_York';");
        if (! mysqli_connect_errno()) {
            // Executing database actions /////////////////////////////////////////
            // Clear
            if(isset($data["clear"]) && $data["clear"] == true){
                $con->query("TRUNCATE TABLE `queue`");
                $con->query("ALTER TABLE `queue` AUTO_INCREMENT = 1;");
            }
            $con->close();
        } else {
            array_push($to_return["log"], "ERROR: Not possible to connect to DB");
            $to_return["error"] = TRUE;
        }
    }
    // Generating table
    exec("./laserQueue.py", $lines);
    foreach ($lines as $line) {
        $to_return["table"] .= $line;
    }
    print(json_encode($to_return, JSON_PRETTY_PRINT));

?>