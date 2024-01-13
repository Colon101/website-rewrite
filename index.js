function tag(name, ...children) {
  const result = document.createElement(name);
  for (const child of children) {
    if (typeof child === "string") {
      result.appendChild(document.createTextNode(child));
    } else {
      result.appendChild(child);
    }
  }

  result.att$ = function (name, value) {
    this.setAttribute(name, value);
    return this;
  };

  result.onclick$ = function (callback) {
    this.onclick = callback;
    return this;
  };

  return result;
}

const MUNDANE_TAGS = [
  "canvas",
  "h1",
  "h2",
  "h3",
  "p",
  "a",
  "div",
  "span",
  "select",
  "header",
  "button",
  "nav",
  "li",
  "ul",
  "ol",
];
for (let tagName of MUNDANE_TAGS) {
  window[tagName] = (...children) => tag(tagName, ...children);
}

function img(src) {
  return tag("img").att$("src", src);
}

function input(type) {
  return tag("input").att$("type", type);
}
function iframe(src) {
  return tag("iframe").att$("src", src);
}
function router(routes) {
  let result = div();

  function syncHash() {
    uncheckIfChecked()
    let hashLocation = document.location.hash.split("#")[1];
    if (!hashLocation) {
      hashLocation = "/";
    }

    if (!(hashLocation in routes)) {
      // TODO(#2): make the route404 customizable in the router component
      const route404 = "/404";

      hashLocation = route404;
    }

    result.replaceChildren(routes[hashLocation]());

    return result;
  }

  syncHash();

  // TODO(#3): there is way to "destroy" an instance of the router to make it remove it's "hashchange" callback
  window.addEventListener("hashchange", syncHash);

  result.refresh = syncHash;

  return result;
}
const discordIFrame = iframe(
  "https://discord.com/widget?id=759894401957888031&theme=dark"
)
  .att$("width", "500px")
  .att$("height", "500px")
  .att$("title", "Bridge Scrims Discord Overview")
  .att$(
    "sandbox",
    "allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
  )
const navbar = header(
  div(
    a(
      img("assets/img/logo.png").att$("width", "50px").att$("height", "50px").onclick$(uncheckIfChecked)
    ).att$("href", "#/")
  ).att$("class", "logo"),
  div(
    input("checkbox").att$("class", "toggle-menu").att$("id", "hamToggle"),
    div().att$("class", "hamburger"),
    ul(
      li(a("Minecraft").att$("href", "#/minecraft")).onclick$(uncheckIfChecked),
      li(a("Store").att$("href", "https://store.scrims.network/")).onclick$(uncheckIfChecked),
      li(a("Overlays").att$("href", "#/overlays")).onclick$(uncheckIfChecked),
      li(a("About").att$("href", "#/about")).onclick$(uncheckIfChecked)
    ).att$("class", "menu")
  ).att$("class", "navigation")
).att$("class", "header");
document.addEventListener("click", function (event) {
  var navDiv = document.querySelector('.navigation');
  if (!navDiv.contains(event.target)) {
    console.log("clicked outside of navdiv")
    uncheckIfChecked()
  }
});
function uncheckIfChecked() {
  try {
    var checkbox = document.getElementById('hamToggle');

    if (checkbox.checked) {
      checkbox.checked = false;
    }
  }
  catch (e) {
    console.log("wasnt found yet")
  }
}
function showCopyMessage() {
  var copyMessage = document.getElementById("copyMessage");
  copyMessage.classList.add("show");

  setTimeout(function () {
    hideCopyMessage();
  }, 1000);
}

function hideCopyMessage() {
  var copyMessage = document.getElementById("copyMessage");
  copyMessage.classList.remove("show");
}
function home() {
  return div(
    navbar,
    div(
      div(
        h1("The largest"),
        h1("Bridge"),
        h1("Community"),
        h1("on ", a("Discord").att$("href", "https://discord.gg/bridgescrims"))
      ).att$("id", "page-description"),
      discordIFrame.att$("id", "discordIFrame")
    ).att$("id", "home-container")
  );
}
function about() {
  return div(navbar, h1("you never made an about page lulw"));
}
function overlay() {
  // will use an api to grab the files from gh
  return div(navbar, h1("overlay page"));
}
function minecraft() {
  return div(
    navbar,
    div(
      h1("Join our feature-rich Minecraft server at"),
      button(span("BridgeScrims.net"))
        .att$("id", "IpButton")
        .onclick$(function () {
          navigator.clipboard.writeText("bridgescrims.net");
          showCopyMessage();
        }),
      div("Copied to clipboard!").att$("id", "copyMessage")
    ).att$("class", "text-box")
  );
}
function page404() {
  return div(
    navbar,
    div(
      h1("404 - Page Not Found"),
      p("Hope you find what you're looking for")
    ).att$("class", "page404")
  );
}
const r = router({
  "/": home,
  "/minecraft": minecraft,
  // "/overlays": overlay,
  // "/about": about,
  "/404": page404,
});
entry.appendChild(r);
