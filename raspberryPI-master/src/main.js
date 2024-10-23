
///////////////////////////////////////////////////////////////////////////////////
// Startup parameters /////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// Default list of commands at startup
var startup_commands = '"LAS GEMT",' +
                       '"LAS GMTE",' +
                       '"LAS GTCO",' +
                       '"LAS GSER",' +
                       '"GEN C1:OUTP?",' +
                       '"GEN C1:BSWV?",' +
                       '"GEN C2:OUTP?",' +
                       '"GEN C2:BSWV?",' +
                       '"ATT D"';

// Default list of values at startup
var startup_values = '"LAS_GEMT_SUPPLY",' +
                     '"LAS_GEMT_EMITING",' +
                     '"LAS_GMTE_DIODE",' +
                     '"LAS_GMTE_CRYSTAL",' +
                     '"LAS_GMTE_ELECTRONICSINK",' +
                     '"LAS_GMTE_HEATSINK",' +
                     '"LAS_TEC1",' +
                     '"LAS_TEC2",' +
                     '"LAS_GSER_ERROR1",' +
                     '"LAS_GSER_ERROR2",' +
                     '"LAS_GSER_ERROR3",' +
                     '"LAS_GSER_INFO1",' +
                     '"LAS_GSER_INFO2",' +
                     '"LAS_GSER_INFO3",' +
                     '"LAS_D",' +
                     '"GE1_WVTP",' +
                     '"GE1_AMP",' +
                     '"GE1_OFST",' +
                     '"GE1_FRQ",' +
                     '"GE1_DUTY",' +
                     '"GE1_WIDTH",' +
                     '"GE1_RISE",' +
                     '"GE1_FALL",' +
                     '"GE1_OUT",' +
                     '"GE2_WVTP",' +
                     '"GE2_AMP",' +
                     '"GE2_OFST",' +
                     '"GE2_FRQ",' +
                     '"GE2_DUTY",' +
                     '"GE2_WIDTH",' +
                     '"GE2_RISE",' +
                     '"GE2_FALL",' +
                     '"GE2_OUT",' +
                     '"ATT_DB",' +
                     '"ATT_PERCENT",' +
                     '"ATT_POS",' + 
                     '"ATT_LAST"';

// Default amount of seconds for the temperature plot tim range
var startup_seconds = 1*60*60+60;

///////////////////////////////////////////////////////////////////////////////////
// Default values /////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var channel_defaults = {
    1: {
        GE1_AMP:   "5 [V]",
        GE1_OFST:  "2.5 [V]",
        GE1_FRQ:   "1000 [Hz]",
        GE1_DUTY:  "10 [%]",
        GE1_WIDTH: "0.0001 [S]",
        GE1_RISE:  "1.68e-08 [S]",
        GE1_FALL:  "1.68e-08 [S]",
    },
    2: {
        GE2_AMP:   "5 [V]",
        GE2_OFST:  "2.5 [V]",
        GE2_FRQ:   "1000 [Hz]",
        GE2_DUTY:  "10 [%]",
        GE2_WIDTH: "0.0001 [S]",
        GE2_RISE:  "1.68e-08 [S]",
        GE2_FALL:  "1.68e-08 [S]",
    }
};

// List of units for specific parameters
var parameter_units = {
    LAS_GEMT_SUPPLY:         "[H:M]",
    LAS_GEMT_EMITING:        "[H:M]",
    LAS_GMTE_DIODE:          "[°C]",
    LAS_GMTE_CRYSTAL:        "[°C]",
    LAS_GMTE_ELECTRONICSINK: "[°C]",
    LAS_GMTE_HEATSINK:       "[°C]",
    GE1_AMP:                 "[V]",
    GE1_OFST:                "[V]",
    GE1_FRQ:                 "[Hz]",
    GE1_DUTY:                "[%]",
    GE1_WIDTH:               "[S]",
    GE1_RISE:                "[S]",
    GE1_FALL:                "[S]",
    GE2_AMP:                 "[V]",
    GE2_OFST:                "[V]",
    GE2_FRQ:                 "[Hz]",
    GE2_DUTY:                "[%]",
    GE2_WIDTH:               "[S]",
    GE2_RISE:                "[S]",
    GE2_FALL:                "[S]",
    ATT_DB:                  "[dB]",
    ATT_PERCENT:             "[%]",
    ATT_POS:                 "[Step]"
}

///////////////////////////////////////////////////////////////////////////////////
// Graphical Elements /////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// Variable to reference the temperature plot
var temperature_plot;

// Arrays to store the temperature informarion
var temp_diode          = [];
var temp_crystal        = [];
var temp_electronicsink = [];
var temp_heatsink       = [];
var temp_times          = [];

// Variable to reference the diagram plot
var system_diagram;

// Variable to store the advanced view display
var advanced = false;

///////////////////////////////////////////////////////////////////////////////////
// Handy sets /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// Laser //////////////////////////////////////////////////////////////////////////

var laser_buttons = '"B_LAS_ON",' +
                    '"B_LAS_OFF",' +
                    '"B_LAS_UPDATE"';

// Generator //////////////////////////////////////////////////////////////////////

var generator_ch1_buttons = '"B_GE1_UPDATE",' +
                            '"B_GE1_DEFAULT",' +
                            '"B_GE1_SET",' +
                            '"B_GE1_ON",' +
                            '"B_GE1_OFF"'

var generator_ch2_buttons = '"B_GE2_UPDATE",' +
                            '"B_GE2_DEFAULT",' +
                            '"B_GE2_SET",' +
                            '"B_GE2_ON",' +
                            '"B_GE2_OFF"'                            

