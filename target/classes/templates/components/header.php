<div class="ui container">
  <div class="ui large stackable secondary menu">

    <a href="profile.php" class="item dreamer">
      <h2 class="ui image header">
        <i class="big bitcoin icon" style="color:#FAE62D;"></i>
        <div class="content">
          <h2 class="marker" style="font-size:1.55em;">coinswap scanner</h2>
        </div>
      </h2>
    </a>

    <a class="active item"><i class="user circle icon"></i><?php echo $user->login; ?></a>
    <?php
    if ($user->role != 'ADMIN'){
      echo '
      <a class="item colorable" href="shops.php" id="link-shop">Магазин&nbsp;<i class="shopping basket icon"></i></a>
      <a class="item colorable" href="profile.php">Настройки уведомлений&nbsp;<i class="cogs icon"></i></a>
      <a class="item colorable" href="telegram.php">Tелеграм&nbsp;<i class="paper plane outline icon"></i></a>
      ';
    } else {
      echo '
      <a class="item" href="admin.php">Пользователи&nbsp;<i class="user circle outline icon ico-blue"></i></a>
      ';
    }
    ?>

    <div class="right item">
      <div class="ui small button" style="border-radius: 50px;font-size:0.9em!important;" id="btn-logout">Выход</div>
    </div>
  </div>
</div>

<?php
  if ($user->role != 'ADMIN'){
    echo '
    <div class="account" style="width: 8em;text-align:center;position: absolute;z-index: 2;user-select:none;background: white;padding: 0.2em;">
      <i class="calendar alternate outline icon" style=";margin: 0em;"></i>
      Подписка до<br><b>'.normalizeDate($user->subscribeDate).'</b>
    </div>
    ';
  }
?>

<?php
  function normalizeDate($dateString)
  {
    if(is_null($dateString)){
      return "😎 оу щит 😎";
    }
    $dateString = substr($dateString, 0, strpos($dateString, "T"));
    $arr = array_reverse(explode("-", $dateString));

    $res = "";
    foreach ($arr as $elm) {
      $res .= $elm.".";
    }
    $res = substr($res, 0, strlen($res)-1);

    return $res;
  }
?>
