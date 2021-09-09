function setCookie(name, value) {
  document.cookie = name + "=" + value;
}
function getCookie(name) {
  var r = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  if (r) return r[2];
  else return "";
}
function deleteCookie(name) {
  var date = new Date(); // Берём текущую дату
  date.setTime(date.getTime() - 1); // Возвращаемся в "прошлое"
  document.cookie = name += "=; expires=" + date.toGMTString(); // Устанавливаем cookie пустое значение и срок действия до прошедшего уже времени
}
