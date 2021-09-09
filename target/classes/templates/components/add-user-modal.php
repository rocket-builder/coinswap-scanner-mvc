<div class="ui tiny coupled first modal" id="add-user-modal" style="border-radius: 50px;">
  <div class="header" style="border-top-left-radius: 60px;border-top-right-radius: 60px;border-bottom:none;">
    <h2>Регистрация нового пользователя</h2>
  </div>

  <div class="content">
      <form class="ui large form">
          <div class="field">
            <div class="ui left icon input">
              <i class="user circle icon"></i>
              <input type="text" name="text" placeholder="Логин" id="inp-user-login" style="border-radius: 35px;">
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="key icon"></i>
              <input type="password" name="password" placeholder="Пароль" id="inp-user-password" style="border-radius: 35px;">
            </div>
          </div>
          <div class="ui error message" id="error-add-user"></div>
      </form>
  </div>
  <br>
  <div class="actions" style="background: white;border-bottom-left-radius: 60px;border-bottom-right-radius: 60px;border-top-width: 2px;">

    <div class="ui small deny left aligned button" style="border-radius: 50px;">Закрыть</div>

    <div class="ui blue right aligned button"
      style="background:#1FC58E !important;border-radius: 50px;" id="btn-add-user">Зарегистрировать
    </div>
  </div>
</div>

<div class="ui tiny coupled second modal" id="add-user-result-modal" style="border-radius: 50px;">
  <div class="header" style="border-top-left-radius: 60px;border-top-right-radius: 60px;border-bottom:none;">
    <h2>Сохранение данных для входа</h2>
  </div>
  <div class="content" style="height:10em;">

      <textarea id="inp-user-login-info" style="width:100%;height:100%;border:none;font-weight:700;background:rgba(0,0,0,.05);resize:none;outline:none;border-radius:30px;padding:1em;" readonly></textarea>
  </div>
  <div class="actions" style="background: white;border-bottom-left-radius: 60px;border-bottom-right-radius: 60px;border-top-width: 2px;">
    <div class="ui small deny left aligned button" style="border-radius: 50px;">Закрыть</div>
    <div class="ui blue right aligned button"
      style="background:#1FC58E !important;border-radius: 50px;" id="btn-user-info-copy">Копировать
    </div>
  </div>
</div>