var generator_buttons = generator_ch1_buttons + ',' +
                        generator_ch2_buttons

var generator_ch1_parameters =  '"GE1_WVTP",' +
                                '"GE1_AMP",' +
                                '"GE1_OFST",' +
                                '"GE1_FRQ",' +
                                '"GE1_DUTY",' +
                                '"GE1_WIDTH",' +
                                '"GE1_RISE",' +
                                '"GE1_FALL",' +
                                '"GE1_OUT"'

var generator_ch2_parameters = '"GE2_WVTP",' +
                               '"GE2_AMP",' +
                               '"GE2_OFST",' +
                               '"GE2_FRQ",' +
                               '"GE2_DUTY",' +
                               '"GE2_WIDTH",' +
                               '"GE2_RISE",' +
                               '"GE2_FALL",' +
                               '"GE2_OUT"'

var generator_parameters = generator_ch1_parameters + "," +
                           generator_ch2_parameters

// Attenuator /////////////////////////////////////////////////////////////////////

var attenuator_db_buttons = '"B_ATT_DB",' +
                            '"B_ATT_DB_M01",' +
                            '"B_ATT_DB_P01",' +
                            '"B_ATT_DB_M10",' +
                            '"B_ATT_DB_P10"'

var attenuator_percent_buttons = '"B_ATT_PERCENT",' +
                                 '"B_ATT_PERCENT_M01",' +
                                 '"B_ATT_PERCENT_P01",' +
                                 '"B_ATT_PERCENT_M10",' +
                                 '"B_ATT_PERCENT_P10"'

var attenuator_step_buttons = '"B_ATT_POS",' +
                              '"B_ATT_POS_M01",' +
                              '"B_ATT_POS_P01",' +
                              '"B_ATT_POS_M10",' +
                              '"B_ATT_POS_P10"'

var attenuator_buttons = attenuator_db_buttons + ',' + 
                         attenuator_percent_buttons + ',' + 
                         attenuator_step_buttons + ',' +
                         '"B_ATT_UPDATE"';

var attenuator_fields = '"I_ATT_DB","I_ATT_PERCENT","I_ATT_POS"';

// Buffering and state ////////////////////////////////////////////////////////////

// Variable for pushing while editing input
var tmp_value = "";

// Operational
var operational = 0;

// Queue last selected file
var script_file = null;

/////////////////////////////////////////////////////////////////////////////////
// Operational panel functions //////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function set_pwd(value) {
    old_pwd = $('#I_GE1_WIDTH').val();
    $('#I_GE1_WIDTH').val(value);
    if (!check_value("I_GE1_WIDTH")){
        $('#I_GE1_WIDTH').val(old_pwd);
        $('#I_OPE_STEP2_GE1_PWD').val(old_pwd);
        return false;
    }
    commands = '"GEN C1:BSWV WIDTH,' + parseFloat(value) + '","GEN C1:OUTP?","GEN C1:BSWV?"';
    to_refresh = generator_ch1_parameters
    input_disable(to_refresh, generator_ch1_buttons);
    laserServer(commands, to_refresh, 0,
        function() {
            input_enable(to_refresh, generator_ch1_buttons);
        }
    );
}

function set_frq(value) {
    old_pwd = $('#I_GE1_FRQ').val();
    $('#I_GE1_FRQ').val(value);
    if (!check_value("I_GE1_FRQ")){
        $('#I_GE1_FRQ').val(old_pwd);
        $('#I_OPE_STEP2_GE1_FRQ').val(old_pwd);
        return false;
    }
    commands = '"GEN C1:BSWV FRQ,' + parseInt(value) + '","GEN C1:OUTP?","GEN C1:BSWV?"';
    to_refresh = generator_ch1_parameters;
    input_disable(to_refresh, generator_ch1_buttons);
    laserServer(commands, to_refresh, 0,
        function() {
            input_enable(to_refresh, generator_ch1_buttons);
        }
    );
}

/////////////////////////////////////////////////////////////////////////////////
// Form management //////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function tmp_push(object) {
    // Special case for attenuator
    if(object.id == "I_ATT_DB" || object.id == "I_ATT_PERCENT"){
        $('[id="' + object.id + '"]').prop('readonly', false);
    }
    // All the rest
    tmp_value = object.value;
    object.value = "";
}

function hook_disabling(object) {
    switch (object.id) {
        case "I_ATT_DB":
            if (object.value == "") {
                $('[id="I_ATT_DB"]').prop('readonly', true);
            } else {
                if (tmp_value == "") {
                    object.value = object.value + " [dB]";
                }
                $('[id="I_ATT_DB"]').prop('readonly', false);
                $('[id="I_ATT_PERCENT"]').prop('readonly', false);
                $('[id="B_ATT_DB"]').prop('disabled', false);
                $('[id="B_ATT_PERCENT"]').prop('disabled', false);
            }
            break;
        case "I_ATT_PERCENT":
            if (object.value == "") {
                $('[id="I_ATT_PERCENT"]').prop('readonly', true);
            } else {
                if (tmp_value == "") {
                    object.value = object.value;
                }
                $('[id="I_ATT_DB"]').prop('readonly', false);
                $('[id="I_ATT_PERCENT"]').prop('readonly', false);
                $('[id="B_ATT_DB"]').prop('disabled', false);
                $('[id="B_ATT_PERCENT"]').prop('disabled', false);
            }
            break;
        default:
            break;
    }
}

