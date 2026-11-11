import { decorateBookmarks } from './bookmarks.js';
import { initHafalan } from './hafalan.js';
import { goToDoaWudhu, initRouteLinks, openRoute, routeFromLocation, switchSholatSub, switchTab, switchWudhuSub } from './nav.js';
import { quizChoose, quizHome, quizMatchCheck, quizMatchLeft, quizMatchRight, quizNext, quizNextLevel, quizOrderAdd, quizOrderCheck, quizOrderRemove, quizReset, quizStart, renderQuiz } from './quiz.js';
import { handleSearch } from './search.js';
import { state } from './state.js';
import { applyTheme } from './theme.js';
import { changeFontSize, closeLightbox, openLightbox, toggleSearch, toggleSettings } from './ui.js';
import { renderPembatal, renderSholatSteps, renderSholatWords, renderSyarat, renderWudhuSteps } from './views/content.js';
import { renderInfo } from './views/info.js';
import { openRagam, renderRagam, showRagamGroup, toggleRagamAll } from './views/ragam.js';
import { decorateDalilWords } from './words.js';
import './pwa.js';

function init() {
    document.documentElement.style.setProperty('--arabic-size', state.currentFontSize + 'px');
    renderSyarat();
    renderWudhuSteps();
    renderSholatSteps();
    renderSholatWords();
    renderRagam();
    renderPembatal();
    renderInfo();
    renderQuiz();
    decorateDalilWords();
    decorateBookmarks();
    initHafalan();
}

applyTheme(document.documentElement.dataset.theme);
init();

// Halaman per bagian (mis. /bacaan-sholat/) langsung membuka tab & sub-tabnya
const initialRoute = routeFromLocation();
if (initialRoute.slug) openRoute(initialRoute);
initRouteLinks();

// Handler inline di markup (onclick="...") mencari fungsi global, jadi diekspos lewat window
Object.assign(window, {
    applyTheme,
    changeFontSize,
    closeLightbox,
    goToDoaWudhu,
    handleSearch,
    openLightbox,
    openRagam,
    quizChoose,
    quizHome,
    quizMatchCheck,
    quizMatchLeft,
    quizMatchRight,
    quizNext,
    quizNextLevel,
    quizOrderAdd,
    quizOrderCheck,
    quizOrderRemove,
    quizReset,
    quizStart,
    showRagamGroup,
    switchSholatSub,
    switchTab,
    switchWudhuSub,
    toggleRagamAll,
    toggleSearch,
    toggleSettings
});
