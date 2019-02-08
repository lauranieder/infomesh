<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Information mesh</title>
  <meta name="description" content="Information mesh">
  <meta name="author" content="SitePoint">
  <!--styles-->
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/style.css">
  <!--script-->
  <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
  <script type="text/javascript" src="js/script.js"></script>
  <script>
  var currentPagetName = "<? echo str_replace('/', '', $_SERVER['REQUEST_URI']); ?>";
  </script>
</head>
<body>
  <header id="navigation">
    <h1 id="project-title">Information mesh</h1>
    <nav class="d-none">
      <a href="#" id="button-toggle-informations">&lt;less information&gt;</a>
      <a href="#" id="button-up">up</a>
      <a href="#" id="button-down">down</a>
    </nav>
  </header>
  <div id=wrapper>
    <div id="container-side" class="container d-flex side background-blue">
      <div class="content flex-top">
      </div>
      <div class="content flex-middle">
        <div id="project-text"></div>
        <div id="project-credits"></div>
      </div>
      <div class="content flex-bottom font-large">
        <a href="#" id="button-open-projects">/Projects</a>
        <a href="#" id="button-open-about" class="selected">/About</a>
      </div>
    </div>
    <div id="container-about" class="container d-flex main background-blue">
      <div class="content">
        <p>The Information Mesh site celebrates the 30th anniversary of CERN's creation of the World Wide Web by creating a social, technical, cultural, and legal timeline of Web history. Within this timeline, key historical developments are brought to life through interactive experiences created by Interaction Design students at the Swiss design school ECAL. 17 students will come to San Francisco in October 2018 for a week-long study tour organized by swissnex San Francisco, where they will visit key data visualization companies and partners and begin to develop the project.</br></br>As envisioned, the timeline presents an overview of Web history, starting with the initial proposal for hypertext by Tim Berners-Lee at CERN in 1989, initially under the name "Information Mesh." From this start date, users can explore 30 years of evolution, with links to key writings and projects that create a historical guide to the social and cultural transformations the Web has unleashed.</br></br>The ECAL study group is part of the swissnex Salon, a series of activities exploring the impact of technology on fundamental societal values drawn from the preamble of the Swiss Constitution. Their projects will playfully examine the Utopian idealism at the heart of the Web, reconnecting us to the original optimism surrounding these communication technologies with a critical engagement regarding where we have arrived today. This presents an opportunity to return a collective focus to how we might bring the human back to the center of innovation.
        </p>
      </div>
      <div class="content">
        <div class="full">
          <div class="fit-w half-w">
            <img src="../img/ecal-snx.png" alt="écal swissnex">
          </div>
          <div class="fit-w half-w">
            <img src="../img/swissnex_logo_white.png" alt="écal swissnex">
          </div>
        </div>
        <div class="full">
          <h4>&lt;Team ecal&gt;</h4>
          <p>Vincent Jacquier, Pauline Saglio, Laura Perrenoud, Tibor Udvari</p></br>
          <h4>&lt;Team swissnex&gt;</h4>
          <p>Mary Ellyn Johnson, Eryk Salvaggio</p></br>
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
        </div>
      </div>
    </div>
    <div id="container-projects" class="container d-flex reduced">
      <div class="project-list"></div>
    </div>
    <div id="container-main" class="container reduced"><div id="timeline-cursor"><div id="timeline-barre"></div></div>
  </div>
</body>
</html>