function check_value(id) {
    var reload = true;
    switch (id) {
        case "I_GE1_DUTY":
            freq = parseFloat($("#I_GE1_FRQ").val());
            duty = parseFloat($("#I_GE1_DUTY").val());
            if (duty <= 0 || duty >= 100) {
                alert("ERROR: The duty should be over 0[%] and under 100[%]")
                return false;
            }
            $("#I_GE1_WIDTH").val(duty/freq/100 + " [S]");
            break;
        case "I_OPE_STEP2_GE1_FRQ":
            $('#I_GE1_FRQ').val($('#I_OPE_STEP2_GE1_FRQ').val());
            reload = false;
        case "I_OPE_STEP3_GE1_FRQ":
            if (reload) {
                $('#I_GE1_FRQ').val($('#I_OPE_STEP3_GE1_FRQ').val());
            }
        case "I_GE1_FRQ":
            freq = parseFloat($("#I_GE1_FRQ").val());
            duty = parseFloat($("#I_GE1_DUTY").val());
            if (freq <= 0 ) {
                alert("ERROR: The frequency should be greater than 0[S]")
                $('[id="I_GE1_FRQ"').val(tmp_value);
                return false;
            }
            $("#I_GE1_WIDTH").val(duty/freq/100 + " [S]");
            break;
        case "I_OPE_STEP2_GE1_PWD":
            $('#I_GE1_FRQ').val($('#I_OPE_STEP2_GE1_FRQ').val());
        case "I_GE1_WIDTH":
            freq = parseFloat($("#I_GE1_FRQ").val());
            width = parseFloat($("#I_GE1_WIDTH").val());
            duty = width*freq*100;
            if (width <= 0){
                alert("ERROR: The pulse should be greater than 0[S]")
                $('[id="I_GE1_WIDTH"').val(tmp_value);
                return false;
            }
            if (duty>=100) {
                alert("ERROR: The calculated duty cycle is greater or equal to 100[%]")
                $('[id="I_GE1_WIDTH"').val(tmp_value);
                return false;
            }
            $("#I_GE1_DUTY").val(duty + " [%]");
            break;
        case "I_GE2_DUTY":
            freq = parseFloat($("#I_GE2_FRQ").val());
            duty = parseFloat($("#I_GE2_DUTY").val());
            if (duty <= 0 || duty >= 100) {
                alert("ERROR: The duty should be over 0[%] and under 100[%]")
                return false;
            }
            $("#I_GE2_WIDTH").val(duty/freq/100 + " [S]");
            break;
        case "I_GE2_FRQ":
            freq = parseFloat($("#I_GE2_FRQ").val());
            duty = parseFloat($("#I_GE2_DUTY").val());
            if (freq <= 0 ) {
                alert("ERROR: The frequency should be greater than 0[Hz]")
                return false;
            }
            $("#I_GE2_WIDTH").val(duty/freq/100 + " [S]");
            break;
        case "I_GE2_WIDTH":
            freq = parseFloat($("#I_GE2_FRQ").val());
            width = parseFloat($("#I_GE2_WIDTH").val());
            duty = width*freq*100;
            if (width <= 0){
                alert("ERROR: The pulse should be greater than 0[S]")
                return false;
            }
            if (duty>=100) {
                alert("ERROR: The calculated duty cycle is greater or equal to 100[%]")
                return false;
            }
            $("#I_GE2_DUTY").val(duty + " [%]");
            break;
        case "I_OPE_STEP2_ATT_DB":
            $('#I_ATT_DB').val($('#I_OPE_STEP2_ATT_DB').val());
            reload = false;
        case "I_OPE_STEP3_ATT_DB":
            if (reload) {
                $('#I_ATT_DB').val($('#I_OPE_STEP3_ATT_DB').val());
            }
        case "I_ATT_DB":
            db = parseFloat($("#I_ATT_DB").val());
            if (db < 0 || db > 40) {
                alert("ERROR: Attenuation out of range [0, 40]")
                $('[id="I_ATT_DB"').val(tmp_value);
                return false
            }
            db = Math.round(db*100)/100
            $("#I_ATT_PERCENT").val(Math.round(Math.exp(-db/4.3425121307373)*100*10000)/10000 + " [%]")
            break;
        case "I_ATT_PERCENT":
            percent = parseFloat($("#I_ATT_PERCENT").val());
            if (percent < 0.01 || percent > 100) {
                alert("ERROR: Transference out of range [100, 0.01]")
                return false
            }
            percent = Math.round(percent*10000)/10000
            $("#I_ATT_DB").val(-Math.round(Math.log(percent/100)*4.3425121307373*100)/100 + " [dB]")
            // Back to DB
            db = Math.round(parseFloat($("#I_ATT_DB").val())*100)/100
            $("#I_ATT_PERCENT").val(Math.round(Math.exp(-db/4.3425121307373)*100*10000)/10000 + " [%]")
            // Back to %
            $("#I_ATT_DB").val(-Math.round(Math.log(parseFloat($("#I_ATT_PERCENT").val())/100)*4.3425121307373*100)/100 + " [dB]")
            break;
        default:
            break;
    }
    return true
}

function tmp_pop(object) {
    if (object.value == "") {
        object.value = tmp_value;
    } else {
        object.value = object.value + tmp_value.substr(tmp_value.lastIndexOf(" "));
        if (!check_value(object.id)) {
            object.value = tmp_value;
        }
    }
    hook_disabling(object)
}

