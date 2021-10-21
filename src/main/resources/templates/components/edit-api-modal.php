<div class="ui tiny modal segment" id="edit-swapper-modal" style="border-radius: 50px;"
  swapper-id="0" swapper-preset-id="0">
  <div class="header" style="border-top-left-radius: 60px;border-top-right-radius: 60px;border-bottom:none;">
    <h2>
      <span id="title"></span>
      <div class="ui toggle checkbox">
         <input type="checkbox" name="public" id="inp-active">
      </div>
    </h2>
  </div>

  <div class="content" style="border-radius: 50px;">
      <form class="ui large form" style="text-align: center;">

            <div class="two fields">
              <div class="field">
                <div class="ui labeled input">
                  <div class="ui label"
                  style="border-top-left-radius: 35px;border-bottom-left-radius: 35px;"
                  ><i class="bitcoin icon"></i>min</div>
                  <input type="text" placeholder="eth\bnb" id="inp-token-min-amount"
                    style="border-top-right-radius: 35px;border-bottom-right-radius: 35px;">
                </div>
              </div>

              <div class="field">
                <div class="ui labeled input">
                  <div class="ui label"
                  style="border-top-left-radius: 35px;border-bottom-left-radius: 35px;"
                  ><i class="bitcoin icon"></i>max</div>
                  <input type="text" placeholder="eth\bnb" id="inp-token-max-amount"
                    style="border-top-right-radius: 35px;border-bottom-right-radius: 35px;">
                </div>
              </div>
            </div>

            <div class="field">
              <div class="ui fluid labeled input">
                <div class="ui label"
                style="border-top-left-radius: 35px;border-bottom-left-radius: 35px;"
                ><i class="percent icon"></i>liquidity</div>
                <input type="text" is-infinity="false" placeholder="прирост ликвидности" id="inp-liquidity-percent"
                  style="border-top-right-radius: 35px;border-bottom-right-radius: 35px;">
              </div>
            </div>

          <div class="ui error message" id="edit-add-swapper"></div>
      </form>
  </div>
  <br>
  <div class="actions" style="background: white;border-bottom-left-radius: 60px;border-bottom-right-radius: 60px;border-top-width: 2px;">
    <div class="ui small deny left aligned button" style="border-radius: 50px;">Закрыть</div>
    <div class="ui blue right aligned button"
      style="background:#1FC58E !important;border-radius: 50px;border: 2px solid black;color:black;" id="btn-edit-api">Сохранить
    </div>
  </div>
</div>
</div>
