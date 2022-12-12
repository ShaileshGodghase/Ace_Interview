(function () {
  "use strict";
  const darkTogglerCheckbox = document.querySelector("#darkToggler");
  const html = document.querySelector("html");
  const darkModeToggler = () => {
    darkTogglerCheckbox.checked
      ? html.classList.remove("a4s")
      : html.classList.add("a4s");
  };
  darkModeToggler();
  darkTogglerCheckbox.addEventListener("click", darkModeToggler);
  // window.onscroll = function () {
  //   const ud_header = document.querySelector(".header");
  //   const sticky = ud_header.offsetTop;
  //   if (window.pageYOffset > sticky) {
  //     ud_header.classList.add("sticky");
  //   } else {
  //     ud_header.classList.remove("sticky");
  //   }
  // const backToTop = document.querySelector(".back-to-top");
  // if (
  //   document.body.scrollTop > 50 ||
  //   document.documentElement.scrollTop > 50
  // ) {
  //   backToTop.style.display = "flex";
  // } else {
  //   backToTop.style.display = "none";
  // }
  // };
  const menuToggler = document.querySelector(".menu-toggler");
  const menuWrapper = document.querySelector(".menu-wrapper");
  menuToggler.addEventListener("click", () => {
    menuWrapper.classList.toggle("show");
    document.body.classList.toggle("a4r");
    menuToggler.querySelector(".cross").classList.toggle("ag");
    menuToggler.querySelector(".menu").classList.toggle("ag");
  });
  document.querySelectorAll(".navbar li:not(.submenu-item) a").forEach((e) =>
    e.addEventListener("click", () => {
      menuWrapper.classList.toggle("show");
      document.body.classList.toggle("a4r");
      menuToggler.querySelector(".cross").classList.toggle("ag");
      menuToggler.querySelector(".menu").classList.toggle("ag");
    })
  );
  const submenuItems = document.querySelectorAll(".submenu-item");
  submenuItems.forEach((el) => {
    el.querySelector("a").addEventListener("click", () => {
      el.querySelector("a").classList.toggle("active");
      el.querySelector(".submenu").classList.toggle("ag");
    });
  });
  //   var wow = new WOW({ mobile: false });
  //   wow.init();
  //   function scrollTo(element, to = 0, duration = 500) {
  //     const start = element.scrollTop;
  //     const change = to - start;
  //     const increment = 20;
  //     let currentTime = 0;
  //     const animateScroll = () => {
  //       currentTime += increment;
  //       const val = Math.easeInOutQuad(currentTime, start, change, duration);
  //       element.scrollTop = val;
  //       if (currentTime < duration) {
  //         setTimeout(animateScroll, increment);
  //       }
  //     };
  //     animateScroll();
  //   }
  //   Math.easeInOutQuad = function (t, b, c, d) {
  //     t /= d / 2;
  //     if (t < 1) return (c / 2) * t * t + b;
  //     t--;
  //     return (-c / 2) * (t * (t - 2) - 1) + b;
  //   };
  //   document.querySelector(".back-to-top").onclick = () => {
  //     scrollTo(document.documentElement);
  //   };
})();