///////////////////////////////////////////////////////////////////////////////////
// Attenuator interface functions /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function set_db(value, data) {
    commands = "";
    if (value == "field") {
        if (data) {
            value = data;
        } else if ($('#I_ATT_DB').val() == "") {
            alert("ERROR: Empty dB value");
            return;
        } else {
            value = $('#I_ATT_DB').val();
        }
        commands = '"STA OPE 0",'
    }
    commands = commands + '"ATT A' + Math.round(parseFloat(value)*100)/100 + '","ATT D"';
    to_refresh = '"ATT_LAST","ATT_DB","ATT_PERCENT","ATT_POS"'
    input_disable(to_refresh, attenuator_buttons);
    laserServer(commands, to_refresh, 0,
        function() {
            input_enable(to_refresh, attenuator_buttons + "," + attenuator_fields);
        }
    );
}

function step_db(step) {
    value = parseFloat($('#I_ATT_DB').val());
    step = parseFloat(step);
    newvalue = parseFloat(Math.round((value + step)*100)/100);
    if (newvalue < 0 || newvalue > 40) {
        $('#I_ATT_DB').val(Math.round(((value)*100)/100) + " [dB]");
        alert("ERROR: Applied step gets the dB out of range [0, 40]");
        return;
    }
    set_db('field', newvalue);
    return;
}

function step_percent(step) {
    value = parseFloat($('#I_ATT_PERCENT').val());
    step = parseFloat(step);
    newvalue = value + step;
    $('#I_ATT_PERCENT').val(newvalue);
    if (!check_value("I_ATT_PERCENT")){
        $('#I_ATT_PERCENT').val(value + " [%]");
        return false
    }
    set_db('field');
}

function set_pos() {
    value = parseInt($('#I_ATT_POS').val());
    commands = '"STA OPE 0","ATT S' + value + '","ATT D"';
    to_refresh = '"ATT_LAST","ATT_POS"'
    input_disable(to_refresh, attenuator_buttons);
    laserServer(commands, to_refresh, 0,
        function() {
            input_enable(to_refresh, attenuator_step_buttons + ',"B_ATT_UPDATE"');
        }
    );
    $('#I_ATT_DB').val("");
    $('#I_ATT_PERCENT').val("");
}

function step_pos(step) {
    value = parseInt($('#I_ATT_POS').val());
    step = parseInt(step);
    newvalue = value + step;
    commands = '"STA OPE 0","ATT S' + newvalue + '","ATT D"';
    to_refresh = '"ATT_LAST","ATT_POS","ATT_DB","ATT_PERCENT"'
    input_disable(to_refresh, attenuator_buttons);
    laserServer(commands, to_refresh, 0,
        function() {
            input_enable(to_refresh, attenuator_step_buttons + ',"B_ATT_UPDATE"');
        }
    );
}

///////////////////////////////////////////////////////////////////////////////////
// Generator interface functions //////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function load_default(channel) {
    input_disable(generator_parameters, generator_buttons);
    values = channel_defaults[channel];
    for (var key in values) {
        $('#I_' + key).val(values[key]);
    }
    input_enable(generator_parameters, generator_buttons);
}

function set_parameters(channel) {
    values = channel_defaults[channel];
    to_refresh = "";
    commands = '"STA OPE 0",';
    for (var key in values) {
        value = $('#I_' + key).val();
        value = value.substr(0, value.lastIndexOf(" "));
        if (to_refresh != "") {
            to_refresh = to_refresh + ",";
            commands = commands + ",";
        }
        to_refresh = to_refresh + "\"" + key + '"';
        commands = commands + "\"GEN C" + channel + ":BSWV " + key.substr(key.lastIndexOf("_")+1) + "," + value + "\"";
    }
    commands = commands + ',"GEN C' + channel + ':BSWV?"';
    commands = commands + ',"GEN C' + channel + ':OUTP?"';
    input_disable(generator_parameters, generator_buttons);
    laserServer(commands, to_refresh, 0,
        function() {
            input_enable(generator_parameters, generator_buttons);
        }
    );
}

///////////////////////////////////////////////////////////////////////////////////
// Managing elements readability //////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function input_disable(values, extra_disable) {
     if (values) {
        var arrayValues = values.split(",");
        var arrayLength = arrayValues.length;
        for (var i = 0; i < arrayLength; i++) {
            $('[id=' + arrayValues[i].replace('"', '"I_') + ']').prop('disabled', true);
        }
    }
    if (extra_disable) {
        arrayValues = extra_disable.split(",");
        arrayLength = arrayValues.length;
        for (var i = 0; i < arrayLength; i++) {
            $('[id=' + arrayValues[i] + ']').prop('disabled', true);
        }
    }
    // Extra for coloring an update while on stages 2 or 3
    $('[id^="I_OPE_STEP"]').prop('disabled',  true);
    if (operational == 2) {
        $('[id="I_OPE_STEP2_GE1_FRQ"]').removeClass('uncompleted');
        $('[id="I_OPE_STEP2_GE1_PWD"]').removeClass('uncompleted');
        $('[id="I_OPE_STEP2_ATT_DB"]').removeClass('uncompleted');
    } else if (operational == 3) {
        $('[id="I_OPE_STEP3_GE1_FRQ"]').removeClass('uncompleted');
        $('[id="I_OPE_STEP3_ATT_DB"]').removeClass('uncompleted');
    }
}

