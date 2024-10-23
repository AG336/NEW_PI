
<html>
    <head>
        <link rel="icon" href="">
        <!--- Styles --->
        <link rel="stylesheet" href="css/bootstrap.v4.1.3.min.css"/>
        <link rel="stylesheet" href="css/style.css"/>
        <!--- Scripts --->
        <script src="src/jquery.v3.3.1.min.js"></script>
        <script src="src/chart.v2.7.3.js"></script>
        <script src="src/main.js"></script>
    </head>
    <body>
        <div id="container">
            <div id="container_cell">
                <div id="panel">
                    <div id="panel_loading">
                        <div id="loading_table">
                            <div id="loading_table_cell">
                                <p>
                                    <img src="img/henlab.png" width="210px">
                                </p>
                                <p>
                                    <img src="img/progress.svg">
                                </p>
                            </div>
                        </div>
                    </div>
                    <div id="panel_operation">
                        <div id="canvas" class="panel_section">
                            <div class="title">
                                <div class="title_table">
                                    <div class="title_table_cell">
                                        System diagram and Temperature plots
                                    </div>
                                </div>
                            </div>
                            <div class="content">
                                <div id="canvas_diagram">
                                    <div id="diagram_drawing">
                                        <svg id="system_diagram">
                                            <!--- Connection Lines -->
                                            <g style="stroke-width:5px;stroke:#000;stroke-linecap:square;">
                                                <!--- Generator to Laser --->
                                                <line x1="10%" y1="75%" x2="30%" y2="75%" id="L_CAN_DIA_AB"/>
                                                <!--- Laser to Scrambler --->
                                                <line x1="30%" y1="75%" x2="50%" y2="75%" id="L_CAN_DIA_BC"/>
                                                <!--- Scrambler to Spliter --->
                                                <line x1="50%" y1="75%" x2="70%" y2="75%" id="L_CAN_DIA_CD"/>
                                                <!--- Spliter to Attenuator --->
                                                <line x1="70%" y1="75%" x2="90%" y2="75%" id="L_CAN_DIA_DE"/>
                                                <!--- Spliter to Photodiode --->
                                                <line x1="70%" y1="25%" x2="90%" y2="25%" id="L_CAN_DIA_DF"/>
                                                <line x1="70%" y1="25%" x2="70%" y2="75%" id="L_CAN_DIA_DF"/>
                                            </g>
                                            <!--- Base Elements --->
                                            <g style="fill:#DDD;">
                                                <circle cx="50%" cy="75%" r="8%"                   id="F_CAN_DIA_SCRAMBLER"/>
                                                <circle cx="70%" cy="75%" r="8%"                   id="F_CAN_DIA_SPLITER"/>
                                                <rect    x="2%"   y="55%" width="16%" height="40%" id="F_CAN_DIA_GENERATOR"/>
                                                <rect    x="22%"  y="55%" width="16%" height="40%" id="F_CAN_DIA_LASER"/>
                                                <rect    x="82%"  y="55%" width="16%" height="40%" id="F_CAN_DIA_ATTENUATOR"/>
                                                <rect    x="82%"  y="5%"  width="16%" height="40%" id="F_CAN_DIA_DIODE"/>
                                            <g>
                                            <!--- Title Boxes --->
                                            <g style="fill:#AAA;">
                                                <rect x="2%"  y="55%" width="16%" height="10%"/>
                                                <rect x="22%" y="55%" width="16%" height="10%"/>
                                                <rect x="82%" y="55%" width="16%" height="10%"/>
                                                <rect x="82%" y="5%"  width="16%" height="10%"/>
                                            </g>
                                            <!--- Texts --->
                                            <g>
                                                <text x="10%" y="60%"                           >Generator</text>
                                                <text x="10%" y="70%" id="T_CAN_DIA_GE1_WIDTH"  ></text>
                                                <text x="10%" y="80%" id="T_CAN_DIA_GE1_FRQ"    ></text>
                                                <text x="10%" y="90%" id="T_CAN_DIA_GE1_OUT"    ></text>
                                                <text x="30%" y="60%"                           >Laser</text>    
                                                <text x="30%" y="80%" id="T_CAN_DIA_LAS_D"      ></text>
                                                <text x="50%" y="75%"                           >Scrambler</text>
                                                <text x="70%" y="75%"                           >Spliter</text>
                                                <text x="90%" y="60%"                           >Attenuator</text>
                                                <text x="90%" y="75%" id="T_CAN_DIA_ATT_DB"     ></text>
                                                <text x="90%" y="85%" id="T_CAN_DIA_ATT_PERCENT"></text>
                                                <text x="90%" y="10%"                           >Photodiode</text>
                                                <text x="90%" y="30%" id="T_CAN_DIA_LAS_D"      ></text>
                                            </g>
                                        </svg>
                                    </div>
                                    <div class="canvas_menu">
                                        <button id="B_CAN_DIA_D" class="canvas_menu canvas_single">D</button><!---
                                    ---><button id="B_CAN_DIA_T" class="canvas_menu canvas_single">T</button>
                                    </div>
                                </div>
                                <div id="canvas_temperature">
                                    <div id="temperature_drawing">
                                        <canvas id="temperature_plot"></canvas>
                                    </div>
                                    <div class="canvas_menu">
                                        <button id="B_CAN_TEM_U_1"  req_tim="1"  class="canvas_menu"              >1H</button><!---
                                    ---><button id="B_CAN_TEM_U_6"  req_tim="6"  class="canvas_menu"              >6H</button><!---
                                    ---><button id="B_CAN_TEM_U_12" req_tim="12" class="canvas_menu"              >12H</button><!---
                                    ---><button id="B_CAN_TEM_U_24" req_tim="24" class="canvas_menu"              >24H</button><!---
                                    ---><button id="B_CAN_TEM_U_48" req_tim="48" class="canvas_menu"              >48H</button><!---
                                    ---><button id="B_CAN_TEM_U_96" req_tim="96" class="canvas_menu"              >96H</button><!---
                                    ---><button id="B_CAN_TEM_D"    req_tim="1"  class="canvas_menu canvas_single">D</button><!---
                                    ---><button id="B_CAN_TEM_T"    req_tim="1"  class="canvas_menu canvas_single">T</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="operationalcontrol" class="panel_section">
                            <div class="title">
                                <div class="title_table">
                                    <div class="title_table_cell">
                                        Operational Control
                                    </div>
                                </div>
                            </div>
                            <div class="content">
                                <ul class="device">
                                    <li class="title">
                                        Reset system to get a known default status
                                    </li>
                                    <li>
                                        <button id="B_OPE_STEP0" class="full" req_ope="set" req_cmd='"STA OPE 1","GEN SSSD 0","GEN C1:OUTP OFF","GEN C1:BSWV AMP,5","GEN C1:BSWV OFST,2.5","GEN C1:BSWV DUTY,10","GEN C1:BSWV WIDTH,0.0001","GEN C1:BSWV RISE,2.68e-08","GEN C1:BSWV FALL,1.68e-08","GEN C1:BSWV OUT,","GEN C1:BSWV?","GEN C1:OUTP?"' req_val='"GE1_WVTP","GE1_AMP","GE1_OFST","GE1_FRQ","GE1_DUTY","GE1_WIDTH","GE1_RISE","GE1_FALL","GE1_OUT"'>Set Default</button>
                                    </li>
                                    <li class="title">
                                        1. Enable Laser pulsing
                                    </li>
                                    <li>
                                        <button id="B_OPE_STEP1" class="full" req_ope="set" req_cmd='"STA OPE 2","LAS SSSD 1"' req_val='"LAS_D"'>Enable Pulsing</button>
                                    </li>
                                    <li class="title">
                                        2. Set frequency, attenuation and pulse width
                                    </li>
                                    <li>
                                        <input disabled id="I_OPE_STEP2_GE1_FRQ" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)"><!---
                                    ---><button id="B_OPE_STEP2_GE1_FRQ">Set Frequency</button>
                                    </li>
                                    <li>
                                        <input disabled id="I_OPE_STEP2_GE1_PWD" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)"><!---
                                    ---><button id="B_OPE_STEP2_GE1_PWD">Set Pulse Width</button>
                                    </li>
                                    <li>
                                        <input disabled id="I_OPE_STEP2_ATT_DB" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)"><!---
                                    ---><button id="B_OPE_STEP2_ATT_DB">Set Attenuation</button>
                                    </li>
                                    <li class="title">
                                        Turn on the signal generator to start pulsing
                                    </li>
                                    <li>
                                        <button id="B_OPE_STEP2" class="full" req_ope="set" req_cmd='"STA OPE 3","GEN C1:OUTP ON","GEN C1:OUTP?","GEN C1:BSWV?"' req_val='"GE1_WVTP","GE1_AMP","GE1_OFST","GE1_FRQ","GE1_DUTY","GE1_WIDTH","GE1_RISE","GE1_FALL","GE1_OUT"'>Turn ON Signal Generator</button>
                                    </li>
                                    <li class="title">
                                        3. Adjust the pulsing frequency and attenuation
                                    </li>
                                    <li>
                                        <input disabled id="I_OPE_STEP3_GE1_FRQ" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)"><!---
                                    ---><button id="B_OPE_STEP3_GE1_FRQ" req_ope="set">Adjust Frequency</button>
                                    </li>
                                    <li>
                                        <input disabled id="I_OPE_STEP3_ATT_DB" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)"><!---
                                    ---><button id="B_OPE_STEP3_ATT_DB" req_ope="set">Adjust Attenuation</button>
                                    </li>
                                    <li class="title">
                                        Turn off Signal Generator to stop pulsing
                                    </li>
                                    <li>
                                        <button id="B_OPE_STEP3" class="full" req_ope="set" req_cmd='"STA OPE 4","GEN C1:OUTP OFF","GEN C1:OUTP?","GEN C1:BSWV?"' req_val='"GE1_WVTP","GE1_AMP","GE1_OFST","GE1_FRQ","GE1_DUTY","GE1_WIDTH","GE1_RISE","GE1_FALL","GE1_OUT"'>Turn OFF Signal Generator</button>
                                    </li>
                                    <li class="title">
                                        4. Disable Laser pulsing
                                    </li>
                                    <li>
                                        <button id="B_OPE_STEP4" class="full" req_ope="set" req_cmd='"STA OPE 5","LAS SSSD 0"' req_val='"LAS_D"'>Disable Laser Pulsing</button>
                                    </li>
                                    <li>
                                        <span class="center">Current Status: <span id="S_OPE_STA_OPERATIONAL">?</span></span><!---
                                    ---><button id="B_OPE_STEP5" class="align-bottom" req_cmd='"LAS GEMT","LAS GMTE","LAS GTCO","LAS GSER","GEN C1:OUTP?","GEN C1:BSWV?","GEN C2:OUTP?","GEN C2:BSWV?","ATT D"' req_val='"LAS_GEMT_SUPPLY","LAS_GEMT_EMITING","LAS_GMTE_DIODE","LAS_GMTE_CRYSTAL","LAS_GMTE_ELECTRONICSINK","LAS_GMTE_HEATSINK","LAS_TEC1","LAS_TEC2","LAS_GSER_ERROR1","LAS_GSER_ERROR2","LAS_GSER_ERROR3","LAS_GSER_INFO1","LAS_GSER_INFO2","LAS_GSER_INFO3","LAS_D","GE1_WVTP","GE1_AMP","GE1_OFST","GE1_FRQ","GE1_DUTY","GE1_WIDTH","GE1_RISE","GE1_FALL","GE1_OUT","GE2_WVTP","GE2_AMP","GE2_OFST","GE2_FRQ","GE2_DUTY","GE2_WIDTH","GE2_RISE","GE2_FALL","GE2_OUT","ATT_DB","ATT_PERCENT","ATT_POS","ATT_LAST"'>Restart Operation</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id="queue" class="panel_section">
                            <div class="title">
                                <div class="title_table">
                                    <div class="title_table_cell">
                                        Queue
                                    </div>
                                </div>
                            </div>
                            <div class="content">
                                <div id="script_container">
                                    <table id="script">
                                    </table>
                                </div>
                                <ul class="device">
                                    <li>
                                        <!---
                                    ---><button id="" class="align-top quarter"></button><!---
                                    ---><button id="" class="align-top quarter"></button><!---
                                    ---><button id="" class="align-top quarter"></button><!---
                                    ---><button id="" class="align-top quarter"></button><!---
                                    </li>
                                    <li>
                                    ---><button id="B_QUE_UPDATE" class="align-top quarter">Update</button><!---
                                    ---><button id="B_QUE_CLEAR"  class="align-top quarter">Clear</button><!---
                                    ---><label for="I_QUE_UPLOAD" class="align-bottom inputfile">Select</label><input id="I_QUE_UPLOAD" name="I_QUE_UPLOAD" type="file" class="inputfile"></button><!---
                                    ---><button id="B_QUE_UPLOAD" class="align-top quarter">Upload</button>
                                    </li>
                            </div>
                        </div>
                    </div>
                    <div id="panel_advanced">
                        <div id="laser" class="panel_section">
                            <div class="title">
                                <div class="title_table">
                                    <div class="title_table_cell">
                                        Laser
                                    </div>
                                </div>
                            </div>
                            <div class="content">
                                <div id="laser_left">
                                    <ul class="device">
                                        <li class="title">
                                            Times
                                        </li>
                                        <li>
                                            <span>Supply Time</span><!---
                                        ---><input disabled readonly id="I_LAS_GEMT_SUPPLY">
                                        </li>
                                        <li>
                                            <span>Emitting</span><!---
                                        ---><input disabled readonly id="I_LAS_GEMT_EMITING">
                                        </li>
                                        <li class="title">
                                            Temperatures
                                        </li>
                                        <li>
                                            <span>Diode</span><!---
                                        ---><input disabled readonly id="I_LAS_GMTE_DIODE" >
                                        </li>
                                        <li>
                                            <span>Crystal</span><!---
                                        ---><input disabled readonly id="I_LAS_GMTE_CRYSTAL">
                                        </li>
                                        <li>
                                            <span>Electronic Sink</span><!---
                                        ---><input disabled readonly id="I_LAS_GMTE_ELECTRONICSINK">
                                        </li>
                                        <li>
                                            <span>Heat Sink</span><!---
                                        ---><input disabled readonly id="I_LAS_GMTE_HEATSINK">
                                        </li>
                                        <li class="title">
                                            Temperature Control
                                        </li>
                                        <li>
                                            <span>Control TEC 1</span><!---
                                        ---><input disabled readonly id="I_LAS_TEC1" >
                                        </li>
                                        <li>
                                            <span>Control TEC 2</span><!---
                                        ---><input disabled readonly id="I_LAS_TEC2">
                                        </li>
                                        <li class="title">
                                            Errors and Informations
                                        </li>
                                        <li>
                                            <span>Error 1</span><!---
                                        ---><input disabled readonly id="I_LAS_GSER_ERROR1">
                                        </li>
                                        <li>
                                            <span>Error 2</span><!---
                                        ---><input disabled readonly id="I_LAS_GSER_ERROR2">
                                        </li>
                                        <li>
                                            <span>Error 2</span><!---
                                        ---><input disabled readonly id="I_LAS_GSER_ERROR3">
                                        </li>
                                        <li>
                                            <span>Info 1</span><!---
                                        ---><input disabled readonly id="I_LAS_GSER_INFO1">
                                        </li>
                                        <li>
                                            <span>Info 2</span><!---
                                        ---><input disabled readonly id="I_LAS_GSER_INFO2">
                                        </li>
                                        <li>
                                            <span>Info 3</span><!---
                                        ---><input disabled readonly id="I_LAS_GSER_INFO3">
                                        </li>
                                    </ul>
                                </div>
                                <div id="laser_right">
                                    <ul class="device">
                                        <li class="title">
                                            Pulsing
                                        </li>
                                        <li>
                                            <span>Status</span><!---
                                        ---><input disabled readonly id="I_LAS_D">
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_LAS_ON" class="align-top" req_cmd='"LAS SSSD 1","LAS GEMT","LAS GMTE","LAS GTCO","LAS GSER"' req_val='"LAS_GEMT_SUPPLY","LAS_GEMT_EMITING","LAS_GMTE_DIODE","LAS_GMTE_CRYSTAL","LAS_GMTE_ELECTRONICSINK","LAS_GMTE_HEATSINK","LAS_TEC1","LAS_TEC2","LAS_GSER_ERROR1","LAS_GSER_ERROR2","LAS_GSER_ERROR3","LAS_GSER_INFO1","LAS_GSER_INFO2","LAS_GSER_INFO3","LAS_D"'>Turn ON</button>
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_LAS_OFF" class="align-top" req_cmd='"LAS SSSD 0","LAS GEMT","LAS GMTE","LAS GTCO","LAS GSER"' req_val='"LAS_GEMT_SUPPLY","LAS_GEMT_EMITING","LAS_GMTE_DIODE","LAS_GMTE_CRYSTAL","LAS_GMTE_ELECTRONICSINK","LAS_GMTE_HEATSINK","LAS_TEC1","LAS_TEC2","LAS_GSER_ERROR1","LAS_GSER_ERROR2","LAS_GSER_ERROR3","LAS_GSER_INFO1","LAS_GSER_INFO2","LAS_GSER_INFO3","LAS_D"'>Turn OFF</button>
                                        </li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_LAS_UPDATE" class="align-top" req_ope="set" req_cmd='"LAS GEMT","LAS GMTE","LAS GTCO","LAS GSER"' req_val='"LAS_GEMT_SUPPLY","LAS_GEMT_EMITING","LAS_GMTE_DIODE","LAS_GMTE_CRYSTAL","LAS_GMTE_ELECTRONICSINK","LAS_GMTE_HEATSINK","LAS_TEC1","LAS_TEC2","LAS_GSER_ERROR1","LAS_GSER_ERROR2","LAS_GSER_ERROR3","LAS_GSER_INFO1","LAS_GSER_INFO2","LAS_GSER_INFO3","LAS_D"'>Update</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id="generator" class="panel_section">
                            <div class="title">
                                <div class="title_table">
                                    <div class="title_table_cell">
                                        Generator
                                    </div>
                                </div>
                            </div>
                            <div class="content">
                                <div id="generator_ch1">
                                    <ul class="device">
                                        <li class="title">
                                            Select Channel
                                        </li>
                                        <li>
                                            <button id="B_GE1_GE1" class="highlight">Channel 1</button><!---
                                        ---><button id="B_GE1_GE2">Channel 2</button>
                                        </li>
                                        <li class="title">
                                            Channel 1
                                        </li>
                                        <li>
                                            <span>Wave</span><!---
                                        ---><select id="I_GE1_WVTP">
                                                <option>PULSE</option>
                                            </select>
                                        </li>
                                        <li>
                                            <span>Amplitude</span><!---
                                        ---><input disabled id="I_GE1_AMP" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Offset</span><!---
                                        ---><input disabled id="I_GE1_OFST" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Frequency</span><!---
                                        ---><input disabled id="I_GE1_FRQ" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Duty</span><!---
                                        ---><input disabled id="I_GE1_DUTY" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Pulse Width</span><!---
                                        ---><input disabled id="I_GE1_WIDTH" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Rise</span><!---
                                        ---><input disabled id="I_GE1_RISE" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Fall</span><!---
                                        ---><input disabled id="I_GE1_FALL" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Output</span><!---
                                        ---><input disabled readonly id="I_GE1_OUT">
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_GE1_UPDATE" class="align-top" req_ope="set" req_cmd='"GEN C1:OUTP?","GEN C1:BSWV?"' req_val='"GE1_WVTP","GE1_AMP","GE1_OFST","GE1_FRQ","GE1_DUTY","GE1_WIDTH","GE1_RISE","GE1_FALL","GE1_OUT"'>Get Current</button>
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_GE1_DEFAULT" class="align-top" onclick="load_default(1)">Load Default</button>
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_GE1_SET" class="align-top" onclick="set_parameters(1)">Set Parameters</button>
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_GE1_ON" class="align-top" req_cmd='"GEN C1:OUTP ON","GEN C1:OUTP?","GEN C1:BSWV?"' req_val='"GE1_WVTP","GE1_AMP","GE1_OFST","GE1_FRQ","GE1_DUTY","GE1_WIDTH","GE1_RISE","GE1_FALL","GE1_OUT"'>Turn ON</button>
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_GE1_OFF" class="align-top" req_cmd='"GEN C1:OUTP OFF","GEN C1:OUTP?","GEN C1:BSWV?"' req_val='"GE1_WVTP","GE1_AMP","GE1_OFST","GE1_FRQ","GE1_DUTY","GE1_WIDTH","GE1_RISE","GE1_FALL","GE1_OUT"'>Turn OFF</button>
                                        </li>
                                    </ul>
                                </div>
                                <div id="generator_ch2">
                                    <ul class="device">
                                        <li class="title">
                                            Select Channel
                                        </li>
                                        <li>
                                            <button id="B_GE2_GE1">Channel 1</button><!---
                                        ---><button id="B_GE2_GE2" class="highlight">Channel 2</button>
                                        </li>
                                        <li class="title">
                                            Channel 2
                                        </li>
                                        <li>
                                            <span>Wave</span><!---
                                        ---><select id="I_GE2_WVTP">
                                                <option>PULSE</option>
                                            </select>
                                        </li>
                                        <li>
                                            <span>Amplitude</span><!---
                                        ---><input disabled id="I_GE2_AMP" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Offset</span><!---
                                        ---><input disabled id="I_GE2_OFST" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Frequency</span><!---
                                        ---><input disabled id="I_GE2_FRQ" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Duty</span><!---
                                        ---><input disabled id="I_GE2_DUTY" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Pulse Width</span><!---
                                        ---><input disabled id="I_GE2_WIDTH" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Rise</span><!---
                                        ---><input disabled id="I_GE2_RISE" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Fall</span><!---
                                        ---><input disabled id="I_GE2_FALL" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                        </li>
                                        <li>
                                            <span>Output</span><!---
                                        ---><input disabled readonly id="I_GE2_OUT">
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_GE2_UPDATE" class="align-top" req_ope="set" req_cmd='"GEN C2:OUTP?","GEN C2:BSWV?"' req_val='"GE2_WVTP","GE2_AMP","GE2_OFST","GE2_FRQ","GE2_DUTY","GE2_WIDTH","GE2_RISE","GE2_FALL","GE2_OUT"'>Get Current</button>
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_GE2_DEFAULT" class="align-top" onclick="load_default(2)">Load Default</button>
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_GE2_SET" class="align-top" onclick="set_parameters(2)">Set Parameters</button>
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_GE2_ON" class="align-top" req_cmd='"GEN C2:OUTP ON","GEN C2:OUTP?","GEN C2:BSWV?"' req_val='"GE2_WVTP","GE2_AMP","GE2_OFST","GE2_FRQ","GE2_DUTY","GE2_WIDTH","GE2_RISE","GE2_FALL","GE2_OUT"'>Turn ON</button>
                                        </li>
                                        <li>
                                            <span class="align-bottom"></span><!---
                                        ---><button id="B_GE2_OFF" class="align-top" req_cmd='"GEN C2:OUTP OFF","GEN C2:OUTP?","GEN C2:BSWV?"' req_val='"GE2_WVTP","GE2_AMP","GE2_OFST","GE2_FRQ","GE2_DUTY","GE2_WIDTH","GE2_RISE","GE2_FALL","GE2_OUT"'>Turn OFF</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id="attenuator" class="panel_section">
                            <div class="title">
                                <div class="title_table">
                                    <div class="title_table_cell">
                                        Attenuator
                                    </div>
                                </div>
                            </div>
                            <div class="content">
                                <ul class="device">
                                    <li class="title">
                                        Handling by dB
                                    </li>
                                    <li>
                                        <span>Current dB</span><!---
                                    ---><input disabled id="I_ATT_DB" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                    </li>
                                    <li>
                                        <span class="align-bottom"></span><!---
                                    ---><button id="B_ATT_DB" class="align-top" onclick="set_db('field')">Set dB</button>
                                    </li>
                                    <li>
                                        <span class="align-bottom"></span><!---
                                    ---><button id="B_ATT_DB_M01" class="align-top quarter" step='-0.1'>-0.1[dB]</button><!---
                                    ---><button id="B_ATT_DB_P01" class="align-top quarter" step='+0.1'>+0.1[dB]</button>
                                    </li>
                                    <li>
                                        <span class="align-bottom"></span><!---
                                    ---><button id="B_ATT_DB_M10" class="align-top quarter" step='-1'>-1[dB]</button><!---
                                    ---><button id="B_ATT_DB_P10" class="align-top quarter" step='+1'>+1[dB]</button>
                                    </li>
                                    <li class="title">
                                        Handling by Transference (OUT/IN)%
                                    </li>
                                    <li>
                                        <span>Current Transference %</span><!---
                                    ---><input disabled id="I_ATT_PERCENT" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                    </li>
                                    <li>
                                        <span class="align-bottom"></span><!---
                                    ---><button id="B_ATT_PERCENT" class="align-top" onclick="set_db('field')">Set %</button>
                                    </li>
                                    <li>
                                        <span class="align-bottom"></span><!---
                                    ---><button id="B_ATT_PERCENT_M01" class="align-top quarter" step="-1">-1[%]</button><!---
                                    ---><button id="B_ATT_PERCENT_P01" class="align-top quarter" step="+1">+1[%]</button>
                                    </li>
                                    <li>
                                        <span class="align-bottom"></span><!---
                                    ---><button id="B_ATT_PERCENT_M10" class="align-top quarter" step="-10">-10[%]</button><!---
                                    ---><button id="B_ATT_PERCENT_P10" class="align-top quarter" step="+10">+10[%]</button>
                                    </li>
                                    <li class="title">
                                        Handling by Step
                                    </li>
                                    <li>
                                        <span>Current Position Step</span><!---
                                    ---><input disabled id="I_ATT_POS" onfocusin="tmp_push(this)" onfocusout="tmp_pop(this)">
                                    </li>
                                    <li>
                                        <span class="align-bottom"></span><!---
                                    ---><button id="B_ATT_POS" class="align-top" onclick="set_pos()">Set Position</button>
                                    </li>
                                    <li>
                                        <span class="align-bottom"></span><!---
                                    ---><button id="B_ATT_POS_M01" class="align-top quarter" step="-1">-1</button><!---
                                    ---><button id="B_ATT_POS_P01" class="align-top quarter" step="+1">+1</button>
                                    </li>
                                    <li>
                                        <span class="align-bottom"></span><!---
                                    ---><button id="B_ATT_POS_M10" class="align-top quarter" step="-10">-10</button><!---
                                    ---><button id="B_ATT_POS_P10" class="align-top quarter" step="+10">+10</button>
                                    </li>
                                    <li></li>
                                    <li>
                                        <span>Last Command</span><!---
                                    ---><input disabled readonly id="I_ATT_LAST" >
                                    </li>
                                    <li>
                                        <span class="align-bottom"></span><!---
                                    ---><button id="B_ATT_UPDATE" class="align-top" req_ope="set" req_cmd='"ATT D"' req_val='"ATT_LAST","ATT_DB","ATT_POS","ATT_PERCENT"'>Update</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="underbar">
                    <button id="B_GLO_REFRESH_ALL" class="advanced" req_ope='set' req_cmd='"LAS GEMT","LAS GMTE","LAS GTCO","LAS GSER","GEN C1:OUTP?","GEN C1:BSWV?","GEN C2:OUTP?","GEN C2:BSWV?","ATT D"' req_val='"LAS_GEMT_SUPPLY","LAS_GEMT_EMITING","LAS_GMTE_DIODE","LAS_GMTE_CRYSTAL","LAS_GMTE_ELECTRONICSINK","LAS_GMTE_HEATSINK","LAS_TEC1","LAS_TEC2","LAS_GSER_ERROR1","LAS_GSER_ERROR2","LAS_GSER_ERROR3","LAS_GSER_INFO1","LAS_GSER_INFO2","LAS_GSER_INFO3","LAS_D","GE1_WVTP","GE1_AMP","GE1_OFST","GE1_FRQ","GE1_DUTY","GE1_WIDTH","GE1_RISE","GE1_FALL","GE1_OUT","GE2_WVTP","GE2_AMP","GE2_OFST","GE2_FRQ","GE2_DUTY","GE2_WIDTH","GE2_RISE","GE2_FALL","GE2_OUT","ATT_DB","ATT_PERCENT","ATT_POS","ATT_LAST"'>Refresh All</button><!---
                ---><button id="B_GLO_ADVANCED" class="advanced">Advanced Options</button>
                </div>
            </div>
        </div>
    </body>
</html>
