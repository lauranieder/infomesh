<?php
  $mode = isset($_GET['mode']) ? $_GET['mode'] : null;
  $state = $_SERVER['REQUEST_URI'];
  $bodyClasses = 'show-splashscreen';
?>

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Information mesh</title>
  <meta name="description" content="Information mesh">
  <meta name="author" content="SitePoint">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <!--styles-->
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/style.css">
  <!--script-->
  <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
  <script type="text/javascript" src="js/script.js"></script>

  <script>
    var appMode = "<?= $mode ?>";
  </script>
</head>
<body class="<?= $bodyClasses ?>">
  <div class="splashscreen-title">
    <h5>Infomation mesh — 30 years of facts about the World Wide Web</h5>
  </div>
  <a href="/index" class="splashscreen-main-title">
    <h5 class="enable-caret title-bold"></h5>
  </a>
  <div class="click-to-start">
    <h5>Click to continue</h5>
  </div>

  <div class="iframe-popup">
    <?php echo file_get_contents("css/UI/UICrossiframe.svg"); ?>
    <iframe class="iframe-popup__content" src="" frameborder="0"></iframe>
  </div>

  <header id="navigation" class="not-extended">
    <h1>
      <a id="project-title" href="/">Information mesh</a>
    </h1>
    <nav class="d-none">
      <?php echo file_get_contents("css/UI/UIArrowUp.svg"); ?>
      <?php echo file_get_contents("css/UI/UIArrowDown.svg"); ?>
      <?php echo file_get_contents("css/UI/UIArrowLeftNav.svg"); ?>
    </nav>
    <nav-mobile>
      <?php echo file_get_contents("css/UI/UIMobileArrowUp.svg"); ?>
      <?php echo file_get_contents("css/UI/UIMobileArrowDown.svg"); ?>
      <?php echo file_get_contents("css/UI/UIMobileBurger.svg"); ?>
      <?php echo file_get_contents("css/UI/UIMobileCross.svg"); ?>
    </nav-mobile>
  </header>
  <div id=wrapper>
    <div id="container-side" class="container d-flex side mobile-reduced background-blue">
      <h1 id="container-title" class="content flex-top font-large">
      </h1>
      <div id="container-credit" class="content flex-middle">
        <div id="container-credit-inner">
          <div id="project-text"><p></p></div>
          <div id="project-credits"><p></p></div>
        </div>  
      </div>
      <div id="container-menu" class="content flex-bottom font-large">
        <a href="/index" id="button-open-projects" class="selected">30 years of</a>
        <a href="/about" id="button-open-about" >About</a>
      </div>
    </div>

    <div id="container-projects" class="container d-flex main">
      <div class="project-list"></div>
    </div>
    <div id="container-main" class="container reduced">
      <div id="timeline-cursor">
      </div>
      <div id="timeline-barre">
        <?php echo file_get_contents("css/UI/UIArrowLeft.svg"); ?>
        <?php echo file_get_contents("css/UI/UIArrowRight.svg"); ?>
        <div id="timeline-background"></div>
      </div>
    </div>
    <div id="container-about" class="container reduced background-blue">
      <div id="inside" class="d-flex">
      <div class="content">
        <p>Information Mesh is a web platform celebrating the 30th anniversary of the World Wide Web that explores social, technical, cultural and legal facts throughout different interactive timelines. The project was realized by Media & Interaction Design students at ECAL/University of Art and Design, Lausanne. It was initiated in October 2018 during a one week workshop in partnership with swissnex San Francisco, where students visited key partners and began developing the project.
        </br></br>
        The timelines present an overview of Web history, starting with the proposal for hypertext by Tim Berners-Lee at CERN in 1989, initially under the name "Information Mesh." From this start date, users can then explore 30 years of evolution.
        </br></br>
        The ECAL study group is part of the swissnex Salon, a series of activities exploring the impact of technology on fundamental societal values drawn from the preamble of the Swiss Constitution. This project playfully examines the Utopian idealism at the heart of the Web, reconnecting us to the original optimism surrounding these communication technologies with a critical engagement regarding where we have arrived today. This presents an opportunity to return a collective focus on how we might bring the human back to the center of innovation.
        </p>
      </div>
      <div class="content">
        <div class="full">
          <div class="fit-w half-w">
            <a href="http://ecal.ch" target="_blank">
              <img src="../img/logos/logo_ecal_white.svg" alt="Logo of ECAL" class="logo">
            </a>
          </div>
          <div class="fit-w half-w">
            <a href="https://www.swissnexsanfrancisco.org" target="_blank">
              <img src="../img/logos/logo_swissnex_white.svg" alt="Logo of Swissnex San Francisco" class="logo">
            </a>
          </div>
        </div>
        <div class="full">
        <br>
          <h4>ECAL Faculty</h4>
          <p>Vincent Jacquier, Pauline Saglio, Laura Perrenoud, Tibor Udvari, Pietro Alberti</p></br>
          <h4>swissnex Team</h4>
          <p>Benjamin Bollmann, Mary Ellyn Johnson, Eryk Salvaggio</p></br>
          <h4>ECAL Students</h4>
          <p>Al Zouabi Alfatih, Becheras Diane, Bisseck Iyo, Boulenaz Jonathan, Breithaupt Kevin, Chenaux Maëlle, Matos Sébastien, Mouthon Bastien, Palauqui Mathieu, Sassoli De Bianchi Luca, Simmen Guillaume, Virág Tamara, Vogel Nathan, Zibaut Anouk</p></br>
        </div>
        <div class="full">
          <h4>Partners</h4>
          <p>Volker Eckl and Jan Gerlach, Wikimedia</p>
          <p>Amir Saber Esfahani, Internet Archive</p>
        </div>
        <div class="logos">
          <a href="https://archive.org/" target="_blank">
            <img src="../img/logos/logo_archive_white.svg" alt="Logo of the internet archive" class="logo logo-bottom">
          </a>
          <a href="https://wikimediafoundation.org/" target="_blank">
            <img src="../img/logos/logo_wikimedia_white.svg" alt="Logo of the Wikimedia foundation" class="logo logo-bottom logo-bottom-middle">
          </a>
          <a href="https://vd.ch" target="_blank">
            <img src="../img/logos/logo_vd_white.svg" alt="Logo of the Canton of Vaud" class="logo logo-bottom">
          </a>
        </div>

      </div>
      </div>
    </div>
    <script type="text/javascript" src="./js/splashscreen.js"></script>
  </body>
</html>