function input_enable(values, extra_enabled) {
    if (values) {
        var arrayValues = values.split(",");
        var arrayLength = arrayValues.length;
        for (var i = 0; i < arrayLength; i++) {
            $('[id=' + arrayValues[i].replace('"', '"I_') + ']').prop('disabled', false);
        }
    }
    if (extra_enabled) {
        arrayValues = extra_enabled.split(",");
        arrayLength = arrayValues.length;
        for (var i = 0; i < arrayLength; i++) {
            $('[id=' + arrayValues[i] + ']').prop('disabled', false);
        }
    }
    // Extra for coloring an update while on stages 2 or 3
    if (operational == 2) {
        $('[id="I_OPE_STEP2_GE1_FRQ"]').prop('disabled', false);
        $('[id="I_OPE_STEP2_GE1_PWD"]').prop('disabled', false);
        $('[id="I_OPE_STEP2_ATT_DB"]').prop('disabled',  false);
        $('[id^="I_OPE_STEP2"]').addClass('uncompleted');
    } else if (operational == 3) {
        $('[id="I_OPE_STEP3_GE1_FRQ"]').prop('disabled', false);
        $('[id="I_OPE_STEP3_ATT_DB"]').prop('disabled',  false);
        $('[id^="I_OPE_STEP3"]').addClass('uncompleted');
    }
}

///////////////////////////////////////////////////////////////////////////////////
// Button interactions ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function button_action(source, extra_disable) {
    // Retrieving source parameters
    var req_cmd = source.attr("req_cmd");
    var req_val = source.attr("req_val");
    var req_ope = source.attr("req_ope")
    // Forcing operational status reset
    if (!req_ope){
        if (req_cmd) {
            req_cmd = req_cmd + ',"STA OPE 0"';
        }
    }
    input_disable(req_val, extra_disable);
    laserServer(req_cmd, req_val, 0,
        function() {
            input_enable(req_val, extra_disable);
        }
    );
}

///////////////////////////////////////////////////////////////////////////////////
// Plot ///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function draw_plot() {
    let minX = Math.ceil(Math.min(...temp_times)/60/60)*60*60;
    var ctx = document.getElementById("temperature_plot").getContext('2d');
    temperature_plot = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Diode',
                fill: false,
                data: temp_diode,
                borderColor: 'rgba(0, 173, 159, 1)',
                backgroundColor: 'rgba(0, 173, 159, 1)',
                borderWidth: 2,
                pointRadius: 0,
                showLine: true
            },
            {
                label: 'Crystal',
                fill: false,
                data: temp_crystal,
                borderColor: 'rgba(36, 96, 167, 1)',
                backgroundColor: 'rgba(36, 96, 167, 1)',
                borderWidth: 2,
                pointRadius: 0,
                showLine: true
            },
            {
                label: 'Electronic Sink',
                fill: false,
                data: temp_electronicsink,
                borderColor: 'rgba(246, 82, 117, 1)',
                backgroundColor: 'rgba(246, 82, 117, 1)',
                borderWidth: 2,
                pointRadius: 0,
                showLine: true
            },
            {
                label: 'Heat Sink',
                fill: false,
                data: temp_heatsink,
                borderColor: 'rgba(252, 76, 2, 1)',
                backgroundColor: 'rgba(252, 76, 2, 1)',
                borderWidth: 2,
                pointRadius: 0,
                showLine: true
            }]
        },
        options: {
            responsive:true,
            maintainAspectRatio: false,
            animation: false,
            legend: {
                display: true,
                position: 'bottom'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time [hh:mm]'
                    },
                    ticks: {
                        max: 0,
                        min: minX,
                        stepSize: Math.abs(minX)/6,
                        callback: function(value, index, values) {
                            value = Math.abs(value);
                            sec = value % 60;
                            min = ((value - sec)/60) % 60;
                            hou = (value - min*60 - sec)/60/60
                            if (min<10) {
                                min = '0' + min;
                            }
                            if (hou < 10) {
                                hou = '0' + hou;
                            }
                            return '-' + hou + ':' + min;
                        }
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Temperature [°C]"
                    }
                }]
            }
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////
// Main laserServer interaction tool //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function log_access() {
    $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?',
        function(data) {
            $.post("lib/laserAccess.php", {
                random:  Math.random(),
                request: JSON.stringify(data, null, 2)
            }, /* Callback */ );
        }
    );
}

function update_plot() {
    if (temperature_plot) {
        temperature_plot.data.datasets[0].data = temp_diode;
        temperature_plot.data.datasets[1].data = temp_crystal;
        temperature_plot.data.datasets[2].data = temp_electronicsink;
        temperature_plot.data.datasets[3].data = temp_heatsink;
        minX = Math.ceil(Math.min(...temp_times)/60/60)*60*60;
        temperature_plot.options.scales.xAxes[0].ticks.max = 0;
        temperature_plot.options.scales.xAxes[0].ticks.min = minX;
        temperature_plot.options.scales.xAxes[0].ticks.stepSize = Math.abs(minX)/6;
        temperature_plot.update();
    }
}

function update_temperatures(data) {
    if (data) {
        temp_diode          = [];
        temp_crystal        = [];
        temp_electronicsink = [];
        temp_heatsink       = [];
        var i;
        for (i = 0; i < data["times"].length; i++) { 
            temp_diode.push({x: data["times"][i], y: data["diode"][i]});
            temp_crystal.push({x: data["times"][i], y: data["crystal"][i]});
            temp_electronicsink.push({x: data["times"][i], y: data["electronicsink"][i]});
            temp_heatsink.push({x: data["times"][i], y: data["heatsink"][i]});
        }
        temp_times = data["times"];
    }
}

