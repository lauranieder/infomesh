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
    var websiteMode = "<?= $_GET ? $_GET['mode'] : 'undefined'; ?>";
    var currentPagetName = "<? echo str_replace('/', '', $_SERVER['REQUEST_URI']); ?>";
  </script>
</head>
<?
  $initClass = $_SERVER['REQUEST_URI'] == '/' ? 'show-splashscreen' : '';
?>
<body class="<? echo $initClass ?>">
  <div class="splashscreen-title">
    <h5>Infomation mesh — 30 years of facts about the World Wide Web</h5>
  </div>
  <div class="splashscreen-main-title">
    <h5 class="enable-caret title-bold"></h5>
  </div>
  <div class="click-to-start">
    <h5>Click to continue</h5>
  </div>

  <div class="iframe-popup">
    <?php echo file_get_contents("css/UI/UICrossiframe.svg"); ?>
    <iframe class="iframe-popup__content" src="" frameborder="0"></iframe>
  </div>

  <!--<div id="smartphone">mobile</div>-->
  <header id="navigation">
    <h1 id="project-title">Information mesh</h1>
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
      <!--<a href="#" id="button-menu" class="open">&lt;open menu&gt;</a>-->
    </nav-mobile>
  </header>
  <div id=wrapper>
    <div id="container-side" class="container d-flex side mobile-reduced background-blue">
      <h1 id="container-title" class="content flex-top font-large">
      </h1>
      <div id="container-credit" class="content flex-middle">
        <div id="project-text"><p></p></div>
        <div id="project-credits"><p></p></div>
      </div>
      <div id="container-menu" class="content flex-bottom font-large">
        <a href="#" id="button-open-projects" class="selected">30 years of</a>
        <a href="#" id="button-open-about" >About</a>
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
      </div>
    </div>
    <div id="container-about" class="container d-flex reduced background-blue">
      <div class="content">
        <p>The Information Mesh site celebrates the 30th anniversary of CERN's creation of the World Wide Web by creating a social, technical, cultural, and legal timeline of Web history. Within this timeline, key historical developments are brought to life through interactive experiences created by Interaction Design students at the Swiss design school ECAL. 17 students came to San Francisco in October 2018 for a week-long study tour organized by swissnex San Francisco, where they visited key data visualization companies and partners and began to developing the project.</br></br>As envisioned, the timeline presents an overview of Web history, starting with the initial proposal for hypertext by Tim Berners-Lee at CERN in 1989, initially under the name "Information Mesh." From this start date, users can explore 30 years of evolution, with links to key writings and projects that create a historical guide to the social and cultural transformations the Web has unleashed.</br></br>The ECAL study group is part of the swissnex Salon, a series of activities exploring the impact of technology on fundamental societal values drawn from the preamble of the Swiss Constitution. Their projects will playfully examine the Utopian idealism at the heart of the Web, reconnecting us to the original optimism surrounding these communication technologies with a critical engagement regarding where we have arrived today. This presents an opportunity to return a collective focus to how we might bring the human back to the center of innovation.
        </p>
      </div>
      <div class="content">
        <div class="full">
          <div class="fit-w half-w">
            <img src="../img/ecal-snx.png" alt="écal">
          </div>
          <div class="fit-w half-w">
            <img src="../img/swissnex_logo_white.png" alt="swissnex">
          </div>
        </div>
        <div class="full">
          <h4>&lt;Team ecal&gt;</h4>
          <p>Vincent Jacquier, Pauline Saglio, Laura Perrenoud, Tibor Udvari, Pietro Alberti</p></br>
          <h4>&lt;Team swissnex&gt;</h4>
          <p>Benjamin Bollmann, Mary Ellyn Johnson, Eryk Salvaggio</p></br>
          <h4>&lt;Students&gt;</h4>
          <p>Al Zouabi Alfatih, Becheras Diane, Bisseck Iyo, Boulenaz Jonathan, Breithaupt Kevin, Chenaux Maëlle, Matos Sébastien, Mouthon Bastien, Palauqui Mathieu, Sassoli De Bianchi Luca, Simmen Guillaume, Virág Tamara, Vogel Nathan, Zibaut Anouk</p></br>
        </div>
        <div class="full">
          <div class="fit-w third-w">
            <img src="../img/internet-archive-logo-transparent.png" alt="écal swissnex">
          </div>
          <div class="fit-w third-w">
            <img src="../img/wikipedia-logo-transparent.png" alt="écal swissnex">
          </div>
          <div class="fit-w third-w">
            <img src="../img/vdwhite.png" alt="canton de vaud">
          </div>
        </div>
      </div>
    </div>
    <script type="text/javascript" src="./js/splashscreen.js"></script>
    <script type="text/javascript" src="./js/preventDefaultAnchors.js"></script>
  </body>
</html>
