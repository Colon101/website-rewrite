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
  );
const navbar = nav(
  a(
    img("assets/img/logo.png").att$("width", "40px").att$("height", "40px")
  ).att$("href", "#/"),
  ul(
    li(a("Minecraft").att$("href", "#/minecraft")),
    li(a("Overlays").att$("href", "#/overlays")),
    li(a("Store").att$("href", "https://store.scrims.network/")),
    li(a("About").att$("href", "#/about"))
  )
).att$("class", "navbar");
function showCopyMessage() {
  var copyMessage = document.getElementById('copyMessage');
  copyMessage.classList.add('show');

  // Hide the message after 1 second
  setTimeout(function () {
    hideCopyMessage();
  }, 1000);
}

function hideCopyMessage() {
  var copyMessage = document.getElementById('copyMessage');
  copyMessage.classList.remove('show');
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
      discordIFrame
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
      button("BridgeScrims.net").att$("id", "IpButton").onclick$(function () {
        navigator.clipboard.writeText("bridgescrims.net");
        showCopyMessage()
      },
      ), div("Copied").att$("id", "copyMessage")
    ).att$("class", "text-box")
  );
}
function page404() {
  return div(navbar, h1("404 page"));
}
const r = router({
  "/": home,
  "/minecraft": minecraft,
  // "/overlays": overlay,
  // "/about": about,
  "/404": page404,
});
entry.appendChild(r);
