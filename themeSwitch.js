

document.getElementById('themeButton').addEventListener('click', function() {
    document.getElementById('body').classList.toggle('dark-theme');

    window.setDarkTheme(document.getElementById('body').classList.contains('dark-theme'));
  });
  