function update_queue_write(response) {
    if(response["error"]) {
        alert(response["log"][response["log"].length-1]);
    } else {
        $('[id="script"]').html(response["table"]);
    }
}

function update_queue(data, callback) {
    response = {};
    if (data && data["file"]) {
        var file_data = data["file"];
        var form_data = new FormData();
        form_data.append('script', file_data);
        $.ajax({
            url:         'lib/laserQueue.php',
            type:        'post',
            dataType:    'text',
            cache:       false,
            contentType: false,
            processData: false,
            data:        form_data,
            success:
                function(response) {
                    update_queue_write(JSON.parse(response));
                    if (callback) {
                        callback();
                    }
                }
         });
    } else {
        $.post("lib/laserQueue.php", {
            random:  Math.random(),
            request: JSON.stringify(data)
        },
            function(response) {
                update_queue_write(JSON.parse(response));
                if (callback) {
                    callback();
                }
            }
        );
    }
}

function update_diagram () {
    elements = ["L_CAN_DIA_AB", "L_CAN_DIA_BC", "L_CAN_DIA_CD", "L_CAN_DIA_DE", "L_CAN_DIA_DF", "F_CAN_DIA_SCRAMBLER", "F_CAN_DIA_SPLITER", "F_CAN_DIA_GENERATOR", "F_CAN_DIA_LASER", "F_CAN_DIA_ATTENUATOR", "F_CAN_DIA_DIODE"];
    // Cleaning previous settings
    elements.forEach(
        function (element) {
            $('[id="' + element +'"]').removeClass("on");
            $('[id="' + element +'"]').removeClass("warning");
            $('[id="' + element +'"]').removeClass("active");
        }
    );
    // Coloring diagram
    laser_on = $('[id="I_LAS_D"]').val()=="ON"?true:false;
    generator_on = $('[id="I_GE1_OUT"]').val()=="ON"?true:false;
    if (laser_on && !generator_on) {
        $('[id="F_CAN_DIA_LASER"]').addClass("on");
    } else if (!laser_on && generator_on) {
        $('[id="F_CAN_DIA_GENERATOR"]').addClass("on");
        $('[id="F_CAN_DIA_LASER"]').addClass("warning");
        $('[id="L_CAN_DIA_AB"]').addClass("warning");
        alert("WARNING: Please check your Laser status, the Laser it's expected ON when the Signal Generator starts emitting signal")
    } else if (laser_on && generator_on) {
        $('[id="F_CAN_DIA_GENERATOR"]').addClass("on");
        $('[id="F_CAN_DIA_LASER"]').addClass("on");
        $('[id="F_CAN_DIA_SCRAMBLER"]').addClass("on");
        $('[id="F_CAN_DIA_SPLITER"]').addClass("on");
        $('[id="F_CAN_DIA_ATTENUATOR"]').addClass("on");
        $('[id="F_CAN_DIA_DIODE"]').addClass("on");
        $('[id="L_CAN_DIA_AB"]').addClass("active");
        $('[id="L_CAN_DIA_BC"]').addClass("active");
        $('[id="L_CAN_DIA_CD"]').addClass("active");
        $('[id="L_CAN_DIA_DE"]').addClass("active");
        $('[id="L_CAN_DIA_DF"]').addClass("active");
    } 
}

function update_attenuator(){
    // Managing attenuator special blockings
    if ($('[id="I_ATT_LAST"]').val() == "STEP") {
        // Inputs
        $('[id="I_ATT_DB"]').val("");
        $('[id="I_ATT_DB"]').prop("readonly", true);
        $('[id="I_ATT_PERCENT"]').val("");
        $('[id="I_ATT_PERCENT"]').prop("readonly", true);
        // Buttons
        $('[id="B_ATT_DB"]').prop('disabled', true);
        $('[id^="B_ATT_DB"]').prop('disabled', true);
        $('[id="B_ATT_PERCENT"]').prop('disabled', true);
        $('[id^="B_ATT_PERCENT"]').prop('disabled', true);
    } else if ($('[id="ATT_LAST"]').val() == "DB") {
        $('[id="I_ATT_DB"]').prop("readonly", false);
        $('[id="I_ATT_PERCENT"]').prop("readonly", false);
        $('[id^="B_ATT_DB"]').prop('disabled', false);
        $('[id^="B_ATT_PERCENT"]').prop('disabled', false);
    }
}

