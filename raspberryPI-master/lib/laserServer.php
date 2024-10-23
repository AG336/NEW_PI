<?php

    ///////////////////////////////////////////////////////////////////////////////
    // Useful functions ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    function command_validation($command) {
        if (substr($command, 0, 1) == "X") {
            return "skip";
        }
        return "OK";
    }

    function point_validation($point) {
        return $point;
    }

    function window_validation($window) {
        return $window;
    }

    function temps_query($window) {
        return "SELECT TIMESTAMPDIFF(SECOND, NOW(), `timestamp`) as `timestamp_diff`, `diode`, `crystal`, `electronicsink`, `heatsink` FROM `temperatures`  WHERE  TIMESTAMPDIFF(SECOND, NOW(), `timestamp`) >= -${window}  ORDER BY `timestamp`;";
    }

    function values_query($point) {
        return "SELECT `name`, `value` FROM `current` WHERE `name` = '${point}';";
    }

    ///////////////////////////////////////////////////////////////////////////////
    // Retrieving request /////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    $user = "dummy";
    if (isset($_POST["request"])) {
        $user = json_decode($_POST["request"], true);
    } else {
        if (isset($_GET["request"])) {
            $user = json_decode($_GET["request"], true);
        } else {
            exit;
        }
    }
     
    ///////////////////////////////////////////////////////////////////////////////
    // Accesing data //////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    // Creating variables to return
    $return = array();
    $info   = array();
    
    // Executing commands
    if (isset($user["commands"])) {
        $ok = 0;        
        $commands = $user["commands"];
        foreach ($commands as $command) {
            // Validating command
            $valid = command_validation($command);
            if ($valid == "OK") {
                // Executing command
                $request = "./laserClient.py \"${command}\"";
                unset($result);
                exec($request, $result);
                // Storing and reporting result
                if (!empty($result) && substr(end($result), 0, 2) == "OK") {
                    $ok++;
                    foreach ($result as $line) {
                        array_push($info, "LOG: ".$line);
                    }
                } else {
                    array_push($info, "ERROR: Error processing command \"${command}\"");
                    break;
                }                
            } elseif ($valid == "skip") {
                array_push($info, "WARNING: Command \"${command}\" skipped");
                continue;
            } elseif ($valid == "exit") {
                array_push($info, "ERROR: Command validation requested the process termination");
                exit;
            } else {
                array_push($info, "ERROR: Not possible to calculate command \"${command}\" validity");
                break;
            }
        }
        $return["commands"]              = array();
        $return["commands"]["success"]   = $ok;
        $return["commands"]["requested"] = $commands;

    }
    // Retreiving database values
    if (isset($user["values"]) || isset($user["temps"])) {
        // Connecting to database
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        $con = mysqli_connect("localhost", "phpmyadmin", "pi", "henlablaser");
        $con->query("SET time_zone = 'America/New_York';");
        if (! mysqli_connect_errno()) {
            // Acquiring keyword values
            if (isset($user["values"])) {
                $values = array();
                $points = $user["values"];
                foreach ($points as $point) {
                    $point = point_validation($point);
                    if ($point !== FALSE) {
                        $query = values_query($point);
                        $result = $con->query($query);
                        if ($result->num_rows > 0) {
                            $result = $result->fetch_assoc();
                            array_push($values, $result);
                        } else {
                            array_push($info, "WARNING: Value \"".$point."\" not found");
                        }
                    }
                }
                $return["values"] = $values;
            }
            // Acquiring temperatures
            if (isset($user["temps"])) {
                $temperatures = array("times" => array(), "label" => array(), "diode" => array(), "crystal" => array(), "electronicsink" => array(), "heatsink" => array());
                $window = $user["temps"];
                $window = window_validation($window);
                if($window !== FALSE) {
                    $query = temps_query($window);
                    $result = $con->query($query);
                    $numrows = $result->num_rows;
                    if ($numrows > 0) {
                        $counter = 0;
                        while ($rowtemp = $result->fetch_assoc()) {
                            array_push($temperatures["diode"], floatval($rowtemp["diode"]));
                            array_push($temperatures["crystal"], floatval($rowtemp["crystal"]));
                            array_push($temperatures["electronicsink"], floatval($rowtemp["electronicsink"]));
                            array_push($temperatures["heatsink"], floatval($rowtemp["heatsink"]));
                            array_push($temperatures["times"], intval($rowtemp["timestamp_diff"]));
                            array_push($temperatures["label"], $rowtemp["timestamp_diff"]);
                        }
                    }
                }
                $return["temperatures"] = $temperatures;
            }
            $con->close();
        } else {
            array_push($info, "ERROR: Not possible to connect to DB");
        }
    }

    ///////////////////////////////////////////////////////////////////////////////
    // Returning result ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    
    $return["info"] = $info;
    print(json_encode($return, JSON_PRETTY_PRINT));

?>