<?php
/* Template Name: Diane */
/*
  Is it linked to a script called diane-action.js
  and a stylesheet called diane-style.js
*/
//Don't remove
get_header();
?>

<div>hello world</div>









<?php
//Don't remove
$path = get_template_directory_uri();
echo '<div id="urlfinder" urlfinder="'.$path.'/studentproject-diane/">';
get_template_part("timelinepart");?>
<?php get_footer(); ?>