function update_operational(ope) {
    operational = ope;
    $('[id="S_OPE_STA_OPERATIONAL"]').text((ope > 4)?"Done":(ope == 0)?"Ready":(ope < 0)?"Error":ope);
    $('[id^="B_OPE_STEP"]').attr('disabled', true);
    $('[id^="I_OPE_STEP"]').attr('disabled', true);
    $('[id^="I_OPE_STEP"]').attr('disabled', true);
    $('[id^="B_OPE_STEP"]').removeClass('completed');
    $('[id^="I_OPE_STEP"]').removeClass('completed');
    $('[id^="I_OPE_STEP"]').addClass('uncompleted');
    $('[id^="I_OPE_STEP2"]').val("");
    $('[id^="I_OPE_STEP3"]').val("");
    $('[id="B_OPE_STEP5"]').attr('disabled', false);
    if (ope == 0) {
        $('[id^="B_OPE_STEP0"]').attr('disabled', false);
    }
    if (ope == 1) {
        $('[id^="B_OPE_STEP0"]').attr('disabled', true);
        $('[id^="B_OPE_STEP1"]').attr('disabled', false);
    }
    if (ope == 2) {
        $('[id^="B_OPE_STEP1"]').attr('disabled', true);
        $('[id^="B_OPE_STEP2"]').attr('disabled', false);
        $('[id^="I_OPE_STEP2"]').attr('disabled', false);
        $('[id="I_OPE_STEP2_GE1_FRQ"]').val($('[id="I_GE1_FRQ"]').val());
        $('[id="I_OPE_STEP2_GE1_PWD"]').val($('[id="I_GE1_WIDTH"]').val());
        $('[id="I_OPE_STEP2_ATT_DB"]').val($('[id="I_ATT_DB"]').val());
    }
    if (ope == 3) {
        $('[id^="B_OPE_STEP2"]').attr('disabled', true);
        $('[id^="I_OPE_STEP2"]').attr('disabled', true);
        $('[id^="B_OPE_STEP3"]').attr('disabled', false);
        $('[id^="I_OPE_STEP3"]').attr('disabled', false);
        $('[id="I_OPE_STEP2_GE1_PWD"]').val("");
        $('[id="I_OPE_STEP2_GE1_FRQ"]').val("");
        $('[id="I_OPE_STEP2_ATT_DB"]').val("");
        $('[id="I_OPE_STEP3_GE1_FRQ"]').val($('[id="I_GE1_FRQ"]').val());
        $('[id="I_OPE_STEP3_ATT_DB"]').val($('[id="I_ATT_DB"]').val());
    }
    if (ope == 4) {
        $('[id^="B_OPE_STEP3"]').attr('disabled', true);
        $('[id^="I_OPE_STEP3"]').attr('disabled', true);
        $('[id^="B_OPE_STEP4"]').attr('disabled', false);
        $('[id="I_OPE_STEP3_GE1_FRQ"]').val("");
        $('[id="I_OPE_STEP3_ATT_DB"]').val("");
    }
    if (ope > 0) {
        $('[id^="B_OPE_STEP0"]').addClass('completed');
    }
    if (ope > 1) {
        $('[id^="B_OPE_STEP1"]').addClass('completed');
    }
    if (ope > 2) {
        $('[id^="B_OPE_STEP2"]').addClass('completed');
        $('[id^="I_OPE_STEP2"]').removeClass('uncompleted');
        $('[id^="I_OPE_STEP2"]').addClass('completed');
    }
    if (ope > 3) {
        $('[id^="B_OPE_STEP3"]').addClass('completed');
        $('[id^="I_OPE_STEP3"]').removeClass('uncompleted');
        $('[id^="I_OPE_STEP3"]').addClass('completed');
    }
    if (ope > 4) {
        $('[id^="B_OPE_STEP4"]').addClass('completed');
    }
}

function format_unit(point) {
    if (point in parameter_units) {
        return " " + parameter_units[point];
    } else {
        return "";
    }
}

function update_points(points){
    if (points) {
        $.each(points,
            function(i, point) {
                if (point["value"] != "" && point["value"] != undefined) {
                    var unit = format_unit(point["name"]);
                    var to_write = point["value"] + unit;
                    $('[id="I_' + point["name"] + '"]').val(to_write);
                    $('[id="S_' + point["name"] + '"]').text(to_write);
                    $('[id="T_CAN_DIA_' + point["name"] + '"]').text(to_write);
                    if (to_write == "ON") {
                        $('[id="I_' + point["name"] + '"]').removeClass("info_off");
                        $('[id="I_' + point["name"] + '"]').addClass("info_on");
                    } else if ((to_write == "OFF")) {
                        $('[id="I_' + point["name"] + '"]').removeClass("info_on");
                        $('[id="I_' + point["name"] + '"]').addClass("info_off");
                    }
                }
            }
        );
        update_operational(parseInt(points[0]["value"]));
        update_attenuator();
        update_diagram();
        update_queue();
    }
}

function update_info(data, status){
    var response = JSON.parse(data);
    update_points(response["values"]);
    update_temperatures(response["temperatures"]);
}

function laserServer(req_cmd, req_val, req_tim, callback) {
    update_times = false;
    req = "{";
    req = req + '"values":["STA_OPERATIONAL"'
    if (req_val != "" && req_val != undefined) {
        req = req + ',' + req_val;
    }
    req = req + ']';
    if (req_cmd != "" && req_cmd != undefined) {
        req = req + ',"commands":[' + req_cmd + ']';
    }
    if (req_tim != 0 && req_tim != undefined) {
        req = req + ',"temps":' + req_tim;
        update_times = true;
    }
    req = req + "}";
    $.post("lib/laserServer.php", {
        random:  Math.random(),
        request: req
    },
        function(data, status) {
            update_info(data, status);
            if(update_times) {
                update_plot();
            }
            if (callback) {
                callback();
            }
        }
    );
}

///////////////////////////////////////////////////////////////////////////////////
// Running on load ////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

