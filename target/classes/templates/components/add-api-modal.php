<div class="ui tiny modal" id="add-swapper-modal" style="border-radius: 50px;">
  <div class="header" style="border-top-left-radius: 60px;border-top-right-radius: 60px;border-bottom:none;">
    <h2>Добавление фильтра по API</h2>
  </div>

  <div class="content" style="border-radius: 50px;">
      <form class="ui large form" style="text-align: center;">

          <div class="field">
            <div class="ui fluid selection dropdown" style="border-radius: 25px;">
              <input type="hidden" name="user" id="inp-swapper">
              <i class="dropdown icon"></i>
              <div class="default text">Выберете API</div>
              <div class="menu" style="border-bottom-right-radius: 25px;border-bottom-left-radius: 25px;">

                <?php
                  foreach ($api->get("/swapper", []) as $swapper) {
                    echo '
                    <div class="item" data-value="'.$swapper->id.'">
                      <img class="ui mini avatar image" src="'.$swapper->pictureUrl.'">
                      '.$swapper->title.'
                    </div>
                    ';
                  }
                ?>
              </div>
            </div>
          </div>

          <div class="ui error message" id="error-add-swapper"></div>
      </form>
  </div>
  <br>
  <div class="actions" style="background: white;border-bottom-left-radius: 60px;border-bottom-right-radius: 60px;border-top-width: 2px;">
    <div class="ui small deny left aligned button" style="border-radius: 50px;">Закрыть</div>
    <div class="ui blue right aligned button"
      style="background:#1FC58E !important;border-radius: 50px;border: 2px solid black;color:black;" id="btn-add-api">Добавить
    </div>
  </div>
</div>
</div>
