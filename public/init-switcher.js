const [DARK, LIGHT] = ["dark", "light"];
const isInputElement = (elem) => !!elem && elem instanceof HTMLInputElement;

const setColorTheme = (themeName) => {
  if (themeName === DARK) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const storeColorTheme = (themeName) =>
  localStorage.setItem("color-theme", themeName);
const getStoredColorTheme = () => localStorage.getItem("color-theme");
const toggleColorTheme = (isDark) => (isDark ? DARK : LIGHT);
const toggleThemeSwitcherState = (switcher, isDark) => {
  if (isInputElement(switcher)) {
    switcher.checked = isDark;
  }
};

const trackColorThemeChange = ({ target }) => {
  if (isInputElement(target)) {
    const colorTheme = toggleColorTheme(target.checked);
    storeColorTheme(colorTheme);
    setColorTheme(colorTheme);
  }
};

const trackSystemColorModeChange = (_, switcher, isSystemDarkModeOn) => {
  const colorTheme = toggleColorTheme(isSystemDarkModeOn);
  storeColorTheme(colorTheme);
  setColorTheme(colorTheme);
  toggleThemeSwitcherState(switcher, isSystemDarkModeOn);
};

const init = () => {
  const themeSwitcher = document.getElementById("switcher");
  const colorModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  if (themeSwitcher) {
    themeSwitcher.addEventListener("change", trackColorThemeChange);

    colorModeMediaQuery.addEventListener("change", (e) => {
      trackSystemColorModeChange(e, themeSwitcher, colorModeMediaQuery.matches);
    });

    const currentTheme = getStoredColorTheme();

    if (currentTheme === DARK) {
      toggleThemeSwitcherState(themeSwitcher, true);
    }
  }
};

init();
document.addEventListener("astro:after-swap", () => init());