$(document).ready(
    function() {
        ///////////////////////////////////////////////////////////////////////////
        // Setting up elements ////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////
        // Catch enter for data input
        $('input, select').keypress(
            function(key) {
                if (key.which == 13) {
                    $(this).blur();
                }
            }
        );
        // Refresh all fields
        $('[id^="B_GLO_REFRESH_ALL"]').click(
            function() {
                button_action($(this))
            }
        );
        // Toggle advandec options panel
        $('[id="B_GLO_ADVANCED"').click(
            function() {
                if (advanced) {
                    $('#panel_advanced').fadeOut(420,
                        function() {
                            $('#panel').animate({height: "452px"}, {
                                duration: 420,
                                done: function() {
                                    advanced = false;
                                }
                            });
                        }
                    )
                } else {
                    $('#panel').animate({height: "903px"}, {
                        duration: 420, 
                        done: function() {
                            advanced = true; 
                            $('#panel_advanced').fadeIn(420);
                        }
                    });
                }
            }
        )
        // Canvas /////////////////////////////////////////////////////////////////
        // Go to Diagram
        $('[id="B_CAN_TEM_D"]').click(
            function() {
                $('#canvas_temperature').hide();
                $('#canvas_diagram').show();
                $('#canvas_diagram').find('[id="B_CAN_DIA_D"]').focus();
            }
        )
        // Go to Temperature
        $('[id="B_CAN_DIA_T"]').click(
            function() {
                $('#canvas_diagram').hide();
                $('#canvas_temperature').show();
                $('#canvas_temperature').find('[id="B_CAN_TEM_T"]').focus();
            }
        )
        // Canvas - Temperature Plot //////////////////////////////////////////////
        // Change time period
        $('[id^="B_CAN_TEM_U_"]').click(
            function() {
                laserServer("", "",  $(this).attr("req_tim")*60*60+60);
            }
        );
        // Operational ////////////////////////////////////////////////////////////
        // Operational advancement
        $('[id="B_OPE_STEP0"],[id="B_OPE_STEP1"],[id="B_OPE_STEP2"],[id="B_OPE_STEP3"],[id="B_OPE_STEP4"],[id="B_OPE_STEP5"]').click(
            function() {
                button_action($(this))
            }
        );
        // STEP2 Frequency
        $('[id="B_OPE_STEP2_GE1_FRQ"]').click(
            function() {
                set_frq($('[id="I_OPE_STEP2_GE1_FRQ"]').val())
            }
        )
        // STEP2 Pulse width
        $('[id="B_OPE_STEP2_GE1_PWD"]').click(
            function() {
                set_pwd($('[id="I_OPE_STEP2_GE1_PWD"]').val())
            }
        )
        // STEP2 Attenuation
        $('[id="B_OPE_STEP2_ATT_DB"]').click(
            function() {
                set_db($('[id="I_OPE_STEP2_ATT_DB"]').val())
            }
        )
        // STEP3 Frequency
        $('[id="B_OPE_STEP3_GE1_FRQ"]').click(
            function() {
                set_frq($('[id="I_OPE_STEP3_GE1_FRQ"]').val())
            }
        )
        // STEP3 Attenuation
        $('[id="B_OPE_STEP3_ATT_DB"]').click(
            function() {
                set_db($('[id="I_OPE_STEP3_ATT_DB"]').val())
            }
        )
        // Queue //////////////////////////////////////////////////////////////////
        // Refreshing queue
        $('[id="B_QUE_UPDATE"]').click(
            function() {
                update_queue();
            }
        );
        // Clear queue content
        $('[id="B_QUE_CLEAR"]').click(
            function() {
                update_queue({clear: true});
            }
        );
        // Selecting file
        $('[id="I_QUE_UPLOAD"]').on('change',
            function(event) {
                script_file = event.target.files[0];
            }
        );
        // Uploading file
        $('[id="B_QUE_UPLOAD"]').click(
            function() {
                update_queue({file: script_file});
            }
        );
        // Laser //////////////////////////////////////////////////////////////////
        // On, Off and Update
        $('[id^="B_LAS_"]').click(
            function() {
                button_action($(this), laser_buttons);
            }
        );
        // Generator //////////////////////////////////////////////////////////////
        // Go to channel 1
        $('[id="B_GE2_GE1"]').click(
            function() {
                $('#generator_ch2').hide();
                $('#generator_ch1').show();
                $('[id="B_GE1_GE1"]').focus();
            }
        )
        // Go to channel 2
        $('[id="B_GE1_GE2"]').click(
            function() {
                $('#generator_ch1').hide();
                $('#generator_ch2').show();
                $('[id="B_GE2_GE2"]').focus();
            }
        )
        // Current, set, on and off channel 1
        $('[id="B_GE1_UPDATE"],[id="B_GE1_ON"],[id="B_GE1_OFF"]').click(
            function() {
                button_action($(this), generator_ch1_buttons)
            }
        );
        // Current, set, on and off channel 2
        $('[id="B_GE2_UPDATE"],[id="B_GE2_ON"],[id="B_GE2_OFF"]').click(
            function() {
                button_action($(this), generator_ch2_buttons)
            }
        );
        // Attenuator /////////////////////////////////////////////////////////////
        // Update all action
        $('[id="B_ATT_UPDATE"]').click(
            function() {
                button_action($(this), attenuator_buttons)
            }
        );
        // Step db
        $('[id^="B_ATT_DB_"]').click(
            function() {
                step_db($(this).attr('step'));
            }
        );
        // Step percent
        $('[id^="B_ATT_PERCENT_"]').click(
            function() {
                step_percent($(this).attr('step'));
            }
        );
        // Step pos
        $('[id^="B_ATT_POS_"]').click(
            function() {
                step_pos($(this).attr('step'));
            }
        );

        ///////////////////////////////////////////////////////////////////////////
        // Starting up and enabling system ////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////
        laserServer(startup_commands, startup_values, startup_seconds,
            function() {
                draw_plot();
                input_enable(startup_values);
                $("#panel_loading").fadeOut(500,
                    function() {
                        log_access();
                    }
                );
            }
        );
    }
);
